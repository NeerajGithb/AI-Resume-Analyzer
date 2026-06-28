import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import * as applicationsApi from '@/services/applicationService';
import type {
  ApplicationFilters,
  CreateApplicationPayload,
  UpdateApplicationPayload,
  ApplicationsResponse,
} from '@/services/applicationService';
import type { Application, AdminApplicationsListResponse } from '@/types';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * User's own application tracker — returns ApplicationsResponse (Application[]).
 * Use useAdminApplicationsQuery for the admin job-portal view.
 */
export function useApplicationsQuery(filters?: ApplicationFilters) {
  return useQuery<ApplicationsResponse>({
    queryKey: queryKeys.applications.all(filters as Record<string, unknown>),
    queryFn:  () => applicationsApi.list(filters),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Admin: list all candidate applications enriched with candidateInfo + resumeAnalysis.
 * Calls /admin/applications — separate endpoint from the user tracker.
 */
export function useAdminApplicationsQuery(filters?: ApplicationFilters) {
  return useQuery<AdminApplicationsListResponse>({
    queryKey: queryKeys.applications.all({ ...filters, _admin: true }),
    queryFn:  () => applicationsApi.adminList(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useApplicationDetailQuery(id: string) {
  return useQuery<Application>({
    queryKey: queryKeys.applications.detail(id),
    queryFn:  () => applicationsApi.getById(id),
    enabled:  !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateApplicationPayload) => applicationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.applications.all() }),
  });
}

export function useUpdateApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationPayload }) =>
      applicationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.all() });
      qc.invalidateQueries({ queryKey: queryKeys.applications.detail(id) });
    },
  });
}

export function useDeleteApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.applications.all() }),
  });
}
