// ============================================================
// Auth Helper — Extracts and verifies Clerk session context
// ============================================================
// Every protected API route and server action should call
// `requireAuth()` to get the authenticated userId and orgId.
// Throws typed errors that the centralized handler can catch.
// ============================================================

import { auth } from "@clerk/nextjs/server";
import { UnauthorizedError, ForbiddenError } from "./errors";

export interface AuthContext {
  userId: string;
  orgId: string;
}

/**
 * Require both authentication and an active organization.
 * Returns the userId and orgId for downstream queries.
 */
export async function requireAuth(): Promise<AuthContext> {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  if (!orgId) {
    throw new ForbiddenError(
      "Please select an organization to continue"
    );
  }

  return { userId, orgId };
}

/**
 * Require authentication only (no org needed).
 * Used for endpoints that work without an org context.
 */
export async function requireUser(): Promise<{ userId: string }> {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return { userId };
}
