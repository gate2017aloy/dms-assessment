import { z } from 'zod';
import { Severity, Status, Category } from '@prisma/client';

/**
 * Validation schema for GET /api/alerts query parameters.
 */
export const GetAlertsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  severity: z.nativeEnum(Severity).optional(),
  status: z.nativeEnum(Status).optional(),
  category: z.nativeEnum(Category).optional(),
  sort: z.enum([
    'timestamp_desc',
    'timestamp_asc',
    'severity_desc',
    'severity_asc'
  ]).default('timestamp_desc'),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Validation schema for PATCH /api/alerts/:id request body.
 */
export const PatchAlertSchema = z.object({
  status: z.nativeEnum(Status).optional(),
  severity: z.nativeEnum(Severity).optional(),
  assignee: z.string().nullable().optional(),
}).strict().refine((data) => {
  return data.status !== undefined || data.severity !== undefined || data.assignee !== undefined;
}, {
  message: "At least one of 'status', 'severity', or 'assignee' must be provided for update",
});

export type GetAlertsQuery = z.infer<typeof GetAlertsQuerySchema>;
export type PatchAlertBody = z.infer<typeof PatchAlertSchema>;
