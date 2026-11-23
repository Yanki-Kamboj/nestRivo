const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Review = require('../models/Review');
const { AppError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getPropertyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ property: req.params.propertyId })
    .populate('guest', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});

exports.createReview = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.body.bookingId,
    guest: req.user._id,
    $or: [
      { status: 'completed' },
      { status: 'confirmed', checkOut: { $lte: new Date() } },
    ],
  }).select('property');
  if (!booking) throw new AppError('Only guests with a completed stay can review it', 403);

  const existing = await Review.exists({ booking: booking._id });
  if (existing) throw new AppError('A review already exists for this stay', 409);

  const review = await Review.create({
    booking: booking._id,
    property: booking.property,
    guest: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  res.status(201).json({ success: true, data: review });
});

exports.respondToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new AppError('Review not found', 404);

  const ownedProperty = await Property.exists({ _id: review.property, host: req.user._id });
  if (!ownedProperty) throw new AppError('Review not found', 404);

  review.hostResponse = req.body.response;
  await review.save();
  res.json({ success: true, data: review });
});
