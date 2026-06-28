import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import type { CoverLetterResult, CoverLetterStage } from '@/types';
import type { CoverLetterTone } from '@/store/coverLetterUIStore';

export type OnStage = (stage: CoverLetterStage, progress: number) => void;

export type VariationAction =
  | 'shorten'
  | 'more_professional'
  | 'more_confident'
  | 'ats_optimized';

export interface GenerateInput {
  resume:              File;
  jobTitle:            string;
  companyName:         string;
  jobDescription:      string;
  hiringManagerName?:  string;
  tone?:               CoverLetterTone;
}

const STAGES: CoverLetterStage[] = ['uploading', 'parsing', 'generating', 'finalizing'];
const DURATIONS = [800, 1400, 2500, 600];

const VARIATION_MAP: Record<VariationAction, string> = {
  shorten:           'shorten',
  more_professional: 'professional',
  more_confident:    'confident',
  ats_optimized:     'ats',
};

export async function generateCoverLetter(
  input: GenerateInput,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CoverLetterResult & { id: string }> {
  const progress = new ProgressHelper<CoverLetterStage>(onStage, signal);

  return progress.run(
    STAGES,
    async () => {
      const fd = new FormData();
      fd.append('resume', input.resume);
      fd.append('jobTitle', input.jobTitle);
      fd.append('companyName', input.companyName);
      fd.append('jobDescription', input.jobDescription);
      if (input.hiringManagerName) fd.append('hiringManagerName', input.hiringManagerName);
      if (input.tone)              fd.append('tone', input.tone);

      const res = await axiosInstance.post<CoverLetterResult & { id: string }>(
        '/cover-letter',
        fd,
        { signal },
      );
      return res.data;
    },
    DURATIONS,
  );
}

export async function applyVariation(
  letterId: string,
  action: VariationAction,
  signal?: AbortSignal,
): Promise<{ cover_letter: string; word_count: number }> {
  const res = await axiosInstance.post<{ cover_letter: string; word_count: number }>(
    `/cover-letter/${letterId}/variation`,
    { variation: VARIATION_MAP[action] },
    { signal },
  );
  return res.data;
}

export async function getCoverLetterById(id: string): Promise<CoverLetterResult & { id: string }> {
  const res = await axiosInstance.get<CoverLetterResult & { id: string }>(`/cover-letter/${id}`);
  return res.data;
}