import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import { Severity, Status, Category, Prisma } from '@prisma/client';

const router = Router();

// Define the query parameter validation schema using Zod
const GetAlertsQuerySchema = z.object({
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

// Define the validation schema for updating an alert.
const PatchAlertSchema = z.object({
  status: z.nativeEnum(Status).optional(),
  severity: z.nativeEnum(Severity).optional(),
  assignee: z.string().nullable().optional(),
}).strict().refine((data) => {
  return data.status !== undefined || data.severity !== undefined || data.assignee !== undefined;
}, {
  message: "At least one of 'status', 'severity', or 'assignee' must be provided for update",
});

/**
 * GET /api/alerts
 * Lists alerts with pagination, filtering, sorting, and search.
 */
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    // Express parses query params; map 'q' alias to 'search'
    const queryParams = {
      ...req.query,
      search: req.query.search || req.query.q || undefined,
    };

    // Validate using Zod
    const parsed = GetAlertsQuerySchema.safeParse(queryParams);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation error',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { page, limit, severity, status, category, sort, search, startDate, endDate } = parsed.data;

    // Build Prisma query clauses
    const where: Prisma.AlertWhereInput = {};

    if (severity) {
      where.severity = severity;
    }
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    // Support flexible searching across multiple fields
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm } },
        { affectedAsset: { contains: searchTerm } },
        { source: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    // Map the sort parameter to Prisma order syntax
    let orderBy: Prisma.AlertOrderByWithRelationInput = { timestamp: 'desc' };
    if (sort === 'timestamp_asc') {
      orderBy = { timestamp: 'asc' };
    }

    // Pagination limits
    const skip = (page - 1) * limit;
    const take = limit;

    let total = 0;
    let alerts = [];

    if (sort.startsWith('severity_')) {
      // Fetch all matching records to perform custom sorting in-memory
      const allMatchingAlerts = await prisma.alert.findMany({
        where,
        orderBy: { timestamp: 'desc' }, // Secondary sort natively
      });

      total = allMatchingAlerts.length;

      const SEVERITY_RANK: Record<string, number> = {
        critical: 5,
        high: 4,
        medium: 3,
        low: 2,
        info: 1,
      };

      allMatchingAlerts.sort((a, b) => {
        const rankA = SEVERITY_RANK[a.severity] ?? 0;
        const rankB = SEVERITY_RANK[b.severity] ?? 0;
        if (rankA !== rankB) {
          return sort === 'severity_desc' ? rankB - rankA : rankA - rankB;
        }
        // Fallback to secondary sort by timestamp desc
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      alerts = allMatchingAlerts.slice(skip, skip + take);
    } else {
      // Native database sorting and pagination for timestamp
      const [count, list] = await Promise.all([
        prisma.alert.count({ where }),
        prisma.alert.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
      ]);
      total = count;
      alerts = list;
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      data: alerts,
      total,
      page,
      pages: totalPages,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching alerts' });
  }
});

/**
 * GET /api/alerts/:id
 * Returns a single alert.
 */
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Alert ID is required' });
      return;
    }

    const alert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    res.json(alert);
  } catch (error) {
    console.error(`Error fetching alert with ID:`, error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching the alert' });
  }
});

/**
 * PATCH /api/alerts/:id
 * Updates status, severity, and/or assignee of an alert.
 */
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Alert ID is required' });
      return;
    }

    // Validate the request payload with Zod
    const parsed = PatchAlertSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation error',
        details: parsed.error.flatten().fieldErrors,
        globalErrors: parsed.error.flatten().formErrors,
      });
      return;
    }

    // First check if the alert exists
    const alertExists = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alertExists) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    // Perform the update
    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: parsed.data,
    });

    res.json(updatedAlert);
  } catch (error) {
    console.error(`Error updating alert with ID:`, error);
    res.status(500).json({ error: 'An unexpected error occurred while updating the alert' });
  }
});

export { router as alertsRouter };
