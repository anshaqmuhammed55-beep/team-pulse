// ============================================================
// Projects API — Get, Update, Delete by ID
// ============================================================

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ProjectService } from "@/services/project.service";
import { handleError } from "@/lib/error-handler";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/:id
 * Get a single project by ID, scoped to the authenticated org.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { orgId } = await requireAuth();
    const { id } = await context.params;

    const project = await ProjectService.getById(orgId, id);

    return NextResponse.json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

/**
 * PATCH /api/projects/:id
 * Update a project by ID, scoped to the authenticated org.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { orgId } = await requireAuth();
    const { id } = await context.params;

    const body = await request.json();
    const project = await ProjectService.update(orgId, id, body);

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

/**
 * DELETE /api/projects/:id
 * Delete a project by ID, scoped to the authenticated org.
 */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { orgId } = await requireAuth();
    const { id } = await context.params;

    await ProjectService.delete(orgId, id);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
      data: null,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
