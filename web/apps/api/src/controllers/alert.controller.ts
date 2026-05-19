import { Request, Response } from 'express';
import { alertService } from '../services/alert.service.js';
import { GetAlertsQuerySchema, PatchAlertSchema } from '../validators/alert.validator.js';

/**
 * Controller layer for Alert endpoints.
 * Handles HTTP request parsing, validation, and response formatting.
 * Delegates all business logic to the service layer.
 */
export const alertController = {
  /**
   * GET /api/alerts
   * Lists alerts with pagination, filtering, sorting, and search.
   */
  async list(req: Request, res: Response) {
    try {
      const queryParams = {
        ...req.query,
        search: req.query.search || req.query.q || undefined,
      };

      const parsed = GetAlertsQuerySchema.safeParse(queryParams);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation error',
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const result = await alertService.list(parsed.data);
      res.json(result);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ error: 'An unexpected error occurred while fetching alerts' });
    }
  },

  /**
   * GET /api/alerts/:id
   * Returns a single alert by ID.
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Alert ID is required' });
        return;
      }

      const alert = await alertService.getById(id as string);

      if (!alert) {
        res.status(404).json({ error: 'Alert not found' });
        return;
      }

      res.json(alert);
    } catch (error) {
      console.error('Error fetching alert with ID:', error);
      res.status(500).json({ error: 'An unexpected error occurred while fetching the alert' });
    }
  },

  /**
   * PATCH /api/alerts/:id
   * Updates status, severity, and/or assignee of an alert.
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Alert ID is required' });
        return;
      }

      const parsed = PatchAlertSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation error',
          details: parsed.error.flatten().fieldErrors,
          globalErrors: parsed.error.flatten().formErrors,
        });
        return;
      }

      const updatedAlert = await alertService.update(id as string, parsed.data);

      if (!updatedAlert) {
        res.status(404).json({ error: 'Alert not found' });
        return;
      }

      res.json(updatedAlert);
    } catch (error) {
      console.error('Error updating alert with ID:', error);
      res.status(500).json({ error: 'An unexpected error occurred while updating the alert' });
    }
  },
};
