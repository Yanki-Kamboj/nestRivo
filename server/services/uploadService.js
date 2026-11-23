const multer = require('multer');
const { AppError } = require('../utils/AppError');

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const fileFilter = (req, file, cb) => {
  if (allowedTypes.has(file.mimetype)) return cb(null, true);
  cb(new AppError('Photos must be JPG, PNG, or WebP files.', 400));
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

const uploadPropertyImages = (req, res, next) => {
  upload.array('images', 5)(req, res, error => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Each photo must be 5 MB or smaller.'
        : 'Upload up to 5 photos per listing.';
      return next(new AppError(message, 400));
    }
    next(error);
  });
};

const normalizePropertyForm = (req, res, next) => {
  if (typeof req.body.amenities === 'string') {
    req.body.amenities = req.body.amenities
      .split(',')
      .map(amenity => amenity.trim())
      .filter(Boolean);
  }
  next();
};

module.exports = { uploadPropertyImages, normalizePropertyForm };
