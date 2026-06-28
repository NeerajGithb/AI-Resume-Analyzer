import axiosInstance from '@/lib/api/baseService';
import type { HistoryItem, HistoryResponse } from '@/types';

export async function getAll(page = 1, limit = 10): Promise<HistoryResponse> {
  const response = await axiosInstance.get<HistoryResponse>('/history', {
    params: { page, limit },
  });
  return response.data;
}

export async function getById(id: string): Promise<HistoryItem> {
  const response = await axiosInstance.get<HistoryItem>(`/history/${id}`);
  return response.data;
}
