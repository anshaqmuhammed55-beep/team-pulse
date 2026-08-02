import React from "react";
import { currentUser, auth } from "@clerk/nextjs/server";
import { DashboardService } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const user = await currentUser();
  const { orgId } = await auth();

  // If no organization is selected, show a prompt
  if (!orgId) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome, {user?.firstName || user?.username || "User"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Please select an organization from the menu above to get started.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            No Organization Selected
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Create or select an organization using the switcher in the top navigation bar to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const stats = await DashboardService.getStats(orgId);

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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Projects</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalProjects}</h3>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Projects</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.activeProjects}</h3>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
              <svg className="h-6 w-6 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed Tasks</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.completedTasks}
                <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500"> / {stats.totalTasks}</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              stats.overdueTasks > 0
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-zinc-100 dark:bg-zinc-800"
            }`}>
              <svg className={`h-6 w-6 ${
                stats.overdueTasks > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Overdue Tasks</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.overdueTasks}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Team Members & Completed Projects */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Team Members</p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.teamMembers}</h3>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.996.44-1.773 1.21-2.213 2.157m16.476 0c-.44-.947-1.217-1.716-2.213-2.157M12 12.75a3 3 0 0 1-3-3V6.75a3 3 0 0 1 6 0v3a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed Projects</p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.completedProjects}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Upcoming Deadlines</h3>
          </div>
          {stats.upcomingDeadlines.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 py-10">
              No upcoming deadlines this week. 🎉
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {stats.upcomingDeadlines.map((deadline) => (
                <li key={deadline.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {deadline.title}
                    </span>
                    {deadline.project && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {deadline.project.name}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {new Date(deadline.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
