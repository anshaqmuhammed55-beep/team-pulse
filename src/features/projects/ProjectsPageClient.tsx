"use client";

// ============================================================
// Projects Page Client — Main Orchestrator
// ============================================================
// Client component that manages all project CRUD interactions,
// search, filtering, sorting, and dialog state.
// ============================================================

import React, { useState, useMemo, useCallback } from "react";
import { Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProjects, type Project, type ProjectFilters } from "@/hooks/use-projects";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectsCardGrid } from "./ProjectsCardGrid";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { ProjectDetailDialog } from "./ProjectDetailDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { ProjectsLoadingSkeleton } from "./ProjectsLoadingSkeleton";
import { ProjectsEmptyState } from "./ProjectsEmptyState";
import { ProjectsErrorState } from "./ProjectsErrorState";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface SortConfig {
  field: "name" | "createdAt" | "startDate" | "dueDate";
  direction: "asc" | "desc";
}

const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function ProjectsPageClient() {
  // ── Filter state ──────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "createdAt",
    direction: "desc",
  });

  // Debounce search
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null);
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setDebouncedSearch(value.trim());
      }, 300);
    },
    []
  );

  // Build API filters
  const filters: ProjectFilters = useMemo(
    () => ({
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }),
    [statusFilter, debouncedSearch]
  );

  const hasActiveFilters = statusFilter !== "ALL" || !!debouncedSearch;

  // ── Data fetching ─────────────────────────────────────────
  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useProjects(filters);

  // ── Client-side sorting ───────────────────────────────────
  const sortedProjects = useMemo(() => {
    if (!projects) return [];

    return [...projects].sort((a, b) => {
      const { field, direction } = sortConfig;
      const multiplier = direction === "asc" ? 1 : -1;

      if (field === "name") {
        return multiplier * a.name.localeCompare(b.name);
      }

      const aVal = a[field] ? new Date(a[field]!).getTime() : 0;
      const bVal = b[field] ? new Date(b[field]!).getTime() : 0;
      return multiplier * (aVal - bVal);
    });
  }, [projects, sortConfig]);

  const handleSort = useCallback(
    (field: SortConfig["field"]) => {
      setSortConfig((prev) => ({
        field,
        direction:
          prev.field === field && prev.direction === "asc" ? "desc" : "asc",
      }));
    },
    []
  );

  // ── Dialog state ──────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleCreate = useCallback(() => {
    setEditingProject(null);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((project: Project) => {
    setViewingProject(project);
    setDetailOpen(true);
  }, []);

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((project: Project) => {
    setDeletingProject(project);
    setDeleteOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
  }, []);

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ──── Toolbar ──── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="projects-search"
            placeholder="Search projects..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchInput && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
            <SelectTrigger id="projects-status-filter" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create button */}
          <Button onClick={handleCreate} id="create-project-btn">
            <Plus className="mr-1 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* ──── Content ──── */}
      {isLoading ? (
        <ProjectsLoadingSkeleton />
      ) : isError ? (
        <ProjectsErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : sortedProjects.length === 0 ? (
        <ProjectsEmptyState
          hasFilters={hasActiveFilters}
          onCreateProject={handleCreate}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <>
          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {sortedProjects.length} project
            {sortedProjects.length !== 1 ? "s" : ""}
            {hasActiveFilters ? " found" : ""}
          </p>

          {/* Table — desktop */}
          <ProjectsTable
            projects={sortedProjects}
            sortConfig={sortConfig}
            onSort={handleSort}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Card grid — mobile */}
          <ProjectsCardGrid
            projects={sortedProjects}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* ──── Dialogs ──── */}
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editingProject}
      />

      <ProjectDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        project={viewingProject}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        project={deletingProject}
      />
    </div>
  );
}
