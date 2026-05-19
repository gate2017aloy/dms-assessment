import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service.js';

/**
 * Controller layer for Dashboard endpoints.
 * Handles HTTP response formatting.
 * Delegates all data fetching and transformation to the service layer.
 */
export const dashboardController = {
  /**
   * GET /api/dashboard
   * Returns aggregated dashboard statistics.
   */
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      res.status(500).json({ error: 'An unexpected error occurred while fetching dashboard statistics' });
    }
  },
};
