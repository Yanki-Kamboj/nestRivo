const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');
const mongoose = require('mongoose');
const { AppError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getWishlistStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.propertyId)) {
    throw new AppError('Property not found', 404);
  }
  const saved = await Wishlist.exists({ user: req.user._id, property: req.params.propertyId });
  res.json({ success: true, data: { saved: Boolean(saved) } });
});

exports.getMyWishlist = asyncHandler(async (req, res) => {
  const entries = await Wishlist.find({ user: req.user._id })
    .populate('property', 'title location price images isActive approvalStatus')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: entries });
});

exports.addToWishlist = asyncHandler(async (req, res) => {
  const property = await Property.findOne({
    _id: req.params.propertyId,
    isActive: true,
    approvalStatus: 'approved',
  }).select('_id');
  if (!property) throw new AppError('Property not found', 404);

  const entry = await Wishlist.findOneAndUpdate(
    { user: req.user._id, property: property._id },
    { $setOnInsert: { user: req.user._id, property: property._id } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ success: true, data: entry });
});

exports.removeFromWishlist = asyncHandler(async (req, res) => {
  await Wishlist.deleteOne({ user: req.user._id, property: req.params.propertyId });
  res.json({ success: true, message: 'Wishlist updated' });
});
