// ============================================================
// Dashboard Stats API
// ============================================================

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { DashboardService } from "@/services/dashboard.service";
import { handleError } from "@/lib/error-handler";

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the authenticated organization.
 */
export async function GET() {
  try {
    const { orgId } = await requireAuth();

    const stats = await DashboardService.getStats(orgId);

    return NextResponse.json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
