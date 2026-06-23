'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-center space-y-6 shadow-[var(--shadow-sm)]">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
        </div>

        {error.digest && (
          <div className="bg-gray-50 rounded-[var(--radius-md)] p-3">
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Error ID: {error.digest}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={reset}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

