// ============================================================
// Centralized Error Handler
// ============================================================
// Normalizes any thrown error into a consistent shape.
// Handles Prisma-specific errors (unique constraint, not found,
// foreign key violation) and maps them to appropriate HTTP codes.
// ============================================================

import { Prisma } from "@/generated/prisma/client";
import { AppError, ConflictError, NotFoundError, ValidationError } from "./errors";

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
  };
}

/**
 * Normalizes an unknown error into a structured ErrorResponse.
 */
export function handleError(error: unknown): ErrorResponse {
  // --- Application errors ---
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        ...(error instanceof ValidationError && error.errors
          ? { errors: error.errors }
          : {}),
      },
    };
  }

  // --- Prisma errors ---
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      success: false,
      error: {
        message: "Invalid data provided",
        statusCode: 400,
      },
    };
  }

  // --- Generic / unexpected errors ---
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  console.error("[Unhandled Error]", error);

  return {
    success: false,
    error: {
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : message,
      statusCode: 500,
    },
  };
}

/**
 * Maps Prisma error codes to application errors.
 */
function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError
): ErrorResponse {
  switch (error.code) {
    // Unique constraint violation
    case "P2002": {
      const target = (error.meta?.target as string[]) ?? [];
      const fields = target.join(", ");
      return handleError(
        new ConflictError(
          `A record with this ${fields || "value"} already exists`
        )
      );
    }

    // Record not found
    case "P2025":
      return handleError(new NotFoundError("Record"));

    // Foreign key constraint violation
    case "P2003": {
      const field = (error.meta?.field_name as string) ?? "field";
      return handleError(
        new ValidationError(`Invalid reference: ${field} does not exist`)
      );
    }

    default:
      return {
        success: false,
        error: {
          message: "A database error occurred",
          statusCode: 500,
        },
      };
  }
}
