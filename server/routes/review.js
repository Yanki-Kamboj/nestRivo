const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const protect = require('../middleware/protect');
const requireCapability = require('../middleware/requireCapability');
const validate = require('../middleware/validate');
const { createReviewSchema, reviewResponseSchema } = require('../validators/reviewValidator');
const { createReview, respondToReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', protect, requireCapability('guest'), validate(createReviewSchema), asyncHandler(createReview));
router.patch('/:reviewId/response', protect, requireCapability('host'), validate(reviewResponseSchema), asyncHandler(respondToReview));

module.exports = router;
