const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const protect = require('../middleware/protect');
const requireCapability = require('../middleware/requireCapability');
const {
  getMyWishlist,
  getWishlistStatus,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');

const router = express.Router();

router.use(protect, requireCapability('guest'));
router.get('/', asyncHandler(getMyWishlist));
router.get('/:propertyId', asyncHandler(getWishlistStatus));
router.post('/:propertyId', asyncHandler(addToWishlist));
router.delete('/:propertyId', asyncHandler(removeFromWishlist));

module.exports = router;
