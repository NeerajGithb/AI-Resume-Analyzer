import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as analysisService from '@/services/analysisService';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { queryKeys } from '@/lib/api/queryKeys';
import type { AnalysisResult } from '@/types';

export interface AnalysisInput {
  file:               File;
  yearsOfExperience?: string;
  targetRole?:        string;
}

export type AnalysisResponse = AnalysisResult & { id: string };

export function useAnalyzeMutation() {
  const queryClient         = useQueryClient();
  const { setStageProgress, setFile } = useAnalysisStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<AnalysisResponse, Error, AnalysisInput>({
    mutationFn: async ({ file, yearsOfExperience, targetRole }) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setFile(file);
      setStageProgress('uploading', 0);

      try {
        return await analysisService.run(
          file,
          signal,
          (stage, progress) => setStageProgress(stage, progress),
          yearsOfExperience,
          targetRole,
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      // Cache the latest result and invalidate history list
      queryClient.setQueryData<AnalysisResponse>(queryKeys.analysis.latest(), data);
      queryClient.setQueryData<AnalysisResponse>(queryKeys.analysis.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.history.list(1, 10) });
    },
    onError: () => {
      setStageProgress(null, 0);
    },
  });

  const abort = (onAbort?: () => void) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStageProgress(null, 0);
      mutation.reset();
      onAbort?.();
    }
  };

  return { ...mutation, abort };
}

export function useLatestAnalysisQuery() {
  return useQuery<AnalysisResponse | null>({
    queryKey: queryKeys.analysis.latest(),
    queryFn:  () => null,
    enabled:  false, // Populated only via setQueryData from the mutation
  });
}

export function useAnalysisResultQuery(id?: string) {
  return useQuery<AnalysisResponse>({
    queryKey: queryKeys.analysis.detail(id ?? ''),
    queryFn:  async () => {
      if (!id) throw new Error('Analysis ID is required');
      return await analysisService.getById(id);
    },
    enabled:   !!id,
    staleTime: 60 * 60 * 1000, // 1 hour — analysis reports don't change
  });
}