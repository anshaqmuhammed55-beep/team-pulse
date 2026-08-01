// ============================================================
// Environment Variable Validation
// ============================================================
// Validates required environment variables at import time.
// Import this module early in the application lifecycle.
// ============================================================

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
        `   Please add ${key} to your .env or .env.local file.\n` +
        `   See the README for setup instructions.`
    );
  }
  return value;
}

function getOptionalEnvVar(key: string, fallback: string = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  /** PostgreSQL connection string (prisma+postgres:// protocol — used by Prisma CLI) */
  DATABASE_URL: getEnvVar("DATABASE_URL"),

  /** Direct TCP connection to PostgreSQL (used by the pg driver adapter in application code) */
  DIRECT_DATABASE_URL: getEnvVar("DIRECT_DATABASE_URL"),

  /** Node environment */
  NODE_ENV: getOptionalEnvVar("NODE_ENV", "development"),

  /** Clerk keys — validated later during Clerk integration (Phase 3+) */
  CLERK_PUBLISHABLE_KEY: getOptionalEnvVar("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: getOptionalEnvVar("CLERK_SECRET_KEY"),
} as const;

export type Env = typeof env;
