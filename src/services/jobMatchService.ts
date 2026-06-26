import axiosInstance, { ApiError } from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { JobMatchResult, JobMatchStage } from '@/types';

export type OnStage = (stage: JobMatchStage, progress: number) => void;

// Stages shown to user
const JOB_MATCH_STAGES: JobMatchStage[] = [
  'uploading',
  'parsing',
  'matching',
  'finalizing',
];

// Per-stage durations in ms
const STAGE_DURATIONS = [
  800,   // uploading
  1500,  // parsing
  2500,  // matching (longest - AI comparison)
  600,   // finalizing
];

/**
 * Matches resume to job description with realistic progress animation.
 */
export async function matchResumeToJob(
  resume: File,
  jobDescription: string,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<JobMatchResult & { id: string }> {
  
  const progress = new ProgressHelper<JobMatchStage>(onStage, signal);

  return await progress.run(
    JOB_MATCH_STAGES,
    async () => {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('jobDescription', jobDescription);

      console.log('[JobMatchService] Calling API...');
      const response = await axiosInstance.post<{ 
        success: boolean; 
        data: JobMatchResult & { id: string } 
      }>(
        '/match',
        formData,
        {
          signal,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('[JobMatchService] Response:', {
        status: response.status,
        hasData: !!response.data,
        hasSuccess: response.data?.success,
        hasId: !!(response.data?.data as any)?.id,
      });

      if (!response.data?.success) throw new Error('API returned success: false');
      if (!response.data?.data) throw new Error('API response missing data field');

      return response.data.data;
    },
    STAGE_DURATIONS
  );
}

export async function getJobMatchById(id: string): Promise<JobMatchResult & { id: string }> {
  const response = await axiosInstance.get<{
    success: boolean;
    data: JobMatchResult & { id: string };
  }>(`/match/${id}`);

  if (!response.data?.success) throw new Error('API returned success: false');
  if (!response.data?.data) throw new Error('API response missing data field');

  return response.data.data;
}

