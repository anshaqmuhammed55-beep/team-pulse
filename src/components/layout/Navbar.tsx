import React from "react";
import Link from "next/link";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/50 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
              T
            </div>
            <span className="hidden font-bold sm:inline-block text-zinc-900 dark:text-zinc-100">
              Team Pulse
            </span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/projects"
              className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Projects
            </Link>
            <Link
              href="/dashboard/tasks"
              className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Tasks
            </Link>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Multi-tenant Organization Switcher */}
          <div className="hidden sm:block">
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900",
                  organizationPreviewMainIdentifier: "text-zinc-900 dark:text-zinc-100",
                },
              }}
              hidePersonal={false}
            />
          </div>
          
          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
          
          {/* Authenticated User Menu */}
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9",
                userButtonPopoverCard: "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl",
                userButtonPopoverActionButtonText: "text-zinc-700 dark:text-zinc-300",
                userButtonPopoverActionButtonIcon: "text-zinc-500 dark:text-zinc-400",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
}
