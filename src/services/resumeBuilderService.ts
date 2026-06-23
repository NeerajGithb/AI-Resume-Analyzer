import { http } from '@/lib/httpClient';
import { BuilderInput, BuilderResult } from '@/types';

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

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function generateResume(input: BuilderInput): Promise<BuilderResult> {
  const response = await http.postJson<ApiResponse<BuilderResult>>(
    '/builder/generate',
    input,
  );
  return response.data;
}

export async function getResumeById(id: string): Promise<BuilderResult> {
  const response = await http.get<ApiResponse<BuilderResult>>(`/builder/${id}`);
  return response.data;
}
