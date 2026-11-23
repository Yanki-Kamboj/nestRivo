const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const emailService = require('../services/emailService');

// Helper to create tokens
const signToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const serializeUser = user => {
  const roles = new Set(user.roles || []);
  roles.add('guest');
  if (user.role === 'host') roles.add('host');
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: [...roles],
    isAdmin: Boolean(user.isAdmin || user.role === 'admin'),
    role: user.role,
    hostProfile: user.hostProfile,
  };
};

// Register
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('User already exists', 400));
  }

  const user = await User.create({ name, email, password, role: 'guest', roles: ['guest'], isAdmin: false });

  // Send verification email (placeholder)
  await emailService.sendVerificationEmail(user.email, 'dummy-token');

  res.status(201).json({ success: true, data: serializeUser(user) });
});

// Login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new AppError('Invalid credentials', 401));
  }

  const accessToken = signToken(user._id, '15m');
  const refreshToken = signToken(user._id, '7d');

  res
    .cookie('accessToken', accessToken, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' })
    .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' })
    .json({ success: true, data: { accessToken, user: serializeUser(user) } });
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken').clearCookie('refreshToken').json({ success: true, message: 'Logged out' });
});

// Get current user
exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({ success: true, data: serializeUser(req.user) });
});

// Refresh token
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new AppError('No refresh token provided', 401);
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const newAccess = signToken(decoded.id, '15m');
  res.cookie('accessToken', newAccess, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' })
    .json({ success: true, accessToken: newAccess });
});

// Forgot password (send reset email)
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link was sent' });
  }
  const token = signToken(user._id, '1h'); // simple token
  await emailService.sendResetPasswordEmail(email, token);
  res.json({ success: true, message: 'If that email exists, a reset link was sent' });
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(decoded.id, { password: hashed });
  res.json({ success: true, message: 'Password reset' });
});

// Verify email (dummy implementation)
exports.verifyEmail = asyncHandler(async (req, res) => {
  // token would be verified similarly to reset
  res.json({ success: true, message: 'Email verified' });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const updates = { name: req.body.name, email: req.body.email };
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json({ success: true, data: user });
});

// Change password (authenticated)
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    return next(new AppError('Current password incorrect', 401));
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed' });
});
