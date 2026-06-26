import axiosInstance, { ApiError } from '@/lib/api/baseService';
import { ProgressHelper } from '@/lib/api/progressHelper';
import { LinkedInResult, LinkedInStage } from '@/types';

export type OnStage = (stage: LinkedInStage, progress: number) => void;

/**
 * Analyzes LinkedIn profile text with fake progress on frontend.
 */
export async function analyzeLinkedInProfile(
  profileText: string,
  signal: AbortSignal,
  onStage: OnStage,
): Promise<LinkedInResult> {
  
  const progress = new ProgressHelper<LinkedInStage>(onStage, signal);

  return await progress.run(
    ['uploading', 'parsing', 'scoring'],
    async () => {
      try {
        const response = await axiosInstance.post<{ success: boolean; data: LinkedInResult }>(
          '/linkedin/analyze',
          { profileText },
          { signal }
        );

        return response.data.data;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw error;
        }
        throw new ApiError(500, 'LinkedIn analysis failed. Please try again.');
      }
    }
  );
}

