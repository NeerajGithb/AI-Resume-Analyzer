// ─── Cover Letter Types ───────────────────────────────────────────────────────

export interface CoverLetterResult {
  id: string;
  cover_letter: string;
  word_count: number;
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational';
  fileName: string;
  companyName: string;
  
  // Quality Scores
  overall_score: number;
  ats_compatibility: number;
  professional_tone_score: number;
  personalization_score: number;
  grammar_score: number;
  readability_score: number;
  conciseness_score: number;
  
  // Job Match Coverage
  job_keywords_used: string[];
  job_keywords_missing: string[];
  keywords_coverage_percentage: number;
  
  // Resume Evidence
  resume_claims_used: string[];
  
  // Recruiter Perspective
  recruiter_review: {
    feedback: string;
    overall_impression: 'Strong' | 'Good' | 'Average' | 'Weak';
  };
  
  // Improvements
  improvement_suggestions: Array<{
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    estimated_impact: string;
  }>;
  
  // AI Explanation
  effectiveness_reasons: string[];
  
  // Missing Opportunities
  missing_opportunities: string[];
  
  // Tone Analysis
  tone_analysis: {
    professional: number;
    confidence: number;
    enthusiasm: number;
    personalization: number;
    clarity: number;
  };
  
  // Resume Mapping
  resume_to_cover_letter_mapping: Array<{
    resume_section: string;
    cover_letter_paragraph: number;
  }>;
  
  // Legacy fields
  key_highlights: string[];
  tips: string[];
}

export type CoverLetterStage = 'uploading' | 'parsing' | 'generating' | 'finalizing';
