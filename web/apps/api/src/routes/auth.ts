import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router: Router = Router();

/**
 * POST /api/login
 * Authenticates user with email/password, sets auth_token httpOnly cookie.
 */
router.post('/login', authController.login);

/**
 * POST /api/logout
 * Clears the auth_token cookie.
 */
router.post('/logout', authController.logout);

export { router as authRouter };
