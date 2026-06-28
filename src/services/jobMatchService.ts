import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import type { JobMatchResult, JobMatchStage } from '@/types';

export type OnStage = (stage: JobMatchStage, progress: number) => void;

const JOB_MATCH_STAGES: JobMatchStage[] = ['uploading', 'parsing', 'matching', 'finalizing'];
const STAGE_DURATIONS = [800, 1500, 2500, 600];

export async function matchResumeToJob(
  resume: File,
  jobDescription: string,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<JobMatchResult & { id: string }> {
  const progress = new ProgressHelper<JobMatchStage>(onStage, signal);

  return progress.run(
    JOB_MATCH_STAGES,
    async () => {
      const fd = new FormData();
      fd.append('resume', resume);
      fd.append('jobDescription', jobDescription);

      const res = await axiosInstance.post<JobMatchResult & { id: string }>(
        '/match',
        fd,
        { signal },
      );
      return res.data;
    },
    STAGE_DURATIONS,
  );
}

export async function getJobMatchById(id: string): Promise<JobMatchResult & { id: string }> {
  const res = await axiosInstance.get<JobMatchResult & { id: string }>(`/match/${id}`);
  return res.data;
}
