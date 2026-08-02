// ============================================================
// Tasks API — Get, Update, Delete by ID
// ============================================================

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { TaskService } from "@/services/task.service";
import { handleError } from "@/lib/error-handler";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/:id
 * Get a single task by ID, scoped to the authenticated org.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { orgId } = await requireAuth();
    const { id } = await context.params;

    const task = await TaskService.getById(orgId, id);

    return NextResponse.json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

/**
 * PATCH /api/tasks/:id
 * Update a task by ID, scoped to the authenticated org.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { orgId } = await requireAuth();
    const { id } = await context.params;

    const body = await request.json();
    const task = await TaskService.update(orgId, id, body);

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID, scoped to the authenticated org.
 */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { orgId } = await requireAuth();
    const { id } = await context.params;

    await TaskService.delete(orgId, id);

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
