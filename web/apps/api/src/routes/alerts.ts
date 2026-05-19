import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { alertController } from '../controllers/alert.controller.js';

const router: Router = Router();

/**
 * GET /api/alerts
 * Lists alerts with pagination, filtering, sorting, and search.
 */
router.get('/', requireAuth, alertController.list);

/**
 * GET /api/alerts/:id
 * Returns a single alert.
 */
router.get('/:id', requireAuth, alertController.getById);

/**
 * PATCH /api/alerts/:id
 * Updates status, severity, and/or assignee of an alert.
 */
router.patch('/:id', requireAuth, alertController.update);

export { router as alertsRouter };
