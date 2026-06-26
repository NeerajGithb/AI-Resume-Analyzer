import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as builderService from '@/services/resumeBuilderV2Service';
import type { BuilderV2Result } from '@/services/resumeBuilderV2Service';
import type { ResumeBuilderFormData } from '@/types/resumeBuilder';

export type { BuilderV2Result };

export interface LatestBuilderCache {
  result: BuilderV2Result | null;
  error: Error | null;
}

export function useResumeBuilderV2Mutation(
  onStageProgress: (stage: string, progress: number) => void,
) {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: ResumeBuilderFormData) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      onStageProgress('uploading', 0);

      try {
        return await builderService.generateResumeV2(formData, signal, (stage, progress) =>
          onStageProgress(stage, progress),
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      onStageProgress('', 0);
      queryClient.setQueryData<LatestBuilderCache>(['latest-builder-v2'], {
        result: data,
        error: null,
      });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      onStageProgress('', 0);
      queryClient.setQueryData<LatestBuilderCache>(['latest-builder-v2'], {
        result: null,
        error: err as Error,
      });
    },
  });

  const abort = (onAbort?: () => void) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      onStageProgress('', 0);
      mutation.reset();
      onAbort?.();
    }
  };

  return { ...mutation, abort };
}

export function useLatestBuilderV2Query() {
  return useQuery<LatestBuilderCache>({
    queryKey: ['latest-builder-v2'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useBuilderV2ResultQuery(id?: string) {
  return useQuery({
    queryKey: ['builder-v2-result', id],
    queryFn: async () => {
      if (!id) throw new Error('ID required');
      return await builderService.getResumeByIdV2(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}
