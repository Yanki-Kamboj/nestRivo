const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  maxGuests: { type: Number, min: 1, default: 2 },
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  approvalStatus: { type: String, enum: ['approved'], default: 'approved' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Generate slug before save
propertySchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// Text index for search
propertySchema.index({ title: 'text', description: 'text', location: 'text' });
// Compound index for filters (example)
propertySchema.index({ price: 1, approvalStatus: 1, isActive: 1 });

// Additional index for active/approved queries
propertySchema.index({ isActive: 1, approvalStatus: 1 });
module.exports = mongoose.model('Property', propertySchema);
