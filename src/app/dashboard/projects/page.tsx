import React from "react";
import { ProjectsPageClient } from "@/features/projects";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Projects
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your organization&apos;s projects here.
        </p>
      </div>

      <ProjectsPageClient />
    </div>
  );
}
