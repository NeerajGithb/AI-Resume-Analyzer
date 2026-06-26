import axiosInstance from '@/lib/api/baseService';
import { HistoryItem, HistoryResponse } from '@/types';

export async function getAll(page = 1, limit = 10): Promise<HistoryResponse> {
  const response = await axiosInstance.get<HistoryResponse>('/history', {
    params: { page, limit }
  });
  return response.data;
}

export async function getById(id: string): Promise<HistoryItem> {
  const response = await axiosInstance.get<{ success: boolean; data: HistoryItem }>(`/history/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error('Analysis not found or could not be loaded');
  }
  return response.data.data;
}

