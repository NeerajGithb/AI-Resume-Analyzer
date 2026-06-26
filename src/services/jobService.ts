import axiosInstance from '@/lib/api/baseService';
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
  const response = await axiosInstance.get<JobsResponse>('/jobs', {
    params: filters
  });
  return response.data;
}

export async function getJobById(id: string): Promise<{ success: boolean; data: Job }> {
  const response = await axiosInstance.get<{ success: boolean; data: Job }>(`/jobs/${id}`);
  return response.data;
}

export async function createJob(jobData: Partial<Job>): Promise<{ success: boolean; data: Job; message: string }> {
  const response = await axiosInstance.post<{ success: boolean; data: Job; message: string }>('/jobs', jobData);
  return response.data;
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<{ success: boolean; data: Job; message: string }> {
  const response = await axiosInstance.put<{ success: boolean; data: Job; message: string }>(`/jobs/${id}`, updates);
  return response.data;
}

export async function deleteJob(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axiosInstance.delete<{ success: boolean; message: string }>(`/jobs/${id}`);
  return response.data;
}
