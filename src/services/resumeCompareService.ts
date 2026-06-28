import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import type { CompareResult, CompareStage } from '@/types';

export type OnStage = (stage: CompareStage, progress: number) => void;

const STAGES: CompareStage[] = ['uploading', 'parsing', 'comparing'];

/**
 * Compares two resumes with progress animation on the frontend.
 */
export async function compareResumes(
  resume1: File,
  resume2: File,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CompareResult> {
  const progress = new ProgressHelper<CompareStage>(onStage, signal);

  return progress.run(STAGES, async () => {
    const fd = new FormData();
    fd.append('resume1', resume1);
    fd.append('resume2', resume2);

    const res = await axiosInstance.post<CompareResult>('/compare', fd, { signal });
    return res.data;
  });
}

/**
 * Retrieves a saved comparison result by ID.
 */
export async function getComparisonById(id: string): Promise<CompareResult> {
  const res = await axiosInstance.get<CompareResult>(`/compare/${id}`);
  return res.data;
}
