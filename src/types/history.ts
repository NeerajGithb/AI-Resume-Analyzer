// ─── History Types ────────────────────────────────────────────────────────────

import { Section, MissingKeywords, Improvement } from './analysis';

export interface HistoryItem {
  _id: string;
  fileName: string;
  fileSize: number;
  overall_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  createdAt: string;
  sections: Section[];
  missing_keywords: MissingKeywords;
  improvements: Improvement[];
  tone_feedback: string;
  ats_tips: string[];
}

export interface HistoryResponse {
  success: boolean;
  data: HistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
