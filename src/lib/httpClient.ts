import { API_BASE_URL } from './constants';

// ─── ApiError ──────────────────────────────────────────────────────────────────
// Thrown by every service when the server returns a non-2xx response.
// Components/stores catch this and can read .status, .message, .requestId.
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Response parser ───────────────────────────────────────────────────────────
async function parseError(res: Response): Promise<ApiError> {
  const requestId = res.headers.get('x-request-id') ?? undefined;
  try {
    const body = (await res.json()) as { message?: string };
    return new ApiError(res.status, body.message ?? res.statusText, requestId);
  } catch {
    return new ApiError(res.status, res.statusText, requestId);
  }
}

// ─── Base request ──────────────────────────────────────────────────────────────
interface RequestOptions extends Omit<RequestInit, 'method'> {
  params?: Record<string, string | number>;
}

function buildUrl(path: string, params?: Record<string, string | number>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...init } = options;
  
  // Get token from localStorage if available
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token || null;
      }
    } catch {
      // Ignore errors
    }
  }

  const headers: Record<string, string> = { 
    'Accept': 'application/json', 
    ...((init.headers as Record<string, string>) || {})
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), {
    ...init,
    method,
    headers,
  });

  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<T>;
}

// ─── Public helpers ────────────────────────────────────────────────────────────
export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, options),

  post: <T>(path: string, options?: RequestOptions) =>
    request<T>('POST', path, options),

  // For JSON POST requests (e.g., builder)
  postJson: <T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>('POST', path, {
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  // For JSON PUT requests
  put: <T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>('PUT', path, {
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  // For DELETE requests
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, options),

  // For multipart/SSE — returns raw Response so the caller controls streaming
  stream: (path: string, body: FormData, signal?: AbortSignal): Promise<Response> => {
    // Get token from localStorage if available
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token || null;
        }
      } catch {
        // Ignore errors
      }
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(buildUrl(path), { 
      method: 'POST', 
      body, 
      signal,
      headers,
    });
  },
};

