export type LinkedInMode  = 'analyze' | 'resume' | 'build';
export type LinkedInStage = 'uploading' | 'parsing' | 'scoring';

export interface LinkedInImprovement {
  priority: 'high' | 'medium' | 'low';
  section:  string;
  recommendation: string;
}

// analyze mode only
export interface LinkedInSectionRewrite {
  section:   string;
  score:     number;
  status:    'strong' | 'needs_work' | 'weak';
  feedback:  string;
  rewritten: string;
  original?: string;
}

export interface LinkedInResult {
  id:   string;
  mode: LinkedInMode;

  // Always present
  keywords_found:   string[];
  keywords_missing: string[];
  strengths:        string[];
  improvements:     LinkedInImprovement[];
  summary_feedback: string;

  // analyze only — AI judging content the user wrote
  section_rewrites?:     LinkedInSectionRewrite[];

  // resume + build only — generated content ready to copy
  generated_headline?:   string;
  generated_about?:      string;
  generated_experience?: string;
  generated_skills?:     string;
  headline_reasoning?:   string;

  createdAt: string;
}