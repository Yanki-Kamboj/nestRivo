const { z } = require('zod');

const createReviewSchema = z.object({
  bookingId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid booking ID'),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(''),
}).strict();

const reviewResponseSchema = z.object({
  response: z.string().trim().min(1).max(2000),
}).strict();

module.exports = { createReviewSchema, reviewResponseSchema };
