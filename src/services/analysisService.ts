import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { AnalysisStage } from '@/lib/constants';
import type { AnalysisResult } from '@/types';

export type OnStage = (stage: AnalysisStage, progress: number) => void;

// Stages shown to the user — "finalizing" animates AFTER the API returns
const ANALYSIS_STAGES: AnalysisStage[] = [
  'uploading', 'parsing', 'scoring', 'keywords', 'suggestions', 'finalizing',
];

// Per-stage durations in ms
const STAGE_DURATIONS = [900, 1400, 1800, 1600, 1400, 600];

export async function run(
  file: File,
  signal: AbortSignal,
  onStage: OnStage,
  yearsOfExperience?: string,
  targetRole?: string,
): Promise<AnalysisResult & { id: string }> {
  const progress = new ProgressHelper<AnalysisStage>(onStage, signal);

  return await progress.run(
    ANALYSIS_STAGES,
    async () => {
      const formData = new FormData();
      formData.append('resume', file);
      if (yearsOfExperience) formData.append('yearsOfExperience', yearsOfExperience);
      if (targetRole)        formData.append('targetRole', targetRole);

      const response = await axiosInstance.post<AnalysisResult & { id: string }>(
        '/analyze',
        formData,
        { signal },
      );
      return response.data;
    },
    STAGE_DURATIONS,
  );
}

export async function getById(id: string): Promise<AnalysisResult & { id: string }> {
  const response = await axiosInstance.get<AnalysisResult & { id: string }>(`/analyze/${id}`);
  return response.data;
}