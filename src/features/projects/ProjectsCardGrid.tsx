"use client";

// ============================================================
// Projects Card Grid — Mobile View
// ============================================================

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  CalendarClock,
  ClipboardList,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

import type { Project } from "@/hooks/use-projects";

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ON_HOLD:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  COMPLETED:
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  ARCHIVED:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

function formatDate(isoString: string | null): string {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────

interface ProjectsCardGridProps {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function ProjectsCardGrid({
  projects,
  onView,
  onEdit,
  onDelete,
}: ProjectsCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
          onClick={() => onView(project)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <Badge
                className={`border-0 text-xs ${STATUS_STYLES[project.status] ?? ""}`}
              >
                {STATUS_LABELS[project.status] ?? project.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                >
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(project);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(project);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(project.startDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              {formatDate(project.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <ClipboardList className="h-3.5 w-3.5" />
              {project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
