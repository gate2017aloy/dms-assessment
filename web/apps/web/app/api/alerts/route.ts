import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Severity, Status, Category, Prisma } from '@prisma/client';

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    
    // Extract query parameters from URL
    const queryParams = {
      page: url.searchParams.get('page') ?? undefined,
      limit: url.searchParams.get('limit') ?? undefined,
      severity: url.searchParams.get('severity') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      category: url.searchParams.get('category') ?? undefined,
      sort: url.searchParams.get('sort') ?? undefined,
      search: url.searchParams.get('search') ?? url.searchParams.get('q') ?? undefined,
      startDate: url.searchParams.get('startDate') ?? undefined,
      endDate: url.searchParams.get('endDate') ?? undefined,
    };

    // Validate using Zod
    const parsed = GetAlertsQuerySchema.safeParse(queryParams);
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: parsed.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      data: alerts,
      total,
      page,
      pages: totalPages,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching alerts' },
      { status: 500 }
    );
  }
}
