const { AppError } = require('../utils/AppError');

const hasCapability = (user, capability) => {
  if (!user) return false;
  const capabilities = user.roles || [];

  if (capability === 'admin') {
    return Boolean(user.isAdmin || user.role === 'admin');
  }
  if (capability === 'host') {
    return user.hostProfile?.status !== 'suspended' && (capabilities.includes('host') || user.role === 'host');
  }
  return capabilities.includes(capability) || user.role === capability;
};

const requireCapability = capability => (req, res, next) => {
  if (!hasCapability(req.user, capability)) {
    return next(new AppError(`${capability} access required`, 403));
  }
  next();
};

module.exports = requireCapability;
module.exports.hasCapability = hasCapability;
module.exports.requireGuest = requireCapability('guest');
module.exports.requireHost = requireCapability('host');
module.exports.requireAdmin = requireCapability('admin');
