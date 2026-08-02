import React from "react";

export default async function ProjectsPage() {

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

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Projects Module
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          This page is currently under construction. Future updates will include full CRUD operations and a detailed list of projects.
        </p>
      </div>
    </div>
  );
}
