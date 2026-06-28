import { useQuery } from '@tanstack/react-query';
import * as historyService from '@/services/historyService';
import { queryKeys } from '@/lib/api/queryKeys';

export function useHistoryListQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey:        queryKeys.history.list(page, limit),
    queryFn:         () => historyService.getAll(page, limit),
    placeholderData: (prev) => prev, // Smooth pagination transitions
    staleTime:       2 * 60 * 1000, // 2 min
  });
}

export function useHistoryDetailQuery(id: string | null) {
  return useQuery({
    queryKey:  queryKeys.history.detail(id ?? ''),
    queryFn:   () => historyService.getById(id!),
    enabled:   !!id,
    staleTime: 60 * 60 * 1000, // 1 hour — reports don't change
  });
}
