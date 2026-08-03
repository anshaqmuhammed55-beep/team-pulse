"use client";

// ============================================================
// Project Form Dialog — Create / Edit
// ============================================================
// Dual-purpose dialog using React Hook Form + Zod validation.
// Reuses the existing createProjectSchema from @/schemas.
// ============================================================

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateProject, useUpdateProject, type Project } from "@/hooks/use-projects";
import { Loader2 } from "lucide-react";

// ────────────────────────────────────────────────────────────
// Form Schema (client-side, mirrors server schema but with
// date fields as plain strings for native date inputs)
// ────────────────────────────────────────────────────────────

const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

interface ProjectFormValues {
  name: string;
  description?: string;
  status?: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  startDate?: string;
  dueDate?: string;
}

// ────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function toDateInputValue(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try {
    return new Date(isoString).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: ProjectFormDialogProps) {
  const isEditing = !!project;

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
      startDate: "",
      dueDate: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (open && project) {
      reset({
        name: project.name,
        description: project.description ?? "",
        status: project.status,
        startDate: toDateInputValue(project.startDate),
        dueDate: toDateInputValue(project.dueDate),
      });
    } else if (open && !project) {
      reset({
        name: "",
        description: "",
        status: "ACTIVE",
        startDate: "",
        dueDate: "",
      });
    }
  }, [open, project, reset]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      // Convert date strings to ISO datetime for the API
      const payload = {
        name: values.name,
        description: values.description || null,
        status: values.status,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : null,
        dueDate: values.dueDate
          ? new Date(values.dueDate).toISOString()
          : null,
      };

      if (isEditing && project) {
        await updateMutation.mutateAsync({
          id: project.id,
          data: payload,
        });
        toast.success("Project updated", {
          description: `"${values.name}" has been updated successfully.`,
        });
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Project created", {
          description: `"${values.name}" has been created successfully.`,
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(isEditing ? "Failed to update project" : "Failed to create project", {
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the project details below."
              : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="project-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="project-name"
              placeholder="e.g. Website Redesign"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Brief description of the project..."
              rows={3}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="project-status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="project-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-start-date">Start Date</Label>
              <Input
                id="project-start-date"
                type="date"
                {...register("startDate")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="project-due-date">Due Date</Label>
              <Input
                id="project-due-date"
                type="date"
                {...register("dueDate")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
