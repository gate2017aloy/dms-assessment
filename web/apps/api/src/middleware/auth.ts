import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../lib/auth.js';

/**
 * Express middleware that verifies the JWT from the `auth_token` cookie.
 * Attaches user payload to `req.user` on success, returns 401 on failure.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Attach user info to request for downstream handlers
  (req as any).user = payload;
  next();
}
