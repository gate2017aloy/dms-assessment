import { Severity, Status, Category } from '@prisma/client';

export interface NextPageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export type { Severity, Status, Category };
