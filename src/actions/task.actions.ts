"use server";

// ============================================================
// Task Server Actions
// ============================================================
// Reusable mutations callable from Server Components and
// Client Components (via useTransition).
// ============================================================

import { requireAuth } from "@/lib/auth";
import { TaskService } from "@/services/task.service";
import { handleError } from "@/lib/error-handler";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/task.schema";

export async function createTask(input: CreateTaskInput) {
  try {
    const { orgId } = await requireAuth();
    const task = await TaskService.create(orgId, input);

    return {
      success: true as const,
      message: "Task created successfully",
      data: task,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  try {
    const { orgId } = await requireAuth();
    const task = await TaskService.update(orgId, id, input);

    return {
      success: true as const,
      message: "Task updated successfully",
      data: task,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteTask(id: string) {
  try {
    const { orgId } = await requireAuth();
    await TaskService.delete(orgId, id);

    return {
      success: true as const,
      message: "Task deleted successfully",
      data: null,
    };
  } catch (error) {
    return handleError(error);
  }
}
