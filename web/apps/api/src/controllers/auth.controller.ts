import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { LoginSchema } from '../validators/auth.validator.js';

/**
 * Controller layer for Authentication endpoints.
 * Handles HTTP request parsing, cookie management, and response formatting.
 * Delegates credential verification to the service layer.
 */
export const authController = {
  /**
   * POST /api/login
   * Authenticates user with email/password, sets auth_token httpOnly cookie.
   */
  async login(req: Request, res: Response) {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation error',
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const { email, password } = parsed.data;
      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Set the auth cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 1000, // 24 hours in milliseconds
      });

      res.json({ user: result.user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },

  /**
   * POST /api/logout
   * Clears the auth_token cookie.
   */
  async logout(_req: Request, res: Response) {
    try {
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      res.json({ success: true });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },
};
