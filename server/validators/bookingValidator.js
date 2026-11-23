const { z } = require('zod');

const bookingSchema = z.object({
  propertyId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid property ID'),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().int().min(1).max(50),
}).strict();

module.exports = { bookingSchema };
