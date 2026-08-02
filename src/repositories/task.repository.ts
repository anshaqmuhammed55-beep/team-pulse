// ============================================================
// Task Repository — Data Access Layer
// ============================================================
// All queries are scoped by organizationId to enforce
// multi-tenant data isolation at the database level.
// ============================================================

import { prisma } from "@/lib/prisma";
import type { TaskStatus, TaskPriority } from "@/generated/prisma/enums";

export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
}

export const TaskRepository = {
  /**
   * List all tasks for an organization with optional filters.
   */
  async findAll(orgId: string, filters?: TaskFilters) {
    return prisma.task.findMany({
      where: {
        organizationId: orgId,
        ...(filters?.projectId && { projectId: filters.projectId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.priority && { priority: filters.priority }),
        ...(filters?.assigneeId && { assigneeId: filters.assigneeId }),
        ...(filters?.search && {
          title: { contains: filters.search, mode: "insensitive" as const },
        }),
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  /**
   * Find a single task by ID, scoped to the organization.
   */
  async findById(orgId: string, id: string) {
    return prisma.task.findFirst({
      where: { id, organizationId: orgId },
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  },

  /**
   * Create a new task within the organization.
   */
  async create(
    orgId: string,
    data: {
      projectId: string;
      title: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string | null;
      dueDate?: Date | null;
      estimatedHours?: number | null;
    }
  ) {
    return prisma.task.create({
      data: {
        organizationId: orgId,
        ...data,
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  },

  /**
   * Update an existing task, scoped to the organization.
   */
  async update(
    orgId: string,
    id: string,
    data: {
      projectId?: string;
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string | null;
      dueDate?: Date | null;
      estimatedHours?: number | null;
    }
  ) {
    const task = await prisma.task.findFirst({
      where: { id, organizationId: orgId },
    });

    if (!task) return null;

    return prisma.task.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  },

  /**
   * Delete a task, scoped to the organization.
   */
  async delete(orgId: string, id: string) {
    const task = await prisma.task.findFirst({
      where: { id, organizationId: orgId },
    });

    if (!task) return null;

    return prisma.task.delete({ where: { id } });
  },

  /**
   * Count tasks grouped by status for the organization.
   */
  async countByStatus(orgId: string) {
    const results = await prisma.task.groupBy({
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

  /**
   * Find overdue tasks (past due date, not done/cancelled).
   */
  async findOverdue(orgId: string) {
    return prisma.task.findMany({
      where: {
        organizationId: orgId,
        dueDate: { lt: new Date() },
        status: { notIn: ["DONE", "CANCELLED"] },
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    });
  },

  /**
   * Find tasks due within the next N days.
   */
  async findUpcoming(orgId: string, days: number = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.task.findMany({
      where: {
        organizationId: orgId,
        dueDate: { gte: now, lte: futureDate },
        status: { notIn: ["DONE", "CANCELLED"] },
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    });
  },
};
