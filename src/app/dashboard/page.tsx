import React from "react";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome back, {user?.firstName || user?.username || "User"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Placeholder cards for dashboard metrics */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
              12
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Projects</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">+2 this week</h3>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
              24
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tasks Completed</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">82% success</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-semibold text-lg">
              8
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Needs attention</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-5">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 py-12">
          No recent activity to show. Get started by creating a project!
        </div>
      </div>
    </div>
  );
}
