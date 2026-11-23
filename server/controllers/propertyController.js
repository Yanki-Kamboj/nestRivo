// server/controllers/propertyController.js
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const HostBlockedDate = require('../models/HostBlockedDate');
const Wishlist = require('../models/Wishlist');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');

const uploadDirectory = path.resolve(__dirname, '../../uploads');
const imageFormats = {
  'image/jpeg': {
    extension: '.jpg',
    matches: buffer => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  },
  'image/png': {
    extension: '.png',
    matches: buffer => buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  'image/webp': {
    extension: '.webp',
    matches: buffer => buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP',
  },
};

const removeUploadedFiles = async files => {
  const results = await Promise.allSettled(files.map(file => fs.promises.unlink(file)));
  const errors = results
    .filter(result => result.status === 'rejected' && result.reason.code !== 'ENOENT')
    .map(result => result.reason);
  if (errors.length) throw new AggregateError(errors, 'Could not clean up uploaded photos');
};

/** Helper to build filter object (same as in Phase 9) */
const buildFilters = (q) => {
  const filters = { isActive: true, approvalStatus: 'approved' };
  const and = [];
  if (q.destination) and.push({ $text: { $search: q.destination } });
  if (q.minPrice) and.push({ price: { $gte: Number(q.minPrice) } });
  if (q.maxPrice) and.push({ price: { $lte: Number(q.maxPrice) } });
  if (q.guests)   and.push({ maxGuests: { $gte: Number(q.guests) } });
  if (q.bedrooms) and.push({ bedrooms: { $gte: Number(q.bedrooms) } });
  if (q.bathrooms)and.push({ bathrooms: { $gte: Number(q.bathrooms) } });
  if (q.type)      and.push({ type: q.type });
  if (q.category)  and.push({ category: q.category });
  if (q.entireHome)   and.push({ entireHome: q.entireHome === 'true' });
  if (q.instant)      and.push({ instantBooking: q.instant === 'true' });
  if (q.freeCancel)   and.push({ freeCancellation: q.freeCancel === 'true' });
  if (q.petFriendly)  and.push({ petFriendly: q.petFriendly === 'true' });
  if (q.amenities) {
    const list = Array.isArray(q.amenities) ? q.amenities : [q.amenities];
    and.push({ amenities: { $all: list } });
  }
  if (q.minRating) and.push({ averageRating: { $gte: Number(q.minRating) } });
  if (q.checkIn && q.checkOut) {
    filters.__availability = { checkIn: new Date(q.checkIn), checkOut: new Date(q.checkOut) };
  }
  if (and.length) filters.$and = and;
  return filters;
};

/** GET /api/properties – search with filters, sort, pagination */
exports.searchProperties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = 'recommended' } = req.query;
  const filters = buildFilters(req.query);
  const pipeline = [{ $match: filters }];

  // Availability exclusion via $lookup if needed
  if (filters.__availability) {
    const { checkIn, checkOut } = filters.__availability;
    delete filters.__availability;
    pipeline.push({
      $lookup: {
        from: 'bookings',
        let: { propId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$property', '$$propId'] },
                  { $in: ['$status', ['confirmed', 'pending']] },
                  {
                    $or: [
                      { $and: [{ $lte: ['$checkIn', checkIn] }, { $gt: ['$checkOut', checkIn] }] },
                      { $and: [{ $lt: ['$checkIn', checkOut] }, { $gte: ['$checkOut', checkOut] }] },
                      { $and: [{ $gte: ['$checkIn', checkIn] }, { $lte: ['$checkOut', checkOut] }] },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'conflicts',
      },
    });
    pipeline.push({ $match: { conflicts: { $size: 0 } } });
  }

  // Sorting
  const sortStage = {};
  switch (sort) {
    case 'price-asc': sortStage.price = 1; break;
    case 'price-desc': sortStage.price = -1; break;
    case 'rating': sortStage.averageRating = -1; break;
    case 'reviews': sortStage.reviewCount = -1; break;
    default: sortStage.createdAt = -1; // recommended fallback
  }
  pipeline.push({ $sort: sortStage });

  // Pagination and total count
  const skip = (page - 1) * limit;
  pipeline.push({
    $facet: {
      metadata: [{ $count: 'total' }],
      data: [{ $skip: skip }, { $limit: Number(limit) }],
    },
  },
  { $addFields: { total: { $arrayElemAt: ['$metadata.total', 0] } } },
  { $project: { metadata: 0 } });

  const result = await Property.aggregate(pipeline);
  const { data = [], total = 0 } = result[0] || {};
  res.json({ success: true, total, page: Number(page), limit: Number(limit), data });
});

/** GET availability for a single property */
exports.getPropertyAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({
    property: id,
    status: { $in: ['confirmed', 'pending'] },
    checkOut: { $gte: new Date() },
  }).select('checkIn checkOut -_id');
  const hostBlocks = await HostBlockedDate.find({
    property: id,
    end: { $gte: new Date() },
  }).select('start end -_id');
  const blocked = [
    ...bookings.map(b => ({ start: b.checkIn, end: b.checkOut, type: 'booking' })),
    ...hostBlocks.map(date => ({ start: date.start, end: date.end, type: 'host-block' })),
  ];
  res.json({ success: true, data: blocked });
});

