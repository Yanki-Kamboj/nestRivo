const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { searchProperties, getPopularDestinations, getTrendingProperties, getFeaturedProperties } = require('../controllers/propertyController');
const protect = require('../middleware/protect');
const { requireHost } = require('../middleware/requireCapability');
const validate = require('../middleware/validate');
const { propertySchema } = require('../validators/propertyValidator');
const { uploadPropertyImages, normalizePropertyForm } = require('../services/uploadService');
const { getPropertyReviews } = require('../controllers/reviewController');
const {
  listMyProperties,
  createProperty,
  updateMyProperty,
  deleteMyProperty,
  getPropertyById,
} = require('../controllers/propertyController');

const router = express.Router();

router.get('/popular-destinations', asyncHandler(getPopularDestinations));
router.get('/trending', asyncHandler(getTrendingProperties));
router.get('/featured', asyncHandler(getFeaturedProperties));
router.get('/mine', protect, requireHost, asyncHandler(listMyProperties));
router.post(
  '/',
  protect,
  requireHost,
  uploadPropertyImages,
  normalizePropertyForm,
  validate(propertySchema),
  asyncHandler(createProperty)
);
router.patch('/:id', protect, requireHost, validate(propertySchema.partial()), asyncHandler(updateMyProperty));
router.delete('/:id', protect, requireHost, asyncHandler(deleteMyProperty));
router.get('/:propertyId/reviews', asyncHandler(getPropertyReviews));
router.get('/:id/availability', asyncHandler(require('../controllers/propertyController').getPropertyAvailability));
router.get('/:id', asyncHandler(getPropertyById));

// Public search endpoint
router.get('/', asyncHandler(searchProperties));

module.exports = router;
