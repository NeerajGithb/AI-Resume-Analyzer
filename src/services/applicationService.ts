import { http, ApiError } from '@/lib/httpClient';
import { API_BASE_URL } from '@/lib/constants';
import type {
  PreCheckResult,
  ApplicationSubmitData,
  ApplicationSubmitResponse,
  ApplicationsResponse,
  Application,
  ApplicationAnalytics
} from '@/types';

export async function preCheckResume(
  jobId: string,
  file: File
): Promise<{ success: boolean; data: PreCheckResult }> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobId', jobId);

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

  const res = await fetch(`${API_BASE_URL}/applications/pre-check`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!res.ok) {
    const requestId = res.headers.get('x-request-id') ?? undefined;
    try {
      const body = (await res.json()) as { message?: string };
      throw new ApiError(res.status, body.message ?? res.statusText, requestId);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(res.status, res.statusText, requestId);
    }
  }

  return res.json() as Promise<{ success: boolean; data: PreCheckResult }>;
}

export async function submitApplication(
  data: ApplicationSubmitData
): Promise<ApplicationSubmitResponse> {
  return http.postJson<ApplicationSubmitResponse>('/applications/submit', data);
}

export async function getApplicationsByJob(
  jobId: string,
  filters?: {
    status?: string;
    minScore?: number;
    maxScore?: number;
    page?: number;
    limit?: number;
  }
): Promise<ApplicationsResponse> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.minScore) params.append('minScore', filters.minScore.toString());
  if (filters?.maxScore) params.append('maxScore', filters.maxScore.toString());
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const query = params.toString();
  const url = `/applications/job/${jobId}${query ? `?${query}` : ''}`;
  
  return http.get<ApplicationsResponse>(url);
}

export async function getApplicationById(
  id: string
): Promise<{ success: boolean; data: Application }> {
  return http.get<{ success: boolean; data: Application }>(`/applications/${id}`);
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  stage?: string,
  note?: string
): Promise<{ success: boolean; data: Application; message: string }> {
  return http.put<{ success: boolean; data: Application; message: string }>(
    `/applications/${id}/status`,
    { status, stage, note }
  );
}

export async function getApplicationAnalytics(
  jobId?: string
): Promise<{ success: boolean; data: ApplicationAnalytics }> {
  const url = `/analytics/applications${jobId ? `?jobId=${jobId}` : ''}`;
  return http.get<{ success: boolean; data: ApplicationAnalytics }>(url);
}
