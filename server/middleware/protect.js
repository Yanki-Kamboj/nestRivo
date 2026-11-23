const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new AppError('Not authenticated', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.isSuspended) {
      return next(new AppError('Account is unavailable', 401));
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid token', 401));
    }
    next(err);
  }
};

module.exports = protect;
