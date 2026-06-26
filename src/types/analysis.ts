// ─── Core Analysis Types ────────────────────────────────────────────────────

export interface Section {
  name: string;
  score: number;
  feedback: string;
}

export interface MissingKeywords {
  technical: string[];
  soft_skills: string[];
  industry: string[];
}

export interface FoundKeywords {
  technical: string[];
  soft_skills: string[];
  industry: string[];
}

export interface Improvement {
  section: string;
  original: string;
  rewrite: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ATSCompatibility {
  score: number;
  has_standard_headings: boolean;
  has_tables: boolean;
  has_images_or_icons: boolean;
  has_multi_column_layout: boolean;
  contact_info_complete: boolean;
  parseable: boolean;
  issues: string[];
}

export interface KeywordAnalysis {
  score: number;
  found: FoundKeywords;
  missing: MissingKeywords;
}

export interface ExperienceImpact {
  score: number;
  quantified_bullets_count: number;
  total_bullets_count: number;
  weak_bullets: Array<{
    original: string;
    why_weak: string;
    better_version: string;
  }>;
  feedback: string;
}

export interface ContentQuality {
  score: number;
  uses_action_verbs: boolean;
  has_fluff_phrases: boolean;
  fluff_phrases_found: string[];
  feedback: string;
  improvements: Array<{
    problem: string;
    better_version: string;
  }>;
}

export interface ResumeStructure {
  score: number;
  sections_present: string[];
  sections_missing: string[];
  feedback: string;
}

export interface RoleMatching {
  score: number;
  target_role: string | null;
  inferred_role: string | null;
  match_explanation: string;
}

export interface SkillsAnalysis {
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  devops: string[];
  tools: string[];
  missing_categories: string[];
}

export interface ProjectAnalysis {
  has_projects: boolean;
  notes: string;
  missing_impact: string[];
}

export interface FormattingNotes {
  length_feedback: string;
  consistency_issues: string[];
}

export interface SummaryAnalysis {
  has_summary: boolean;
  is_generic: boolean;
  feedback: string;
  rewrite?: string;
}

export interface GrammarAnalysis {
  issues_count: number;
  examples: string[];
  feedback: string;
}

export interface AnalysisResult {
  id?: string;
  overall_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';

  // Tier 1 - Critical sections
  ats_compatibility: ATSCompatibility;
  keyword_analysis: KeywordAnalysis;
  experience_impact: ExperienceImpact;
  content_quality: ContentQuality;

  // Tier 2 - High value
  resume_structure: ResumeStructure;
  role_matching: RoleMatching;

  // Tier 3 - Additional analysis
  skills_analysis: SkillsAnalysis;
  project_analysis: ProjectAnalysis;
  formatting_notes: FormattingNotes;
  summary_analysis: SummaryAnalysis;
  grammar_analysis: GrammarAnalysis;

  // Actionable feedback
  strengths: string[];
  improvements: Improvement[];
  top_3_actions: [string, string, string];
  red_flags: string[];
  honest_summary: string;

  // Legacy support
  sections?: Section[];
  missing_keywords?: MissingKeywords;
  tone_feedback?: string;
  ats_tips?: string[];
}

export type AnalysisStage =
  | 'uploading'
  | 'parsing'
  | 'scoring'
  | 'keywords'
  | 'suggestions'
  | 'finalizing';
