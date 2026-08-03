"use client";

// ============================================================
// Client-Side Providers
// ============================================================
// Wraps the app with TanStack Query and Sonner toast.
// Separated from the root layout to keep it a server component.
// ============================================================

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontFamily: "var(--font-geist-sans)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
