import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as analysisService from '@/services/analysisService';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { AnalysisResult } from '@/types';

export interface AnalysisInput {
  file: File;
  yearsOfExperience?: string;
  targetRole?: string;
}

export type AnalysisResponse = AnalysisResult & { id: string };

export interface LatestAnalysisCache {
  result: AnalysisResponse | null;
  error: Error | null;
}

export function useAnalyzeMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress, setFile } = useAnalysisStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<AnalysisResponse, Error, AnalysisInput>({
    mutationFn: async ({ file, yearsOfExperience, targetRole }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
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
          targetRole
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestAnalysisCache>(['latest-analysis'], { 
        result: data, 
        error: null 
      });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestAnalysisCache>(['latest-analysis'], { 
        result: null, 
        error: err 
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

export function useLatestAnalysisQuery() {
  return useQuery<LatestAnalysisCache>({
    queryKey: ['latest-analysis'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useAnalysisResultQuery(id?: string) {
  return useQuery<AnalysisResponse>({
    queryKey: ['analysis-result', id],
    queryFn: async () => {
      if (!id) throw new Error('Analysis ID is required');
      return await analysisService.getById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}