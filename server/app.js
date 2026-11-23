const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const morgan = require('morgan');
const path = require('path');

const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const hostRouter = require('./routes/host');
const { errorHandler } = require('./middleware/errorHandler');





const propertyRouter = require('./routes/property');
const bookingRouter = require('./routes/booking');
const wishlistRouter = require('./routes/wishlist');
const reviewRouter = require('./routes/review');
const dashboardRouter = require('./routes/dashboard');


const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

app.use('/api/uploads', express.static(path.resolve(__dirname, '../uploads'), { index: false }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Data sanitization against NoSQL injection
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  next();
});

// Logging
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/host', hostRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/dashboard', dashboardRouter);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
