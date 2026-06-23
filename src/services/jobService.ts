import { http } from '@/lib/httpClient';
import type { Job, JobsResponse } from '@/types';

interface JobFilters {
  department?: string;
  type?: string;
  location?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getJobs(filters?: JobFilters): Promise<JobsResponse> {
  const params = new URLSearchParams();
  
  if (filters?.department) params.append('department', filters.department);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.location) params.append('location', filters.location);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const query = params.toString();
  const url = `/jobs${query ? `?${query}` : ''}`;
  
  return http.get<JobsResponse>(url);
}

export async function getJobById(id: string): Promise<{ success: boolean; data: Job }> {
  return http.get<{ success: boolean; data: Job }>(`/jobs/${id}`);
}

export async function createJob(jobData: Partial<Job>): Promise<{ success: boolean; data: Job; message: string }> {
  return http.postJson<{ success: boolean; data: Job; message: string }>('/jobs', jobData);
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<{ success: boolean; data: Job; message: string }> {
  return http.put<{ success: boolean; data: Job; message: string }>(`/jobs/${id}`, updates);
}

export async function deleteJob(id: string): Promise<{ success: boolean; message: string }> {
  return http.delete<{ success: boolean; message: string }>(`/jobs/${id}`);
}
