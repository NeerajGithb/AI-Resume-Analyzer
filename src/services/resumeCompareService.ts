import axiosInstance, { ApiError } from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { CompareResult, CompareStage } from '@/types';

export type OnStage = (stage: CompareStage, progress: number) => void;

/**
 * Compares two resumes with fake progress on frontend.
 */
export async function compareResumes(
  resume1: File,
  resume2: File,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CompareResult> {
  
  const progress = new ProgressHelper<CompareStage>(onStage, signal);

  return await progress.run(
    ['uploading', 'parsing', 'comparing'],
    async () => {
      const formData = new FormData();
      formData.append('resume1', resume1);
      formData.append('resume2', resume2);

      try {
        const response = await axiosInstance.post<{ success: boolean; data: CompareResult }>(
          '/compare',
          formData,
          {
            signal,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return response.data.data;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw error;
        }
        throw new ApiError(500, 'Resume comparison failed. Please try again.');
      }
    }
  );
}

