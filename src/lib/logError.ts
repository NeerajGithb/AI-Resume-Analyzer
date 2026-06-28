'use client';

import axiosInstance from '@/lib/api/baseService';

interface LogErrorOptions {
  route?:   string;
  userId?:  string;
  context?: Record<string, unknown>;
}

/**
 * Client-side error logger.
 * Posts to /api/error-log via the shared Axios instance
 * so it uses the same base URL config and interceptors.
 */
export async function logError(
  error: unknown,
  options: LogErrorOptions = {},
): Promise<void> {
  try {
    const err = error instanceof Error ? error : new Error(String(error));

    await axiosInstance.post('/error-log', {
      message:   err.message,
      stack:     err.stack,
      source:    'client',
      route:     options.route ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
      userId:    options.userId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      context:   options.context,
    });
  } catch {
    // Silently fail — logging must never break the app
  }
}
