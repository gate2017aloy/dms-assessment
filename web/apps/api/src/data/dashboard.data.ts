import { prisma } from '../lib/prisma.js';

/**
 * Data layer for Dashboard aggregations.
 * Contains only pure database queries — no business logic or formatting.
 */
export const dashboardData = {
  /**
   * Fetch all raw dashboard statistics in parallel.
   */
  async fetchRawStats() {
    const [
      totalAlerts,
      criticalAlerts,
      investigatingAlerts,
      falsePositives,
      severityGroup,
      statusGroup,
      categoryGroup,
      alertTimestamps,
    ] = await Promise.all([
      prisma.alert.count(),
      prisma.alert.count({ where: { severity: 'critical' } }),
      prisma.alert.count({ where: { status: 'investigating' } }),
      prisma.alert.count({ where: { status: 'false_positive' } }),
      prisma.alert.groupBy({
        by: ['severity'],
        _count: { severity: true },
      }),
      prisma.alert.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.alert.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      prisma.alert.findMany({
        select: { timestamp: true },
        orderBy: { timestamp: 'asc' },
      }),
    ]);

    return {
      totalAlerts,
      criticalAlerts,
      investigatingAlerts,
      falsePositives,
      severityGroup,
      statusGroup,
      categoryGroup,
      alertTimestamps,
    };
  },
};
