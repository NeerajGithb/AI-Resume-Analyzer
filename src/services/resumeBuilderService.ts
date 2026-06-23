import { http } from '@/lib/httpClient';

export interface BuilderFormData {
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  skills: string;
}

export interface BuilderResult {
  id: string;
  name: string;
  summary: string;
  projects: Array<{
    name: string;
    year: string;
    technologies: string;
    url?: string;
    bullets: string[];
  }>;
  achievements: string[];
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function generateResume(formData: BuilderFormData): Promise<BuilderResult> {
  const response = await http.postJson<ApiResponse<BuilderResult>>(
    '/builder/generate',
    formData,
  );
  return response.data;
}

export async function getResumeById(id: string): Promise<BuilderResult> {
  const response = await http.get<ApiResponse<BuilderResult>>(`/builder/${id}`);
  return response.data;
}
