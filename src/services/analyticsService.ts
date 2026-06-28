import axiosInstance from '@/lib/api/baseService';
import type { ApplicationAnalytics } from '@/types';

export interface AnalyticsSummary {
  applications: {
    total:    number;
    byStatus: Record<string, number>;
  };
  analyses: {
    total:        number;
    averageScore: number;
    recent:       Array<{ _id: string; fileName: string; overall_score: number; grade: string; createdAt: string }>;
  };
}

export async function getSummary(): Promise<AnalyticsSummary> {
  const res = await axiosInstance.get<AnalyticsSummary>('/analytics');
  return res.data;
}

export async function getApplicationAnalytics(): Promise<ApplicationAnalytics> {
  const res = await axiosInstance.get<ApplicationAnalytics>('/analytics');
  return res.data;
}
