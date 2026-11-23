const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const protect = require('../middleware/protect');
const requireCapability = require('../middleware/requireCapability');
const { getOverview } = require('../controllers/guestController');

const router = express.Router();

router.get('/guest/stats', protect, requireCapability('guest'), asyncHandler(getOverview));

module.exports = router;
