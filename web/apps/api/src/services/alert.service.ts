import { Prisma } from '@prisma/client';
import { alertData } from '../data/alert.data.js';
import type { GetAlertsQuery, PatchAlertBody } from '../validators/alert.validator.js';

/** Severity ranking for in-memory sorting */
const SEVERITY_RANK: Record<string, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

/**
 * Service layer for Alert operations.
 * Contains business logic, orchestration, and data transformation.
 */
export const alertService = {
  /**
   * List alerts with filtering, sorting, search, and pagination.
   */
  async list(query: GetAlertsQuery) {
    const { page, limit, severity, status, category, sort, search, startDate, endDate } = query;

    // Build where clause
    const where: Prisma.AlertWhereInput = {};

    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (category) where.category = category;

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm } },
        { affectedAsset: { contains: searchTerm } },
        { source: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const take = limit;

    let total = 0;
    let alerts = [];

    if (sort.startsWith('severity_')) {
      // Severity sorting requires in-memory ranking since it's an enum, not numeric
      const allMatching = await alertData.findAll({
        where,
        orderBy: { timestamp: 'desc' },
      });

      total = allMatching.length;

      allMatching.sort((a, b) => {
        const rankA = SEVERITY_RANK[a.severity] ?? 0;
        const rankB = SEVERITY_RANK[b.severity] ?? 0;
        if (rankA !== rankB) {
          return sort === 'severity_desc' ? rankB - rankA : rankA - rankB;
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      alerts = allMatching.slice(skip, skip + take);
    } else {
      // Native database sort for timestamp
      const orderBy: Prisma.AlertOrderByWithRelationInput =
        sort === 'timestamp_asc' ? { timestamp: 'asc' } : { timestamp: 'desc' };

      const [count, list] = await Promise.all([
        alertData.count(where),
        alertData.findMany({ where, orderBy, skip, take }),
      ]);
      total = count;
      alerts = list;
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { data: alerts, total, page, pages: totalPages };
  },

  /**
   * Get a single alert by ID.
   * Returns null if not found.
   */
  async getById(id: string) {
    return alertData.findById(id);
  },

  /**
   * Update an alert by ID.
   * Throws if the alert does not exist.
   */
  async update(id: string, data: PatchAlertBody) {
    // Verify existence first
    const existing = await alertData.findById(id);
    if (!existing) return null;

    return alertData.updateById(id, data);
  },
};
