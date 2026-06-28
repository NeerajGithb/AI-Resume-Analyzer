import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as coverLetterService from '@/services/coverLetterService';
import { useCoverLetterStore } from '@/store/coverLetterUIStore';
import { CoverLetterResult } from '@/types';

export type CoverLetterResponse = CoverLetterResult & { id: string };

export interface LatestCoverLetterCache {
  result: CoverLetterResponse | null;
  error: Error | null;
}

// ── Generate ──────────────────────────────────────────────────────────────────
export function useCoverLetterMutation() {
  const queryClient = useQueryClient();
  const store = useCoverLetterStore();
  const abortRef = useRef<AbortController | null>(null);

  const mutation = useMutation<CoverLetterResponse, Error, coverLetterService.GenerateInput>({
    mutationFn: async (input) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      // Sync form values into store so dashboard can read them
      store.setResume(input.resume);
      store.setJobTitle(input.jobTitle);
      store.setCompanyName(input.companyName);
      store.setJobDescription(input.jobDescription);
      store.setHiringManagerName(input.hiringManagerName ?? '');
      if (input.tone) store.setTone(input.tone);
      store.setStageProgress('uploading', 0);

      return coverLetterService.generateCoverLetter(
        input,
        abortRef.current.signal,
        store.setStageProgress,
      );
    },
    onSuccess: (data) => {
      store.setStageProgress(null, 0);
      queryClient.setQueryData<LatestCoverLetterCache>(['latest-cover-letter'], { result: data, error: null });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      store.setStageProgress(null, 0);
      queryClient.setQueryData<LatestCoverLetterCache>(['latest-cover-letter'], { result: null, error: err });
    },
  });

  const abort = (onAbort?: () => void) => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      store.setStageProgress(null, 0);
      mutation.reset();
      onAbort?.();
    }
  };

  return { ...mutation, abort };
}

// ── Variation (Shorten / More Professional / etc.) ────────────────────────────
export function useCoverLetterVariation(letterId: string | undefined) {
  const abortRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    { cover_letter: string; word_count: number },
    Error,
    coverLetterService.VariationAction
  >({
    mutationFn: async (action) => {
      if (!letterId) throw new Error('No letter ID');
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      return coverLetterService.applyVariation(letterId, action, abortRef.current.signal);
    },
  });

  const abort = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    mutation.reset();
  };

  return { ...mutation, abort };
}

// ── Queries ───────────────────────────────────────────────────────────────────
export function useLatestCoverLetterQuery() {
  return useQuery<LatestCoverLetterCache>({
    queryKey: ['latest-cover-letter'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useCoverLetterResultQuery(id?: string) {
  return useQuery<CoverLetterResponse>({
    queryKey: ['cover-letter-result', id],
    queryFn: () => coverLetterService.getCoverLetterById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}