import axiosInstance from '@/lib/api/baseService';
import type { Application, AdminApplication, AdminApplicationsListResponse } from '@/types';

export interface ApplicationFilters {
  status?:   string;
  page?:     number;
  limit?:    number;
}

export interface ApplicationsResponse {
  applications: Application[];
  pagination:   { total: number; page: number; limit: number; pages: number };
}

export interface CreateApplicationPayload {
  jobId?:    string;
  company:   string;
  position:  string;
  status?:   string;
  appliedDate?: string;
  notes?:    string;
  jobUrl?:   string;
}

export interface UpdateApplicationPayload {
  status?:   string;
  notes?:    string;
  company?:  string;
  position?: string;
  jobUrl?:   string;
}

/** User's own application tracker list */
export async function list(filters?: ApplicationFilters): Promise<ApplicationsResponse> {
  const res = await axiosInstance.get<ApplicationsResponse>('/applications', { params: filters });
  return res.data;
}

/** Admin: list all candidate applications for a job posting */
export async function adminList(filters?: ApplicationFilters): Promise<AdminApplicationsListResponse> {
  const res = await axiosInstance.get<AdminApplicationsListResponse>('/admin/applications', { params: filters });
  return res.data;
}

export async function getById(id: string): Promise<Application> {
  const res = await axiosInstance.get<Application>(`/applications/${id}`);
  return res.data;
}export async function create(data: CreateApplicationPayload): Promise<Application> {
  const res = await axiosInstance.post<Application>('/applications', data);
  return res.data;
}

export async function update(id: string, data: UpdateApplicationPayload): Promise<Application> {
  const res = await axiosInstance.put<Application>(`/applications/${id}`, data);
  return res.data;
}

export async function remove(id: string): Promise<void> {
  await axiosInstance.delete(`/applications/${id}`);
}
