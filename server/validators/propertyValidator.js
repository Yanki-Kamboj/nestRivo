const { z } = require('zod');

const propertySchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
  location: z.string().trim().min(2).max(200),
  price: z.coerce.number().positive().max(1000000),
  maxGuests: z.coerce.number().int().min(1).max(50).default(2),
  amenities: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
  isActive: z.boolean().optional(),
}).strict();

module.exports = { propertySchema };
