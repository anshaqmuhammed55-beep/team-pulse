import React from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-7xl p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
