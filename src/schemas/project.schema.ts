// ============================================================
// Project Validation Schemas
// ============================================================

import { z } from "zod/v4";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .nullable(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
  color: z
    .string()
    .max(20, "Color must be 20 characters or less")
    .optional()
    .nullable(),
  startDate: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .nullable(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
