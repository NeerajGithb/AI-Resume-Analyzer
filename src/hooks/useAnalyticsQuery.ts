import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import * as analyticsApi from '@/services/analyticsService';

/**
 * Fetches combined analytics summary (applications + analyses).
 * Used by the dashboard and settings pages.
 */
export function useAnalyticsQuery() {
  return useQuery({
    queryKey: queryKeys.analytics(),
    queryFn:  analyticsApi.getSummary,
    staleTime: 5 * 60 * 1000, // 5 min — analytics don't need to be real-time
  });
}
