import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as compareService from '@/services/compareService';
import { useCompareStore } from '@/store/compareUIStore';
import { CompareResult } from '@/types';

export interface CompareInput {
  resume1: File;
  resume2: File;
}

export type CompareResponse = CompareResult & { id: string };

export interface LatestCompareCache {
  result: CompareResponse | null;
  error: Error | null;
}

export function useCompareMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress, setResumes } = useCompareStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<CompareResponse, Error, CompareInput>({
    mutationFn: async ({ resume1, resume2 }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setResumes(resume1, resume2);
      setStageProgress('uploading', 0);

      try {
        return await compareService.run(
          resume1,
          resume2,
          signal,
          (stage, progress) => setStageProgress(stage, progress),
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestCompareCache>(['latest-compare'], {
        result: data,
        error: null,
      });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestCompareCache>(['latest-compare'], {
        result: null,
        error: err,
      });
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

export function useLatestCompareQuery() {
  return useQuery<LatestCompareCache>({
    queryKey: ['latest-compare'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useCompareResultQuery(id?: string) {
  return useQuery<CompareResponse>({
    queryKey: ['compare-result', id],
    queryFn: async () => {
      if (!id) throw new Error('Comparison ID is required');
      return await compareService.getById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
