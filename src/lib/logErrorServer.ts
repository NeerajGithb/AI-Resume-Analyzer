const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

interface LogErrorServerOptions {
  route?: string;
  userId?: string;
  context?: Record<string, unknown>;
}

/**
 * Server-side error logger.
 * POSTs directly to the Node backend's /api/error-log.
 * Use inside Next.js API routes, server actions, and Puppeteer jobs.
 *
 * @example
 * try {
 *   // ...
 * } catch (error) {
 *   await logErrorServer(error, { route: '/api/my-route' });
 * }
 */
export async function logErrorServer(
  error: unknown,
  options: LogErrorServerOptions = {}
): Promise<void> {
  try {
    const err = error instanceof Error ? error : new Error(String(error));

    await fetch(`${BACKEND_URL}/error-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: err.message,
        stack:   err.stack,
        source:  'server',
        route:   options.route,
        userId:  options.userId,
        context: options.context,
      }),
    });
  } catch {
    // Silently fail — logging must never break the app
    console.error('[logErrorServer] Failed to persist error log:', error);
  }
}
