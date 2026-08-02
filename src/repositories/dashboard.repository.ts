// ============================================================
// Dashboard Repository — Aggregation Queries
// ============================================================
// Gathers all metrics for the dashboard in minimal DB calls.
// ============================================================

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    dueDate: Date;
    status: string;
    project: { id: string; name: string; color: string | null } | null;
  }>;
}

export const DashboardRepository = {
  /**
   * Fetch all dashboard statistics for an organization.
   * Uses parallel queries for efficiency.
   */
  async getStats(orgId: string): Promise<DashboardStats> {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      teamMembers,
      upcomingDeadlines,
    ] = await Promise.all([
      // Total projects
      prisma.project.count({
        where: { organizationId: orgId },
      }),

      // Active projects
      prisma.project.count({
        where: { organizationId: orgId, status: "ACTIVE" },
      }),

      // Completed projects
      prisma.project.count({
        where: { organizationId: orgId, status: "COMPLETED" },
      }),

      // Total tasks
      prisma.task.count({
        where: { organizationId: orgId },
      }),

      // Completed tasks
      prisma.task.count({
        where: { organizationId: orgId, status: "DONE" },
      }),

      // Overdue tasks
      prisma.task.count({
        where: {
          organizationId: orgId,
          dueDate: { lt: now },
          status: { notIn: ["DONE", "CANCELLED"] },
        },
      }),

      // Team members
      prisma.membership.count({
        where: { organizationId: orgId },
      }),

      // Upcoming deadlines (next 7 days)
      prisma.task.findMany({
        where: {
          organizationId: orgId,
          dueDate: { gte: now, lte: sevenDaysFromNow },
          status: { notIn: ["DONE", "CANCELLED"] },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          status: true,
          project: { select: { id: true, name: true, color: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      teamMembers,
      upcomingDeadlines: upcomingDeadlines.map((t) => ({
        ...t,
        dueDate: t.dueDate!,
      })),
    };
  },
};
