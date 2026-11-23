const { z } = require('zod');

const hostOnboardingSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  bio: z.string().trim().max(500).optional().default(''),
}).strict();

const blockedDateSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  reason: z.string().trim().max(200).optional().default(''),
}).strict();

const bookingStatusSchema = z.object({
  status: z.enum(['confirmed', 'rejected', 'completed']),
}).strict();

module.exports = { hostOnboardingSchema, blockedDateSchema, bookingStatusSchema };
