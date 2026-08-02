// ============================================================
// Dashboard Service — Metrics Aggregation
// ============================================================

import { DashboardRepository } from "@/repositories/dashboard.repository";
import type { DashboardStats } from "@/repositories/dashboard.repository";

export const DashboardService = {
  /**
   * Get all dashboard statistics for an organization.
   */
  async getStats(orgId: string): Promise<DashboardStats> {
    return DashboardRepository.getStats(orgId);
  },
};
