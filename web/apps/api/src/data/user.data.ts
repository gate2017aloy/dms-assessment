import { prisma } from '../lib/prisma.js';

/**
 * Data layer for User entity.
 * Contains only pure database queries — no business logic.
 */
export const userData = {
  /**
   * Find a user by email.
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};
