import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as analysisService from '@/services/analysisService';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { AnalysisResult } from '@/types';

let activeController: AbortController | null = null;

export interface AnalysisInput {
  file: File;
  yearsOfExperience?: string;
  targetRole?: string;
}

export interface LatestAnalysisCache {
  result: AnalysisResult | null;
  error: Error | null;
}

export function useAnalyzeMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress, setFile } = useAnalysisStore();

  const mutation = useMutation<AnalysisResult, Error, AnalysisInput>({
    mutationFn: async ({ file, yearsOfExperience, targetRole }: AnalysisInput) => {
      activeController?.abort();
      activeController = new AbortController();

      setFile(file);
      setStageProgress('uploading', 0);

      try {
        const result = await analysisService.run(
          file,
          activeController.signal,
          (stage, progress) => {
            setStageProgress(stage, progress);
          },
          yearsOfExperience,
          targetRole
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
      setStageProgress(null, 0); // Clear the analyzing state
      queryClient.setQueryData<LatestAnalysisCache>(['latest-analysis'], {
        result: data,
        error: null,
      });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestAnalysisCache>(['latest-analysis'], {
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

export function useLatestAnalysisQuery() {
  return useQuery<LatestAnalysisCache>({
    queryKey: ['latest-analysis'],
    queryFn: () => ({ result: null, error: null }), // Dummy function (never called due to enabled: false)
    enabled: false, // read-only cache accessor
  });
}

