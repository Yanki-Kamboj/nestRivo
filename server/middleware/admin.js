// server/middleware/admin.js
// Simple admin guard – assumes `protect` middleware already attached `req.user`.
// Checks the persisted account capability; a client-supplied role is never trusted.

module.exports = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required' });
};