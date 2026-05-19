/**
 * Re-export shared types from the workspace shared-types package.
 * This replaces the previous direct import from @prisma/client,
 * decoupling the frontend from Prisma.
 */
export type { Severity, Status, Category, Alert, User } from '@workspace/shared-types';

export interface NextPageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}
