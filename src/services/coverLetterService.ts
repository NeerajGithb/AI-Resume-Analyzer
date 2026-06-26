import axiosInstance, { ApiError } from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { CoverLetterResult, CoverLetterStage } from '@/types';

export type OnStage = (stage: CoverLetterStage, progress: number) => void;

/**
 * Generates cover letter with fake progress on frontend.
 */
export async function generateCoverLetter(
  resume: File,
  jobDescription: string,
  companyName: string,
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational',
  signal: AbortSignal,
  onStage: OnStage,
): Promise<CoverLetterResult> {
  
  const progress = new ProgressHelper<CoverLetterStage>(onStage, signal);

  return await progress.run(
    ['uploading', 'parsing', 'generating'],
    async () => {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('jobDescription', jobDescription);
      formData.append('companyName', companyName);
      formData.append('tone', tone);

      try {
        const response = await axiosInstance.post<{ success: boolean; data: CoverLetterResult }>(
          '/cover-letter',
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
        throw new ApiError(500, 'Cover letter generation failed. Please try again.');
      }
    }
  );
}

/**
 * Fetches a previously generated cover letter by ID.
 */
export async function getCoverLetterById(id: string): Promise<CoverLetterResult> {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: CoverLetterResult }>(
      `/cover-letter/${id}`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to load cover letter. Please try again.');
  }
}
