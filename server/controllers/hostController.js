const Booking = require('../models/Booking');
const HostBlockedDate = require('../models/HostBlockedDate');
const Property = require('../models/Property');
const { AppError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.completeOnboarding = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.hostProfile?.status === 'suspended') {
    throw new AppError('Host access is suspended. Contact support for assistance.', 403);
  }
  user.hostProfile = {
    ...(user.hostProfile ? user.hostProfile.toObject() : {}),
    ...req.body,
    status: 'active',
    onboardedAt: user.hostProfile.onboardedAt || new Date(),
  };
  user.roles = [...new Set([...(user.roles || []), 'guest', 'host'])];
  if (!user.isAdmin && user.role !== 'admin') user.role = 'host';
  await user.save();

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isAdmin: Boolean(user.isAdmin),
      role: user.role,
      hostProfile: user.hostProfile,
    },
  });
});

exports.getOverview = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).select('_id isActive approvalStatus');
  const propertyIds = properties.map(property => property._id);
  const bookings = await Booking.find({
    $or: [{ host: req.user._id }, { property: { $in: propertyIds } }],
  }).select('property host status totalPrice checkIn checkOut');
  const completed = bookings.filter(booking => booking.status === 'completed');
  const feePercent = Number(process.env.PLATFORM_FEE_PERCENT || 10);
  const monthlyRevenue = new Map();

  completed.forEach(booking => {
    const month = (booking.checkOut || booking.checkIn).toISOString().slice(0, 7);
    const current = monthlyRevenue.get(month) || 0;
    monthlyRevenue.set(month, current + booking.totalPrice);
  });

  const revenue = [...monthlyRevenue.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([month, gross]) => ({
      month,
      gross,
      net: Number((gross * (1 - feePercent / 100)).toFixed(2)),
    }));

  res.json({
    success: true,
    data: {
      analytics: {
        totalListings: properties.length,
        activeListings: properties.filter(property => property.isActive && property.approvalStatus === 'approved').length,
        totalBookings: bookings.length,
        upcomingBookings: bookings.filter(booking =>
          ['pending', 'confirmed'].includes(booking.status) && booking.checkIn >= new Date()
        ).length,
        earnings: Number(revenue.reduce((total, entry) => total + entry.net, 0).toFixed(2)),
        revenue,
      },
    },
  });
});

exports.getBlockedDates = asyncHandler(async (req, res) => {
  const property = await Property.findOne({ _id: req.params.propertyId, host: req.user._id }).select('_id');
  if (!property) throw new AppError('Property not found', 404);

  const dates = await HostBlockedDate.find({ property: property._id }).sort({ start: 1 });
  res.json({ success: true, data: dates });
});

exports.addBlockedDate = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { start, end, reason } = req.body;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    throw new AppError('Choose a valid date range', 400);
  }

  const property = await Property.findOne({ _id: propertyId, host: req.user._id }).select('_id');
  if (!property) throw new AppError('Property not found', 404);

  const bookingConflict = await Booking.exists({
    property: property._id,
    status: { $in: ['pending', 'confirmed'] },
    checkIn: { $lt: endDate },
    checkOut: { $gt: startDate },
  });
  if (bookingConflict) throw new AppError('Dates overlap an existing booking', 409);

  const blockedDate = await HostBlockedDate.create({
    property: property._id,
    start: startDate,
    end: endDate,
    reason,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, data: blockedDate });
});

exports.removeBlockedDate = asyncHandler(async (req, res) => {
  const blockedDate = await HostBlockedDate.findOne({
    _id: req.params.blockedDateId,
    createdBy: req.user._id,
  });
  if (!blockedDate) throw new AppError('Blocked date not found', 404);

  const ownedProperty = await Property.exists({ _id: blockedDate.property, host: req.user._id });
  if (!ownedProperty) throw new AppError('Blocked date not found', 404);

  await blockedDate.deleteOne();
  res.json({ success: true, message: 'Availability updated' });
});
