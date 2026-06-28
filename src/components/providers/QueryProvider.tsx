'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ApiError } from '@/lib/api/baseService';
import { logError } from '@/lib/logError';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is fresh for 1 minute globally; features can override
            staleTime:            60 * 1000,
            refetchOnWindowFocus: false,
            // Do NOT retry on 4xx errors — they are deterministic failures
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            // Log all unhandled mutation errors globally
            onError: (error) => {
              logError(error, { context: { type: 'mutation' } });
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
