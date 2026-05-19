import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Severity, Status } from '@prisma/client';

// Define the validation schema for updating an alert.
// We strictly permit only status, severity, and assignee, and refine
// the check to guarantee that at least one of these fields is provided.
const PatchAlertSchema = z.object({
  status: z.nativeEnum(Status).optional(),
  severity: z.nativeEnum(Severity).optional(),
  assignee: z.string().nullable().optional(),
}).strict().refine((data) => {
  return data.status !== undefined || data.severity !== undefined || data.assignee !== undefined;
}, {
  message: "At least one of 'status', 'severity', or 'assignee' must be provided for update",
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/alerts/[id]
 * Returns a single alert.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const alert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error(`Error fetching alert with ID:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the alert' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alerts/[id]
 * Updates status, severity, and/or assignee of an alert.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    // Parse the JSON request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid or missing JSON body' }, { status: 400 });
    }

    // Validate the request payload with Zod
    const parsed = PatchAlertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: parsed.error.flatten().fieldErrors,
          globalErrors: parsed.error.flatten().formErrors
        },
        { status: 400 }
      );
    }

    // First check if the alert exists
    const alertExists = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alertExists) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Perform the update
    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error(`Error updating alert with ID:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the alert' },
      { status: 500 }
    );
  }
}
