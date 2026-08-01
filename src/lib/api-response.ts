// ============================================================
// Standardized API Response Helpers
// ============================================================

import type { ApiResponse, PaginatedResponse, PaginationMeta } from "@/types";

/**
 * Create a successful API response.
 */
export function success<T>(data: T, message: string = "Success"): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Create an error API response.
 */
export function error(message: string, statusCode: number = 500): ApiResponse<null> {
  return {
    success: false,
    message,
    data: null,
    error: {
      message,
      statusCode,
    },
  };
}

/**
 * Create a paginated API response.
 */
export function paginated<T>(
  data: T[],
  meta: PaginationMeta,
  message: string = "Success"
): PaginatedResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}
