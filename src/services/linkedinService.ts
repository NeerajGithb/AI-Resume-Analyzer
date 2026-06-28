import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import type { LinkedInResult, LinkedInStage } from '@/types';

export type OnStage = (stage: LinkedInStage, progress: number) => void;

const STAGES: LinkedInStage[] = ['uploading', 'parsing', 'scoring'];
const DURATIONS = [700, 1400, 2200];

/** Path 1 — analyze sections the user pasted */
export async function analyzeLinkedInSections(
  sections: Record<string, string>,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<LinkedInResult> {
  const progress = new ProgressHelper<LinkedInStage>(onStage, signal);
  return progress.run(STAGES, async () => {
    const res = await axiosInstance.post<LinkedInResult>(
      '/linkedin',
      { mode: 'analyze', sections },
      { signal },
    );
    return res.data;
  }, DURATIONS);
}

/** Path 2 — analyze from resume PDF */
export async function analyzeFromResume(
  file: File,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<LinkedInResult> {
  const progress = new ProgressHelper<LinkedInStage>(onStage, signal);
  return progress.run(STAGES, async () => {
    const fd = new FormData();
    fd.append('resume', file);
    const res = await axiosInstance.post<LinkedInResult>('/linkedin', fd, { signal });
    return res.data;
  }, DURATIONS);
}

export interface BuildProfileInput {
  fullName:          string;
  targetRole:        string;
  yearsOfExperience: string;
  skills:            string;
  experience:        string;
  education:         string;
  projects?:         string;
  certifications?:   string;
}

/** Path 3 — generate from scratch */
export async function generateFromScratch(
  input: BuildProfileInput,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<LinkedInResult> {
  const progress = new ProgressHelper<LinkedInStage>(onStage, signal);
  return progress.run(STAGES, async () => {
    const res = await axiosInstance.post<LinkedInResult>('/linkedin', { mode: 'build', ...input }, { signal });
    return res.data;
  }, DURATIONS);
}

export async function getLinkedInById(id: string): Promise<LinkedInResult> {
  const res = await axiosInstance.get<LinkedInResult>(`/linkedin?id=${id}`);
  return res.data;
}