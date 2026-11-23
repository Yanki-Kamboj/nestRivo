const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const hostProfileSchema = new mongoose.Schema({
  displayName: { type: String, trim: true },
  phone: { type: String, trim: true },
  bio: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ['not_started', 'active', 'suspended'], default: 'not_started' },
  onboardedAt: { type: Date },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  roles: { type: [{ type: String, enum: ['guest', 'host'] }], default: ['guest'] },
  isAdmin: { type: Boolean, default: false },
  hostProfile: { type: hostProfileSchema, default: () => ({}) },
  // Kept during the role migration so older accounts and clients continue to work.
  role: { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },
  isSuspended: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('validate', function(next) {
  const roles = new Set(this.roles || []);
  roles.add('guest');
  if (this.role === 'host') roles.add('host');
  if (this.role === 'admin') this.isAdmin = true;

  this.roles = [...roles];
  this.role = this.isAdmin ? 'admin' : (roles.has('host') ? 'host' : 'guest');
  next();
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
