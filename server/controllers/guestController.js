const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');

exports.getOverview = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id }).select('status checkIn totalPrice');
  const now = new Date();
  const upcoming = bookings.filter(booking =>
    ['pending', 'confirmed'].includes(booking.status) && booking.checkIn >= now
  ).length;
  const past = bookings.filter(booking =>
    ['completed', 'confirmed'].includes(booking.status) && booking.checkIn < now
  ).length;
  const cancelled = bookings.filter(booking => booking.status === 'cancelled').length;
  const totalSpent = bookings
    .filter(booking => ['confirmed', 'completed'].includes(booking.status))
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  res.json({
    success: true,
    data: {
      totalBookings: bookings.length,
      upcoming,
      past,
      cancelled,
      totalSpent: Number(totalSpent.toFixed(2)),
    },
  });
});
