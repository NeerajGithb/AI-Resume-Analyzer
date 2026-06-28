// ─── History Types ────────────────────────────────────────────────────────────

import { Section, MissingKeywords, Improvement } from './analysis';

export interface HistoryItem {
  _id:              string;
  fileName:         string;
  fileSize:         number;
  overall_score:    number;
  grade:            'A' | 'B' | 'C' | 'D' | 'F';
  createdAt:        string;
  sections:         Section[];
  missing_keywords: MissingKeywords;
  improvements:     Improvement[];
  tone_feedback:    string;
  ats_tips:         string[];
}

/**
 * Shape returned by historyService.getAll()
 * Note: the { success, data } envelope is stripped by the Axios interceptor —
 * the service receives this object directly.
 */
export interface HistoryResponse {
  data:       HistoryItem[];
  pagination: {
    total: number;
    page:  number;
    limit: number;
    pages: number;
  };
}
