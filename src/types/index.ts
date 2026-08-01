// ============================================================
// Shared TypeScript Types
// ============================================================

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
  };
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response.
 */
export interface PaginatedResponse<T> extends Omit<ApiResponse<T[]>, "data"> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Pagination query params from the client.
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Generic search/filter params.
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, string | string[]>;
}

/**
 * ID param from route segments.
 */
export interface IdParam {
  id: string;
}

/**
 * Organization-scoped params (multi-tenant context).
 */
export interface OrgScopedParams {
  organizationId: string;
}
