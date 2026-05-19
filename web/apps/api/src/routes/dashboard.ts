import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { dashboardController } from '../controllers/dashboard.controller.js';

const router: Router = Router();

/**
 * GET /api/dashboard
 * Returns aggregated dashboard statistics.
 */
router.get('/', requireAuth, dashboardController.getStats);

export { router as dashboardRouter };
