import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import * as jobMatchService from '@/services/jobMatchService';
import { useJobMatchStore } from '@/store/jobMatchUIStore';
import { JobMatchResult } from '@/types';

export interface JobMatchInput {
  resume: File;
  jobDescription: string;
}

export type JobMatchResponse = JobMatchResult & { id: string };

export interface LatestJobMatchCache {
  result: JobMatchResponse | null;
  error: Error | null;
}

export function useJobMatchMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress, setResume, setJobDescription } = useJobMatchStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<JobMatchResponse, Error, JobMatchInput>({
    mutationFn: async ({ resume, jobDescription }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setResume(resume);
      setJobDescription(jobDescription);
      setStageProgress('uploading', 0);

      try {
        return await jobMatchService.matchResumeToJob(
          resume,
          jobDescription,
          signal,
          (stage, progress) => setStageProgress(stage, progress)
        );
      } finally {
        abortControllerRef.current = null;
      }
    },
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestJobMatchCache>(['latest-job-match'], {
        result: data,
        error: null,
      });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestJobMatchCache>(['latest-job-match'], {
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

export function useLatestJobMatchQuery() {
  return useQuery<LatestJobMatchCache>({
    queryKey: ['latest-job-match'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useJobMatchResultQuery(id?: string) {
  return useQuery<JobMatchResponse>({
    queryKey: ['job-match-result', id],
    queryFn: async () => {
      if (!id) throw new Error('Job match ID is required');
      return await jobMatchService.getJobMatchById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

