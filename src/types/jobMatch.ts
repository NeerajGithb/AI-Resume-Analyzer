// ─── Job Match Types ──────────────────────────────────────────────────────────

export interface JobMatchResult {
  match_score: number;
  match_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  matched_keywords: string[];
  missing_keywords: string[];
  matched_requirements: string[];
  missing_requirements: string[];
  experience_gap: string | null;
  overall_verdict: string;
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }[];
  strengths?: string[];
  weaknesses?: string[];
  hiring_perspective?: string;
}

export type JobMatchStage = 'uploading' | 'parsing' | 'matching' | 'finalizing';
