// ─── Resume Compare Types ─────────────────────────────────────────────────────

export interface ComparisonCriteria {
  name: string;
  resume1_score: number;
  resume2_score: number;
  winner: 0 | 1 | 2;
  notes: string;
}

export interface CompareResult {
  resume1_score: number;
  resume2_score: number;
  resume1_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  resume2_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  winner: 0 | 1 | 2;
  verdict: string;
  criteria: ComparisonCriteria[];
  resume1_strengths: string[];
  resume2_strengths: string[];
  resume1_weaknesses: string[];
  resume2_weaknesses: string[];
  recommendations: string[];
}

export type CompareStage = 'uploading' | 'parsing' | 'comparing' | 'finalizing';
