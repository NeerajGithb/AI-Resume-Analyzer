import { AnalysisStage } from '@/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_FILE_TYPES = ['application/pdf'];

export const STAGE_LABELS: Record<string, string> = {
  uploading: 'Uploading resume…',
  parsing: 'Parsing document…',
  scoring: 'Calculating ATS score…',
  keywords: 'Analyzing keywords…',
  suggestions: 'Generating improvements…',
  finalizing: 'Finalizing report…',
  matching: 'Matching with job…',
  comparing: 'Comparing resumes…',
  generating: 'Writing cover letter…',
};

export const STAGE_ORDER: AnalysisStage[] = [
  'uploading',
  'parsing',
  'scoring',
  'keywords',
  'suggestions',
  'finalizing',
];

// Stage orders for different features
export const JOB_MATCH_STAGES = ['uploading', 'parsing', 'matching', 'finalizing'];
export const COMPARE_STAGES = ['uploading', 'parsing', 'comparing', 'finalizing'];
export const COVER_LETTER_STAGES = ['uploading', 'parsing', 'generating', 'finalizing'];
export const LINKEDIN_STAGES = ['uploading', 'parsing', 'scoring', 'finalizing'];

export const SECTION_NAMES = [
  'Contact Info',
  'Professional Summary',
  'Work Experience',
  'Skills',
  'Education',
  'Projects',
] as const;

export const SCORE_THRESHOLDS = {
  good: 75,
  fair: 50,
} as const;

export type { AnalysisStage };

