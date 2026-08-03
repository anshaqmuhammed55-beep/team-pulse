"use client";

// ============================================================
// Projects Table — Desktop View
// ============================================================

import React from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import type { Project } from "@/hooks/use-projects";
import type { SortConfig } from "./ProjectsPageClient";

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
    year: "numeric",
  });
}

// ────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────

interface ProjectsTableProps {
  projects: Project[];
  sortConfig: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

// ────────────────────────────────────────────────────────────
// Sort Icon
// ────────────────────────────────────────────────────────────

function SortIcon({
  field,
  sortConfig,
}: {
  field: SortConfig["field"];
  sortConfig: SortConfig;
}) {
  if (sortConfig.field !== field) {
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
  }
  return sortConfig.direction === "asc" ? (
    <ArrowUp className="ml-1 h-3 w-3" />
  ) : (
    <ArrowDown className="ml-1 h-3 w-3" />
  );
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function ProjectsTable({
  projects,
  sortConfig,
  onSort,
  onView,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  return (
    <div className="hidden md:block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <button
                className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors"
                onClick={() => onSort("name")}
              >
                Name
                <SortIcon field="name" sortConfig={sortConfig} />
              </button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <button
                className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors"
                onClick={() => onSort("startDate")}
              >
                Start Date
                <SortIcon field="startDate" sortConfig={sortConfig} />
              </button>
            </TableHead>
            <TableHead>
              <button
                className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors"
                onClick={() => onSort("dueDate")}
              >
                Due Date
                <SortIcon field="dueDate" sortConfig={sortConfig} />
              </button>
            </TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="cursor-pointer group"
              onClick={() => onView(project)}
            >
              <TableCell className="font-medium text-foreground">
                <div>
                  <span>{project.name}</span>
                  {project.description && (
                    <p className="text-xs text-muted-foreground truncate max-w-[300px] mt-0.5">
                      {project.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={`border-0 text-xs ${STATUS_STYLES[project.status] ?? ""}`}
                >
                  {STATUS_LABELS[project.status] ?? project.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(project.startDate)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(project.dueDate)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project._count.tasks}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(project);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
