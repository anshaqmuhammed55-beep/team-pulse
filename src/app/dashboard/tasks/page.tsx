import React from "react";

export default async function TasksPage() {

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tasks
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your organization&apos;s tasks here.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
          <svg className="h-8 w-8 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Tasks Module
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          This page is currently under construction. Future updates will include full CRUD operations and a detailed list of tasks.
        </p>
      </div>
    </div>
  );
}
