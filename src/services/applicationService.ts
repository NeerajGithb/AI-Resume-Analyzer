import { http } from '@/lib/httpClient';
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

  return http.postFormData<{ success: boolean; data: PreCheckResult }>(
    '/applications/pre-check',
    formData
  );
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
