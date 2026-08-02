// ============================================================
// Task Service — Business Logic Layer
// ============================================================
// Validates input, verifies project ownership, delegates
// to the repository, and handles not-found cases.
// ============================================================

import { TaskRepository } from "@/repositories/task.repository";
import type { TaskFilters } from "@/repositories/task.repository";
import { ProjectRepository } from "@/repositories/project.repository";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/schemas/task.schema";
import { NotFoundError, ValidationError } from "@/lib/errors";

export const TaskService = {
  /**
   * List all tasks for the organization.
   */
  async list(orgId: string, filters?: TaskFilters) {
    return TaskRepository.findAll(orgId, filters);
  },

  /**
   * Get a single task by ID.
   */
  async getById(orgId: string, id: string) {
    const task = await TaskRepository.findById(orgId, id);

    if (!task) {
      throw new NotFoundError("Task");
    }

    return task;
  },

  /**
   * Create a new task.
   */
  async create(orgId: string, input: CreateTaskInput) {
    const result = createTaskSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      throw new ValidationError("Invalid task data", fieldErrors);
    }

    const data = result.data;

    // Verify the project belongs to this organization
    const project = await ProjectRepository.findById(orgId, data.projectId);
    if (!project) {
      throw new NotFoundError("Project");
    }

    return TaskRepository.create(orgId, {
      projectId: data.projectId,
      title: data.title,
      description: data.description ?? null,
      status: data.status as
        | "TODO"
        | "IN_PROGRESS"
        | "IN_REVIEW"
        | "DONE"
        | "CANCELLED"
        | undefined,
      priority: data.priority as
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "URGENT"
        | undefined,
      assigneeId: data.assigneeId ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      estimatedHours: data.estimatedHours ?? null,
    });
  },

  /**
   * Update an existing task.
   */
  async update(orgId: string, id: string, input: UpdateTaskInput) {
    const result = updateTaskSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      throw new ValidationError("Invalid task data", fieldErrors);
    }

    const data = result.data;

    // If projectId is being changed, verify the new project exists in this org
    if (data.projectId) {
      const project = await ProjectRepository.findById(orgId, data.projectId);
      if (!project) {
        throw new NotFoundError("Project");
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.projectId !== undefined) updateData.projectId = data.projectId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.estimatedHours !== undefined)
      updateData.estimatedHours = data.estimatedHours;

    const task = await TaskRepository.update(orgId, id, updateData);

    if (!task) {
      throw new NotFoundError("Task");
    }

    return task;
  },

  /**
   * Delete a task.
   */
  async delete(orgId: string, id: string) {
    const task = await TaskRepository.delete(orgId, id);

    if (!task) {
      throw new NotFoundError("Task");
    }

    return task;
  },
};
