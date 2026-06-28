export const dynamic = 'force-dynamic';

interface ErrorLog {
  _id: string;
  message: string;
  stack?: string;
  source: 'client' | 'server';
  route?: string;
  userId?: string;
  userAgent?: string;
  context?: Record<string, unknown>;
  createdAt: string;
}

async function getErrors(): Promise<ErrorLog[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'}/error-log?limit=200`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminErrorsPage() {
  const errors = await getErrors();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Error Logs</h1>
          <p className="text-sm text-gray-500 mt-1">{errors.length} most recent errors</p>
        </div>
        <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
          Admin Only
        </span>
      </div>

      {errors.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">No errors logged yet.</div>
      ) : (
        <div className="space-y-3">
          {errors.map((err) => (
            <div
              key={err._id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-gray-900 break-all">{err.message}</p>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    err.source === 'client'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {err.source}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                {err.route && (
                  <span>Route: <span className="font-mono text-gray-600">{err.route}</span></span>
                )}
                {err.userId && (
                  <span>User: <span className="font-mono text-gray-600">{err.userId}</span></span>
                )}
                <span>{new Date(err.createdAt).toLocaleString()}</span>
              </div>

              {err.stack && (
                <details className="mt-1">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    Stack trace
                  </summary>
                  <pre className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-3 overflow-x-auto whitespace-pre-wrap break-all">
                    {err.stack}
                  </pre>
                </details>
              )}

              {err.context && Object.keys(err.context).length > 0 && (
                <details>
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    Context
                  </summary>
                  <pre className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-3 overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(err.context, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
