import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as svc from '@/services/linkedinService';
import { useLinkedInStore } from '@/store/linkedinUIStore';
import { LinkedInResult } from '@/types';

export interface LatestLinkedInCache {
  result: LinkedInResult | null;
  error: Error | null;
}

type MutationInput =
  | { mode: 'analyze'; sections: Record<string, string> }
  | { mode: 'resume';  file: File }
  | { mode: 'build';   data: svc.BuildProfileInput };

export function useLinkedInMutation() {
  const queryClient = useQueryClient();
  const store       = useLinkedInStore();
  const abortRef    = useRef<AbortController | null>(null);

  const mutation = useMutation<LinkedInResult, Error, MutationInput>({
    mutationFn: async (input) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      store.setStageProgress('uploading', 0);
      const signal = abortRef.current.signal;

      if (input.mode === 'analyze') {
        return svc.analyzeLinkedInSections(input.sections, signal, store.setStageProgress);
      }
      if (input.mode === 'resume') {
        return svc.analyzeFromResume(input.file, signal, store.setStageProgress);
      }
      return svc.generateFromScratch(input.data, signal, store.setStageProgress);
    },
    onSuccess: (data) => {
      store.setStageProgress(null, 0);
      queryClient.setQueryData<LatestLinkedInCache>(['latest-linkedin'], { result: data, error: null });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      store.setStageProgress(null, 0);
      queryClient.setQueryData<LatestLinkedInCache>(['latest-linkedin'], { result: null, error: err });
    },
    onSettled: () => { abortRef.current = null; },
  });

  const abort = (onAbort?: () => void) => {
    abortRef.current?.abort();
    abortRef.current = null;
    store.setStageProgress(null, 0);
    mutation.reset();
    onAbort?.();
  };

  return { ...mutation, abort };
}

export function useLatestLinkedInQuery() {
  return useQuery<LatestLinkedInCache>({
    queryKey: ['latest-linkedin'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useLinkedInResultQuery(id?: string) {
  return useQuery<LinkedInResult>({
    queryKey: ['linkedin-result', id],
    queryFn: () => svc.getLinkedInById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}