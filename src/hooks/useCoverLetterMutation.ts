import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as coverLetterService from '@/services/coverLetterService';
import { useCoverLetterStore } from '@/store/coverLetterUIStore';
import { CoverLetterResult } from '@/types';

let activeController: AbortController | null = null;

interface CoverLetterInput {
  resume: File;
  jobDescription: string;
  companyName: string;
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational';
}

export interface LatestCoverLetterCache {
  result: CoverLetterResult | null;
  error: Error | null;
}

export function useCoverLetterMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress, setResume, setJobDescription, setCompanyName, setTone } = useCoverLetterStore();

  const mutation = useMutation<CoverLetterResult, Error, CoverLetterInput>({
    mutationFn: async ({ resume, jobDescription, companyName, tone }) => {
      activeController?.abort();
      activeController = new AbortController();

      setResume(resume);
      setJobDescription(jobDescription);
      setCompanyName(companyName);
      setTone(tone);
      setStageProgress('uploading', 0);

      try {
        const result = await coverLetterService.generateCoverLetter(
          resume,
          jobDescription,
          companyName,
          tone,
          activeController.signal,
          (stage, progress) => {
            setStageProgress(stage, progress);
          }
        );
        return result;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStageProgress(null, 0);
        }
        throw err;
      } finally {
        activeController = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestCoverLetterCache>(['latest-cover-letter'], {
        result: data,
        error: null,
      });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestCoverLetterCache>(['latest-cover-letter'], {
        result: null,
        error: err,
      });
    },
  });

  const abort = (onAbort?: () => void) => {
    if (activeController) {
      activeController.abort();
      activeController = null;
      setStageProgress(null, 0);
      mutation.reset();
      onAbort?.();
    }
  };

  return {
    ...mutation,
    abort,
  };
}

/**
 * Query hook to get the latest cover letter from cache.
 * Used by report page to access mutation result.
 */
export function useLatestCoverLetterQuery() {
  return useQuery<LatestCoverLetterCache>({
    queryKey: ['latest-cover-letter'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

/**
 * Fetches a saved cover letter by ID from the backend.
 * Returns undefined when id is undefined (used during the temporary processing phase).
 */
export function useCoverLetterResultQuery(id: string | undefined) {
  return useQuery<CoverLetterResult, Error>({
    queryKey: ['cover-letter', id],
    queryFn: () => coverLetterService.getCoverLetterById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
