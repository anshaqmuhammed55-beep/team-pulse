import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background decorations */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      
      {/* Content wrapper */}
      <div className="relative z-10 p-8 w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              T
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Team Pulse
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Your modern workspace, centralized.
            </p>
          </div>
          <div className="w-full flex justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
