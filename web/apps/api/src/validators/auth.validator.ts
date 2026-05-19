import { z } from 'zod';

/**
 * Validation schema for POST /api/login request body.
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginBody = z.infer<typeof LoginSchema>;
