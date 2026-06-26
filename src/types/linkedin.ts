// ─── LinkedIn Analysis Types ──────────────────────────────────────────────────

export interface LinkedInSectionScore {
  section: string;
  score: number;
  status: 'complete' | 'incomplete' | 'missing';
  feedback: string;
}

export interface LinkedInResult {
  overall_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  completeness: number;
  section_scores: LinkedInSectionScore[];
  strengths: string[];
  improvements: string[];
  keyword_optimization: {
    current_keywords: string[];
    suggested_keywords: string[];
    industry_buzzwords: string[];
  };
  headline_suggestions: string[];
  summary_feedback: string;
}

export type LinkedInStage = 'uploading' | 'parsing' | 'scoring' | 'finalizing';
