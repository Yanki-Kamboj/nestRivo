const { z } = require('zod');

// Register schema
const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
}).strict();

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

// Verify email schema
const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};
