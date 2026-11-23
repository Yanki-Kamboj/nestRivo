const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const protect = require('../middleware/protect');
const requireCapability = require('../middleware/requireCapability');
const validate = require('../middleware/validate');
const { bookingSchema } = require('../validators/bookingValidator');
const {
  calculateQuote,
  createBooking,
  getMyBookings,
  cancelMyBooking,
} = require('../controllers/bookingController');

const router = express.Router();

// Public endpoint to calculate booking price quote
router.post('/quote', validate(bookingSchema), asyncHandler(calculateQuote));
router.get('/mine', protect, requireCapability('guest'), asyncHandler(getMyBookings));
router.post('/', protect, requireCapability('guest'), validate(bookingSchema), asyncHandler(createBooking));
router.patch('/:bookingId/cancel', protect, requireCapability('guest'), asyncHandler(cancelMyBooking));

module.exports = router;
