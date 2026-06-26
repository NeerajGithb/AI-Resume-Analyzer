import axiosInstance, { ApiError } from '@/lib/api/baseService';
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

  const response = await axiosInstance.post<{ success: boolean; data: PreCheckResult }>(
    '/applications/pre-check',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

export async function submitApplication(
  data: ApplicationSubmitData
): Promise<ApplicationSubmitResponse> {
  const response = await axiosInstance.post<ApplicationSubmitResponse>('/applications/submit', data);
  return response.data;
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
  const response = await axiosInstance.get<ApplicationsResponse>(`/applications/job/${jobId}`, {
    params: filters
  });
  return response.data;
}

export async function getApplicationById(
  id: string
): Promise<{ success: boolean; data: Application }> {
  const response = await axiosInstance.get<{ success: boolean; data: Application }>(`/applications/${id}`);
  return response.data;
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  stage?: string,
  note?: string
): Promise<{ success: boolean; data: Application; message: string }> {
  const response = await axiosInstance.put<{ success: boolean; data: Application; message: string }>(
    `/applications/${id}/status`,
    { status, stage, note }
  );
  return response.data;
}

export async function getApplicationAnalytics(
  jobId?: string
): Promise<{ success: boolean; data: ApplicationAnalytics }> {
  const response = await axiosInstance.get<{ success: boolean; data: ApplicationAnalytics }>(
    '/analytics/applications',
    { params: jobId ? { jobId } : undefined }
  );
  return response.data;
}
