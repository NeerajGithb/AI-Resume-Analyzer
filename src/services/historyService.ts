import { http } from '@/lib/httpClient';
import { HistoryItem, HistoryResponse } from '@/types';

export async function getAll(page = 1, limit = 10): Promise<HistoryResponse> {
  return http.get<HistoryResponse>('/history', { params: { page, limit } });
}

export async function getById(id: string): Promise<HistoryItem> {
  const res = await http.get<{ success: boolean; data: HistoryItem }>(`/history/${id}`);
  if (!res.success || !res.data) {
    throw new Error('Analysis not found or could not be loaded');
  }
  return res.data;
}

