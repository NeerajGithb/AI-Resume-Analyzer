import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { AnalysisStage } from '@/lib/constants';
import { AnalysisResult } from '@/types';

export type OnStage = (stage: AnalysisStage, progress: number) => void;

// Stages shown to the user — last one ("finalizing") animates AFTER API returns
const ANALYSIS_STAGES: AnalysisStage[] = [
  'uploading',
  'parsing',
  'scoring',
  'keywords',
  'suggestions',
  'finalizing',   // ← added; ProgressHelper animates this only after API resolves
];

// Per-stage durations in ms — generous so UI never looks rushed
const STAGE_DURATIONS = [
  900,   // uploading
  1400,  // parsing
  1800,  // scoring
  1600,  // keywords
  1400,  // suggestions
  600,   // finalizing (post-API, quick wrap-up)
];

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

      console.log('[AnalysisService] Calling API...');
      const response = await axiosInstance.post<{
        success: boolean;
        data: AnalysisResult & { id: string };
      }>('/analyze', formData, { signal });

      console.log('[AnalysisService] Response:', {
        status:      response.status,
        hasData:     !!response.data,
        hasSuccess:  response.data?.success,
        hasId:       !!(response.data?.data as any)?.id,
      });

      if (!response.data?.success) throw new Error('API returned success: false');
      if (!response.data?.data)    throw new Error('API response missing data field');

      return response.data.data;
    },
    STAGE_DURATIONS
  );
}

export async function getById(id: string): Promise<AnalysisResult & { id: string }> {
  const response = await axiosInstance.get<{
    success: boolean;
    data: AnalysisResult & { id: string };
  }>(`/analyze/${id}`);

  if (!response.data?.success) throw new Error('API returned success: false');
  if (!response.data?.data)    throw new Error('API response missing data field');

  return response.data.data;
}