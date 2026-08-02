"use server";

// ============================================================
// Project Server Actions
// ============================================================
// Reusable mutations callable from Server Components and
// Client Components (via useTransition).
// ============================================================

import { requireAuth } from "@/lib/auth";
import { ProjectService } from "@/services/project.service";
import { handleError } from "@/lib/error-handler";
import type { CreateProjectInput, UpdateProjectInput } from "@/schemas/project.schema";

export async function createProject(input: CreateProjectInput) {
  try {
    const { userId, orgId } = await requireAuth();
    const project = await ProjectService.create(orgId, userId, input);

    return {
      success: true as const,
      message: "Project created successfully",
      data: project,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  try {
    const { orgId } = await requireAuth();
    const project = await ProjectService.update(orgId, id, input);

    return {
      success: true as const,
      message: "Project updated successfully",
      data: project,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteProject(id: string) {
  try {
    const { orgId } = await requireAuth();
    await ProjectService.delete(orgId, id);

    return {
      success: true as const,
      message: "Project deleted successfully",
      data: null,
    };
  } catch (error) {
    return handleError(error);
  }
}
