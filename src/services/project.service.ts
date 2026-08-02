// ============================================================
// Project Service — Business Logic Layer
// ============================================================
// Validates input, delegates to the repository, and handles
// not-found cases by throwing typed errors.
// ============================================================

import { ProjectRepository } from "@/repositories/project.repository";
import type { ProjectFilters } from "@/repositories/project.repository";
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/schemas/project.schema";
import { NotFoundError, ValidationError } from "@/lib/errors";

export const ProjectService = {
  /**
   * List all projects for the organization.
   */
  async list(orgId: string, filters?: ProjectFilters) {
    return ProjectRepository.findAll(orgId, filters);
  },

  /**
   * Get a single project by ID.
   */
  async getById(orgId: string, id: string) {
    const project = await ProjectRepository.findById(orgId, id);

    if (!project) {
      throw new NotFoundError("Project");
    }

    return project;
  },

  /**
   * Create a new project.
   */
  async create(orgId: string, userId: string, input: CreateProjectInput) {
    const result = createProjectSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      throw new ValidationError("Invalid project data", fieldErrors);
    }

    const data = result.data;

    return ProjectRepository.create(orgId, {
      name: data.name,
      description: data.description ?? null,
      status: data.status as "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED" | undefined,
      color: data.color ?? null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdBy: userId,
    });
  },

  /**
   * Update an existing project.
   */
  async update(orgId: string, id: string, input: UpdateProjectInput) {
    const result = updateProjectSchema.safeParse(input);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      throw new ValidationError("Invalid project data", fieldErrors);
    }

    const data = result.data;

    // Build the update payload, converting date strings to Date objects
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.startDate !== undefined)
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const project = await ProjectRepository.update(orgId, id, updateData);

    if (!project) {
      throw new NotFoundError("Project");
    }

    return project;
  },

  /**
   * Delete a project.
   */
  async delete(orgId: string, id: string) {
    const project = await ProjectRepository.delete(orgId, id);

    if (!project) {
      throw new NotFoundError("Project");
    }

    return project;
  },
};
