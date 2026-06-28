import axiosInstance from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import type { CompareResult, CompareStage } from '@/types';

export type OnStage = (stage: CompareStage, progress: number) => void;

const STAGES: CompareStage[]  = ['uploading', 'parsing', 'comparing', 'finalizing'];
const DURATIONS               = [900, 1400, 1800, 600];

export async function run(
  resume1: File,
  resume2: File,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CompareResult & { id: string }> {
  const progress = new ProgressHelper<CompareStage>(onStage, signal);

  return progress.run(
    STAGES,
    async () => {
      const fd = new FormData();
      fd.append('resume1', resume1);
      fd.append('resume2', resume2);

      const res = await axiosInstance.post<CompareResult & { id: string }>('/compare', fd, { signal });
      return res.data;
    },
    DURATIONS,
  );
}

export async function getById(id: string): Promise<CompareResult & { id: string }> {
  const res = await axiosInstance.get<CompareResult & { id: string }>(`/compare/${id}`);
  return res.data;
}
