// ============================================================
// Task Validation Schemas
// ============================================================

import { z } from "zod/v4";

export const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be 200 characters or less"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .nullable(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "CANCELLED"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .nullable(),
  estimatedHours: z
    .number()
    .min(0, "Estimated hours cannot be negative")
    .max(1000, "Estimated hours seems too high")
    .optional()
    .nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
