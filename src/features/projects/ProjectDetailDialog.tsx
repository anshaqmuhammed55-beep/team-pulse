"use client";

// ============================================================
// Project Detail Dialog
// ============================================================

import React from "react";
import {
  Calendar,
  CalendarClock,
  ClipboardList,
  Edit,
  Trash2,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Project } from "@/hooks/use-projects";

interface ProjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function ProjectDetailDialog({
  open,
  onOpenChange,
  project,
  onEdit,
  onDelete,
}: ProjectDetailDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="flex-1">{project.name}</DialogTitle>
            <Badge
              className={`border-0 ${STATUS_STYLES[project.status] ?? ""}`}
            >
              {STATUS_LABELS[project.status] ?? project.status}
            </Badge>
          </div>
          {project.description && (
            <DialogDescription>{project.description}</DialogDescription>
          )}
        </DialogHeader>

        <Separator />

        <div className="space-y-3">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Start Date
                </p>
                <p>{formatDate(project.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Due Date
                </p>
                <p>{formatDate(project.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Tasks count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
            <span>
              <span className="font-medium text-foreground">
                {project._count.tasks}
              </span>{" "}
              task{project._count.tasks !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Creator */}
          {project.creator && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                Created by{" "}
                <span className="font-medium text-foreground">
                  {project.creator.name || project.creator.email}
                </span>
              </span>
            </div>
          )}

          {/* Created at */}
          <div className="text-xs text-muted-foreground">
            Created {formatDate(project.createdAt)} · Updated{" "}
            {formatDate(project.updatedAt)}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onDelete(project);
            }}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onEdit(project);
            }}
          >
            <Edit className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
