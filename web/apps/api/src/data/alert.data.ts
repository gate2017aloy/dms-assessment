import { prisma } from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

/**
 * Data layer for Alert entity.
 * Contains only pure database queries — no business logic.
 */
export const alertData = {
  /**
   * Find multiple alerts with filtering, sorting, and pagination.
   */
  async findMany(params: {
    where: Prisma.AlertWhereInput;
    orderBy: Prisma.AlertOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.alert.findMany(params);
  },

  /**
   * Count alerts matching the given filter.
   */
  async count(where: Prisma.AlertWhereInput) {
    return prisma.alert.count({ where });
  },

  /**
   * Find all alerts matching a filter (no pagination).
   * Used for in-memory sorting scenarios.
   */
  async findAll(params: {
    where: Prisma.AlertWhereInput;
    orderBy: Prisma.AlertOrderByWithRelationInput;
  }) {
    return prisma.alert.findMany(params);
  },

  /**
   * Find a single alert by ID.
   */
  async findById(id: string) {
    return prisma.alert.findUnique({ where: { id } });
  },

  /**
   * Update an alert by ID.
   */
  async updateById(id: string, data: Prisma.AlertUpdateInput) {
    return prisma.alert.update({ where: { id }, data });
  },
};
