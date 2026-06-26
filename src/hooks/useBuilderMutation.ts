import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as builderService from '@/services/resumeBuilderService';
import { useBuilderStore } from '@/store/builderUIStore';
import { BuilderInput, BuilderResult } from '@/types';

export function useBuilderMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress } = useBuilderStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async (input: BuilderInput) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setStageProgress('uploading', 0);

      try {
        return await builderService.generateResume(
          input,
          signal,
          (stage, progress) => setStageProgress(stage, progress)
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData(['latest-builder'], { result: data, error: null });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData(['latest-builder'], { result: null, error: err });
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

export interface LatestBuilderCache {
  result: BuilderResult | null;
  error: Error | null;
}

/**
 * Query hook to get the latest builder result from cache.
 * Used by report page to access mutation result.
 */
export function useLatestBuilderQuery() {
  return useQuery<LatestBuilderCache>({
    queryKey: ['latest-builder'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useBuilderResultQuery(id?: string) {
  return useQuery({
    queryKey: ['builder-result', id],
    queryFn: async () => {
      if (!id) throw new Error('ID required');
      return await builderService.getResumeById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}

