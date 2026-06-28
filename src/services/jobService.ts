import axiosInstance from '@/lib/api/baseService';
import type { Job } from '@/types';

export interface JobFilters {
  status?:     string;
  page?:       number;
  limit?:      number;
  department?: string;
  type?:       string;
  location?:   string;
}

export interface JobsResponse {
  jobs:       Job[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export async function list(filters?: JobFilters): Promise<JobsResponse> {
  const res = await axiosInstance.get<JobsResponse>('/jobs', { params: filters });
  return res.data;
}

export async function getById(id: string): Promise<Job> {
  const res = await axiosInstance.get<Job>(`/jobs/${id}`);
  return res.data;
}

export async function create(data: Partial<Job>): Promise<Job> {
  const res = await axiosInstance.post<Job>('/jobs', data);
  return res.data;
}

export async function update(id: string, data: Partial<Job>): Promise<Job> {
  const res = await axiosInstance.put<Job>(`/jobs/${id}`, data);
  return res.data;
}

export async function remove(id: string): Promise<void> {
  await axiosInstance.delete(`/jobs/${id}`);
}
