import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

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

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const requestId = error.response.headers['x-request-id'];
      const message = (error.response.data as any)?.message || error.message;
      return Promise.reject(new ApiError(status, message, requestId));
    }
    if (error.request) {
      return Promise.reject(new ApiError(0, 'Network error. Please check your connection.'));
    }
    return Promise.reject(new ApiError(0, error.message));
  }
);

export default axiosInstance;