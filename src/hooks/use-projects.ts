"use client";

// ============================================================
// TanStack Query Hooks — Projects
// ============================================================
// All data access goes through the existing /api/projects routes.
// Mutations automatically invalidate the projects query cache.
// ============================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateProjectInput, UpdateProjectInput } from "@/schemas/project.schema";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  color: string | null;
  startDate: string | null;
  dueDate: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { tasks: number };
  creator?: { id: string; name: string | null; email: string } | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: { message: string; statusCode: number };
}

export interface ProjectFilters {
  status?: string;
  search?: string;
}

// ────────────────────────────────────────────────────────────
// Query Keys
// ────────────────────────────────────────────────────────────

export const projectKeys = {
  all: ["projects"] as const,
  list: (filters?: ProjectFilters) => ["projects", "list", filters] as const,
  detail: (id: string) => ["projects", "detail", id] as const,
};

// ────────────────────────────────────────────────────────────
// Fetch Helpers
// ────────────────────────────────────────────────────────────

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || "Something went wrong");
  }

  return json.data;
}

// ────────────────────────────────────────────────────────────
// Queries
// ────────────────────────────────────────────────────────────

/**
 * Fetch all projects with optional status/search filters.
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.search) params.set("search", filters.search);

      const qs = params.toString();
      return fetchApi<Project[]>(`/api/projects${qs ? `?${qs}` : ""}`);
    },
  });
}

/**
 * Fetch a single project by ID.
 */
export function useProject(id: string | null) {
  return useQuery({
    queryKey: projectKeys.detail(id!),
    queryFn: () => fetchApi<Project>(`/api/projects/${id}`),
    enabled: !!id,
  });
}

// ────────────────────────────────────────────────────────────
// Mutations
// ────────────────────────────────────────────────────────────

/**
 * Create a new project.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      fetchApi<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/**
 * Update an existing project.
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      fetchApi<Project>(`/api/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Delete a project.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<null>(`/api/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
