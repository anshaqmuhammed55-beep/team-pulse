// ============================================================
// Projects API — List & Create
// ============================================================

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ProjectService } from "@/services/project.service";
import { handleError } from "@/lib/error-handler";
import type { ProjectStatus } from "@/generated/prisma/enums";

/**
 * GET /api/projects
 * List all projects for the authenticated organization.
 * Optional query params: status, search
 */
export async function GET(request: Request) {
  try {
    const { orgId } = await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ProjectStatus | null;
    const search = searchParams.get("search") ?? undefined;

    const projects = await ProjectService.list(orgId, {
      ...(status && { status }),
      ...(search && { search }),
    });

    return NextResponse.json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

/**
 * POST /api/projects
 * Create a new project in the authenticated organization.
 */
export async function POST(request: Request) {
  try {
    const { userId, orgId } = await requireAuth();

    const body = await request.json();
    const project = await ProjectService.create(orgId, userId, body);

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
