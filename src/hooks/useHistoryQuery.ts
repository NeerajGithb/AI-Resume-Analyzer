import { useQuery } from '@tanstack/react-query';
import * as historyService from '@/services/historyService';

export function useHistoryListQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['history', 'list', page, limit],
    queryFn: () => historyService.getAll(page, limit),
    placeholderData: (previousData) => previousData, // smooth pagination transitions
  });
}

export function useHistoryDetailQuery(id: string | null) {
  return useQuery({
    queryKey: ['history', 'detail', id],
    queryFn: () => historyService.getById(id!),
    enabled: !!id,
  });
}

