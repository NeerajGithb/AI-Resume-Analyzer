'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/logError';
import { Button } from '@/components/ui/Button';

interface Props {
  children:    ReactNode;
  /** Custom fallback UI. If omitted, a generic error card is shown. */
  fallback?:   ReactNode;
  /** Descriptive name for this boundary (used in error logs). */
  name?:       string;
}

interface State {
  hasError: boolean;
  error:    Error | null;
}

/**
 * Feature-level error boundary.
 *
 * Wrap each dashboard feature/route in this to ensure one failing feature
 * does not crash the entire app.
 *
 * Usage:
 *   <FeatureErrorBoundary name="History">
 *     <HistoryList />
 *   </FeatureErrorBoundary>
 */
export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError(error, {
      context: {
        boundary:        this.props.name ?? 'unknown',
        componentStack:  info.componentStack ?? undefined,
      },
    });
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback)  return this.props.fallback;

    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          {this.state.error?.message ?? 'An unexpected error occurred in this section.'}
        </p>
        <Button variant="outline" size="sm" onClick={this.handleReset}>
          Try Again
        </Button>
      </div>
    );
  }
}
