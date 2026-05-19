import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signJWT } from '../lib/auth.js';

const router = Router();

/**
 * POST /api/login
 * Authenticates user with email/password, sets auth_token httpOnly cookie.
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log(`[AUTH-DEBUG] Login attempt for email: "${email}" (Normalized: "${normalizedEmail}")`);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.log(`[AUTH-DEBUG] User not found in database for email: "${normalizedEmail}"`);
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    console.log(`[AUTH-DEBUG] Password correct: ${isPasswordCorrect}`);

    if (!isPasswordCorrect) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
    });

    // Set the auth cookie — same config as the original Next.js route
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 1000, // 24 hours in milliseconds
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * POST /api/logout
 * Clears the auth_token cookie.
 */
router.post('/logout', async (_req: Request, res: Response) => {
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
});

export { router as authRouter };
