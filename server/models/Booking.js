const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'], default: 'pending' },
  expiresAt: { type: Date }, // for pending bookings
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

// Index for availability queries
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
