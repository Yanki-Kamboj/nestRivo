const rateLimit = require('express-rate-limit');

// Example: 5 requests per minute for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests, try again later.' },
});

module.exports = authLimiter;
