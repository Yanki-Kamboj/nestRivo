const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword, verifyEmail, updateProfile, changePassword } = require('../controllers/authController');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/protect');

const router = express.Router();

// Rate limiting (example, will be set globally elsewhere if needed)

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(getMe));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(resetPassword));
router.get('/verify-email/:token', asyncHandler(verifyEmail));
router.put('/profile', protect, asyncHandler(updateProfile));
router.put('/change-password', protect, asyncHandler(changePassword));

module.exports = router;
