/**
 * Centralized React Query key registry.
 *
 * All query keys live here. Never write raw string arrays in hooks.
 * This prevents cache key collisions and makes invalidation reliable.
 *
 * Usage:
 *   useQuery({ queryKey: queryKeys.jobs.all() })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() })
 */

export const queryKeys = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  me: () => ['auth', 'me'] as const,

  // ── Analysis ──────────────────────────────────────────────────────────────
  analysis: {
    all:    ()           => ['analysis']              as const,
    detail: (id: string) => ['analysis', 'detail', id] as const,
    latest: ()           => ['analysis', 'latest']    as const,
  },

  // ── History ───────────────────────────────────────────────────────────────
  history: {
    list:   (page: number, limit: number) =>
              ['history', 'list', { page, limit }]    as const,
    detail: (id: string) => ['history', 'detail', id] as const,
  },

  // ── Compare ───────────────────────────────────────────────────────────────
  compare: {
    result: (id: string) => ['compare', id]           as const,
  },

  // ── Cover Letter ──────────────────────────────────────────────────────────
  coverLetter: {
    result: (id: string) => ['cover-letter', id]      as const,
  },

  // ── Job Match ─────────────────────────────────────────────────────────────
  jobMatch: {
    result: (id: string) => ['job-match', id]         as const,
  },

  // ── LinkedIn ──────────────────────────────────────────────────────────────
  linkedin: {
    result: (id: string) => ['linkedin', id]          as const,
  },

  // ── Resume Builder ────────────────────────────────────────────────────────
  resumeBuilder: {
    result: (id: string) => ['resume-builder', id]    as const,
  },

  // ── Jobs ──────────────────────────────────────────────────────────────────
  jobs: {
    all:    (filters?: Record<string, unknown>) =>
              ['jobs', 'list', filters ?? {}]         as const,
    detail: (id: string) => ['jobs', 'detail', id]    as const,
  },

  // ── Applications ──────────────────────────────────────────────────────────
  applications: {
    all:    (filters?: Record<string, unknown>) =>
              ['applications', 'list', filters ?? {}] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  analytics: () => ['analytics'] as const,

  // ── Error Logs ────────────────────────────────────────────────────────────
  errorLogs: (source?: string) => ['error-logs', source ?? 'all'] as const,
} as const;
