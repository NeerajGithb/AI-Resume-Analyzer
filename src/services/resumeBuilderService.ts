import axiosInstance, { ApiError } from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { BuilderInput, BuilderResult } from '@/types';

const STAGES = ['uploading', 'analyzing', 'organizing', 'generating'];
const DURATIONS = [900, 1400, 1800, 600]; // ms per stage

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
  targetRole: string;
  projectsExperience?: string;
  skills: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function generateResume(
  input: BuilderInput,
  signal: AbortSignal,
  onStage: (stage: string, progress: number) => void
): Promise<BuilderResult> {
  const progress = new ProgressHelper(onStage, signal);

  return await progress.run(
    STAGES,
    async () => {
      try {
        const response = await axiosInstance.post<ApiResponse<BuilderResult>>(
          '/builder',
          input,
          { signal }
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw error;
        }
        throw new ApiError(500, 'Resume generation failed. Please try again.');
      }
    },
    DURATIONS
  );
}

export async function getResumeById(id: string): Promise<BuilderResult> {
  try {
    const response = await axiosInstance.get<ApiResponse<BuilderResult>>(`/builder/${id}`);
    
    if (!response.data?.success || !response.data?.data) {
      throw new ApiError(500, 'Invalid response from server');
    }
    
    return response.data.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to load resume. Please try again.');
  }
}

