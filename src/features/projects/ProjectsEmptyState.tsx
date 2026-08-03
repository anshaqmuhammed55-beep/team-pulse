"use client";

// ============================================================
// Projects Empty State
// ============================================================

import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsEmptyStateProps {
  hasFilters: boolean;
  onCreateProject: () => void;
  onClearFilters: () => void;
}

export function ProjectsEmptyState({
  hasFilters,
  onCreateProject,
  onClearFilters,
}: ProjectsEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          No matching projects
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
          No projects match your current search or filter criteria.
          Try adjusting your filters.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
        <FolderPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        No projects yet
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
        Get started by creating your first project. Organize your work,
        track progress, and collaborate with your team.
      </p>
      <Button onClick={onCreateProject}>
        <FolderPlus className="mr-2 h-4 w-4" />
        Create your first project
      </Button>
    </div>
  );
}
