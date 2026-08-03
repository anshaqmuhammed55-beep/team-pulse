"use client";

// ============================================================
// Projects Error State
// ============================================================

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ProjectsErrorState({
  message = "Failed to load projects",
  onRetry,
}: ProjectsErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
        {message}. Please check your connection and try again.
      </p>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
