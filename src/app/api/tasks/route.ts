// ============================================================
// Tasks API — List & Create
// ============================================================

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { TaskService } from "@/services/task.service";
import { handleError } from "@/lib/error-handler";
import type { TaskStatus, TaskPriority } from "@/generated/prisma/enums";

/**
 * GET /api/tasks
 * List all tasks for the authenticated organization.
 * Optional query params: projectId, status, priority, assigneeId, search
 */
export async function GET(request: Request) {
  try {
    const { orgId } = await requireAuth();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") ?? undefined;
    const status = searchParams.get("status") as TaskStatus | null;
    const priority = searchParams.get("priority") as TaskPriority | null;
    const assigneeId = searchParams.get("assigneeId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const tasks = await TaskService.list(orgId, {
      ...(projectId && { projectId }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assigneeId && { assigneeId }),
      ...(search && { search }),
    });

    return NextResponse.json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

/**
 * POST /api/tasks
 * Create a new task in the authenticated organization.
 */
export async function POST(request: Request) {
  try {
    const { orgId } = await requireAuth();

    const body = await request.json();
    const task = await TaskService.create(orgId, body);

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        data: task,
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
