// ============================================================
// Project Repository — Data Access Layer
// ============================================================
// All queries are scoped by organizationId to enforce
// multi-tenant data isolation at the database level.
// ============================================================

import { prisma } from "@/lib/prisma";
import type { ProjectStatus } from "@/generated/prisma/enums";

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
}

export const ProjectRepository = {
  /**
   * List all projects for an organization with optional filters.
   */
  async findAll(orgId: string, filters?: ProjectFilters) {
    return prisma.project.findMany({
      where: {
        organizationId: orgId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && {
          name: { contains: filters.search, mode: "insensitive" as const },
        }),
      },
      include: {
        _count: { select: { tasks: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  /**
   * Find a single project by ID, scoped to the organization.
   */
  async findById(orgId: string, id: string) {
    return prisma.project.findFirst({
      where: { id, organizationId: orgId },
      include: {
        _count: { select: { tasks: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });
  },

  /**
   * Create a new project within the organization.
   */
  async create(
    orgId: string,
    data: {
      name: string;
      description?: string | null;
      status?: ProjectStatus;
      color?: string | null;
      startDate?: Date | null;
      dueDate?: Date | null;
      createdBy?: string | null;
    }
  ) {
    return prisma.project.create({
      data: {
        organizationId: orgId,
        ...data,
      },
      include: {
        _count: { select: { tasks: true } },
      },
    });
  },

  /**
   * Update an existing project, scoped to the organization.
   */
  async update(
    orgId: string,
    id: string,
    data: {
      name?: string;
      description?: string | null;
      status?: ProjectStatus;
      color?: string | null;
      startDate?: Date | null;
      dueDate?: Date | null;
    }
  ) {
    // First verify the project belongs to this org
    const project = await prisma.project.findFirst({
      where: { id, organizationId: orgId },
    });

    if (!project) return null;

    return prisma.project.update({
      where: { id },
      data,
      include: {
        _count: { select: { tasks: true } },
      },
    });
  },

  /**
   * Delete a project, scoped to the organization.
   */
  async delete(orgId: string, id: string) {
    const project = await prisma.project.findFirst({
      where: { id, organizationId: orgId },
    });

    if (!project) return null;

    return prisma.project.delete({ where: { id } });
  },

  /**
   * Count projects grouped by status for the organization.
   */
  async countByStatus(orgId: string) {
    const results = await prisma.project.groupBy({
      by: ["status"],
      where: { organizationId: orgId },
      _count: { _all: true },
    });

    return results.reduce(
      (acc, row) => {
        acc[row.status] = row._count._all;
        return acc;
      },
      {} as Record<string, number>
    );
  },
};
