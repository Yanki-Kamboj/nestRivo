const Booking = require('../models/Booking');
const HostBlockedDate = require('../models/HostBlockedDate');
const Property = require('../models/Property');
const Review = require('../models/Review');
const { AppError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const CLEANING_FEE = 30;
const EXTRA_GUEST_FEE = 10;
const SERVICE_FEE_RATE = 0.1;
const TAX_RATE = 0.07;
const WEEKEND_MULTIPLIER = 1.2;
const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed'];
const MILLISECONDS_PER_NIGHT = 24 * 60 * 60 * 1000;

const getQuote = (price, start, end, guests) => {
  const nights = Math.round((end - start) / MILLISECONDS_PER_NIGHT);
  const basePrice = price * nights;
  let weekendCount = 0;

  for (let index = 0; index < nights; index += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    if (date.getUTCDay() === 0 || date.getUTCDay() === 6) weekendCount += 1;
  }

  const weekendSurcharge = price * (WEEKEND_MULTIPLIER - 1) * weekendCount;
  const extraGuestFee = Math.max(0, guests - 2) * EXTRA_GUEST_FEE * nights;
  const cleaningFee = CLEANING_FEE;
  const subtotal = basePrice + weekendSurcharge + extraGuestFee + cleaningFee;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const taxes = subtotal * TAX_RATE;

  return {
    nights,
    basePrice,
    weekendSurcharge,
    cleaningFee,
    extraGuestFee,
    serviceFee: Number(serviceFee.toFixed(2)),
    taxes: Number(taxes.toFixed(2)),
    totalPrice: Number((subtotal + serviceFee + taxes).toFixed(2)),
  };
};

const parseStay = (checkIn, checkOut, guests) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const guestCount = Number(guests);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start ||
    start < new Date(new Date().setHours(0, 0, 0, 0)) ||
    !Number.isInteger(guestCount) ||
    guestCount < 1
  ) {
    throw new AppError('Choose valid dates and a guest count', 400);
  }

  return { start, end, guestCount };
};

exports.calculateQuote = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guests } = req.body;
  const property = await Property.findOne({
    _id: propertyId,
    isActive: true,
    approvalStatus: 'approved',
  }).select('price maxGuests');
  if (!property) throw new AppError('Property not found', 404);

  const { start, end, guestCount } = parseStay(checkIn, checkOut, guests);
  if (guestCount > property.maxGuests) throw new AppError('Guest count exceeds this property’s capacity', 400);

  res.json({ success: true, data: getQuote(property.price, start, end, guestCount) });
});

exports.createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guests } = req.body;
  const property = await Property.findOne({
    _id: propertyId,
    isActive: true,
  });
  if (!property) throw new AppError('Property not found', 404);
  if (property.host.equals(req.user._id)) {
    throw new AppError('You cannot book your own property', 400);
  }
  if (property.approvalStatus !== 'approved') throw new AppError('Property not found', 404);

  const { start, end, guestCount } = parseStay(checkIn, checkOut, guests);
  if (guestCount > property.maxGuests) throw new AppError('Guest count exceeds this property’s capacity', 400);

  const blocked = await HostBlockedDate.exists({
    property: property._id,
    start: { $lt: end },
    end: { $gt: start },
  });
  if (blocked) throw new AppError('Those dates are unavailable', 400);

  const conflict = await Booking.exists({
    property: property._id,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });
  if (conflict) throw new AppError('Those dates conflict with another booking', 409);

  const quote = getQuote(property.price, start, end, guestCount);
  const booking = await Booking.create({
    property: property._id,
    guest: req.user._id,
    host: property.host,
    checkIn: start,
    checkOut: end,
    totalPrice: quote.totalPrice,
  });

  res.status(201).json({ success: true, data: booking });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate('property', 'title location images price host')
    .sort({ checkIn: -1 });
  const reviews = await Review.find({
    booking: { $in: bookings.map(booking => booking._id) },
  }).select('booking');
  const reviewedBookings = new Set(reviews.map(review => String(review.booking)));
  res.json({
    success: true,
    data: bookings.map(booking => ({
      ...booking.toObject(),
      reviewed: reviewedBookings.has(String(booking._id)),
    })),
  });
});

exports.getHostBookings = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).select('_id');
  const bookings = await Booking.find({
    $or: [
      { host: req.user._id },
      { property: { $in: properties.map(property => property._id) } },
    ],
  })
    .populate('property', 'title location')
    .populate('guest', 'name email')
    .sort({ checkIn: 1 });
  res.json({ success: true, data: bookings });
});

exports.cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, guest: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (!ACTIVE_BOOKING_STATUSES.includes(booking.status) || booking.checkIn <= new Date()) {
    throw new AppError('This booking can no longer be cancelled', 400);
  }

  booking.status = 'cancelled';
  await booking.save();
  res.json({ success: true, data: booking });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) throw new AppError('Booking not found', 404);

  const property = await Property.findOne({ _id: booking.property, host: req.user._id }).select('_id');
  if (!property || (booking.host && !booking.host.equals(req.user._id))) {
    throw new AppError('Booking not found', 404);
  }
  if (req.body.status === 'completed') {
    if (booking.status !== 'confirmed' || booking.checkOut > new Date()) {
      throw new AppError('Only confirmed stays that have ended can be completed', 400);
    }
  } else if (booking.status !== 'pending') {
    throw new AppError('Only pending bookings can be updated', 400);
  }

  if (req.body.status === 'confirmed') {
    const conflict = await Booking.exists({
      _id: { $ne: booking._id },
      property: booking.property,
      status: { $in: ACTIVE_BOOKING_STATUSES },
      checkIn: { $lt: booking.checkOut },
      checkOut: { $gt: booking.checkIn },
    });
    if (conflict) throw new AppError('Those dates conflict with another booking', 409);
  }

  booking.status = req.body.status;
  await booking.save();
  res.json({ success: true, data: booking });
});
