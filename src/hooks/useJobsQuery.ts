import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import * as jobsApi from '@/services/jobService';
import type { JobFilters } from '@/services/jobService';
import type { Job, JobsListResponse } from '@/types';

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useJobsQuery(filters?: JobFilters) {
  return useQuery<JobsListResponse>({
    queryKey: queryKeys.jobs.all(filters as Record<string, unknown>),
    queryFn:  () => jobsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useJobDetailQuery(id: string) {
  return useQuery<Job>({
    queryKey: queryKeys.jobs.detail(id),
    queryFn:  () => jobsApi.getById(id),
    enabled:  !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateJobMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Job>) => jobsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.jobs.all() }),
  });
}

export function useUpdateJobMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      jobsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.all() });
      qc.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
    },
  });
}

export function useDeleteJobMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.jobs.all() }),
  });
}
