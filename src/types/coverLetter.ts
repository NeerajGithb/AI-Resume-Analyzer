export interface CoverLetterResult {
  id: string;
  fileName: string;
  fileSize: number;
  jobTitle: string;
  companyName: string;
  hiringManagerName: string;
  tone: 'professional' | 'formal' | 'friendly';
  cover_letter: string;
  word_count: number;
  overall_score: number;
  ats_compatibility: number;
  job_keywords_used: string[];
  job_keywords_missing: string[];
  improvement_suggestions: Array<{
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type CoverLetterStage = 'uploading' | 'parsing' | 'generating' | 'finalizing';
