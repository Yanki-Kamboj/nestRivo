const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const protect = require('../middleware/protect');
const requireCapability = require('../middleware/requireCapability');
const validate = require('../middleware/validate');
const { hostOnboardingSchema } = require('../validators/hostValidator');
const {
  completeOnboarding,
  getOverview,
  getBlockedDates,
  addBlockedDate,
  removeBlockedDate,
} = require('../controllers/hostController');
const { bookingStatusSchema, blockedDateSchema } = require('../validators/hostValidator');
const { getHostBookings, updateBookingStatus } = require('../controllers/bookingController');

const router = express.Router();

router.put('/onboarding', protect, validate(hostOnboardingSchema), asyncHandler(completeOnboarding));
router.get('/overview', protect, requireCapability('host'), asyncHandler(getOverview));
router.get('/bookings', protect, requireCapability('host'), asyncHandler(getHostBookings));
router.patch('/bookings/:bookingId/status', protect, requireCapability('host'), validate(bookingStatusSchema), asyncHandler(updateBookingStatus));
router.get('/properties/:propertyId/blocked-dates', protect, requireCapability('host'), asyncHandler(getBlockedDates));
router.post('/properties/:propertyId/blocked-dates', protect, requireCapability('host'), validate(blockedDateSchema), asyncHandler(addBlockedDate));
router.delete('/blocked-dates/:blockedDateId', protect, requireCapability('host'), asyncHandler(removeBlockedDate));

module.exports = router;
