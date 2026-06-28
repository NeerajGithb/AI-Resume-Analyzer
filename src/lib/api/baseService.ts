import axios, { AxiosInstance, AxiosError } from 'axios';

// ─── Error class ──────────────────────────────────────────────────────────────

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

// ─── Axios instance ───────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL:         API_BASE_URL,
  timeout:         60_000,
  withCredentials: true,
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Automatically unwraps the standard { success: true, data: T } envelope
// so services never need to do response.data.data manually.

axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Unwrap envelope if present
    if (
      body &&
      typeof body === 'object' &&
      'success' in body &&
      body.success === true &&
      'data' in body
    ) {
      response.data = body.data;
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status    = error.response.status;
      const requestId = error.response.headers['x-request-id'] as string | undefined;
      const data      = error.response.data as Record<string, unknown> | undefined;
      const message   = (data?.message as string) ?? error.message;
      return Promise.reject(new ApiError(status, message, requestId));
    }
    if (error.request) {
      return Promise.reject(new ApiError(0, 'Network error. Please check your connection.'));
    }
    return Promise.reject(new ApiError(0, error.message));
  },
);

export default axiosInstance;