exports.listMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: properties });
});

exports.getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findOne({
    _id: req.params.id,
    isActive: true,
    approvalStatus: 'approved',
  }).populate('host', 'name hostProfile.displayName');
  if (!property) throw new AppError('Property not found', 404);
  res.json({ success: true, data: property });
});

exports.createProperty = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const imagePaths = files.map(file => {
    const format = imageFormats[file.mimetype];
    if (!format || !format.matches(file.buffer)) {
      throw new AppError('One or more photos are not valid JPG, PNG, or WebP images.', 400);
    }
    const filename = `${crypto.randomBytes(16).toString('hex')}${format.extension}`;
    return {
      path: path.join(uploadDirectory, filename),
      url: `/api/uploads/${filename}`,
      buffer: file.buffer,
    };
  });
  const writtenFiles = [];
  let property;

  try {
    await fs.promises.mkdir(uploadDirectory, { recursive: true });
    for (const image of imagePaths) {
      writtenFiles.push(image.path);
      await fs.promises.writeFile(image.path, image.buffer, { flag: 'wx' });
    }

    property = await Property.create({
      ...req.body,
      images: imagePaths.map(image => image.url),
      host: req.user._id,
      approvalStatus: 'approved',
      isActive: true,
    });
  } catch (error) {
    try {
      await removeUploadedFiles(writtenFiles);
    } catch (cleanupError) {
      console.error('Failed to clean up listing photos after an upload error:', cleanupError);
    }
    throw error;
  }

  res.status(201).json({ success: true, data: property });
});

exports.updateMyProperty = asyncHandler(async (req, res) => {
  const property = await Property.findOne({ _id: req.params.id, host: req.user._id });
  if (!property) throw new AppError('Property not found', 404);

  Object.assign(property, req.body);
  await property.save();
  res.json({ success: true, data: property });
});

exports.deleteMyProperty = asyncHandler(async (req, res) => {
  const property = await Property.findOne({ _id: req.params.id, host: req.user._id });
  if (!property) throw new AppError('Property not found', 404);

  const hasBookingHistory = await Booking.exists({ property: property._id });
  if (hasBookingHistory) {
    throw new AppError('Properties with booking history cannot be removed. Pause the listing instead.', 409);
  }

  await Promise.all([
    HostBlockedDate.deleteMany({ property: property._id }),
    Wishlist.deleteMany({ property: property._id }),
    Property.deleteOne({ _id: property._id }),
  ]);
  res.json({ success: true, message: 'Property removed' });
});

/** Helper endpoints (placeholders) */
exports.getPopularDestinations = asyncHandler(async (req, res) => {
  const destinations = await Property.aggregate([
    { $match: { isActive: true, approvalStatus: 'approved' } },
    { $group: { _id: '$location', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  res.json({ success: true, data: destinations });
});

exports.getTrendingProperties = asyncHandler(async (req, res) => {
  const trending = await Property.find({ isActive: true, approvalStatus: 'approved' })
    .sort({ viewCount: -1 })
    .limit(12);
  res.json({ success: true, data: trending });
});

exports.getFeaturedProperties = asyncHandler(async (req, res) => {
  const featured = await Property.find({ isActive: true, approvalStatus: 'approved', isFeatured: true })
    .limit(12);
  res.json({ success: true, data: featured });
});

module.exports = {
  searchProperties: exports.searchProperties,
  getPopularDestinations: exports.getPopularDestinations,
  getTrendingProperties: exports.getTrendingProperties,
  getFeaturedProperties: exports.getFeaturedProperties,
  getPropertyAvailability: exports.getPropertyAvailability,
  listMyProperties: exports.listMyProperties,
  getPropertyById: exports.getPropertyById,
  createProperty: exports.createProperty,
  updateMyProperty: exports.updateMyProperty,
  deleteMyProperty: exports.deleteMyProperty,
};
