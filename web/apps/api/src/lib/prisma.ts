import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file::memory:?cache=shared';
}

export const prisma = new PrismaClient();

