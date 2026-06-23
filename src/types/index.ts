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

export interface Improvement {
  section: string;
  original: string;
  rewrite: string;
  reason: string;
}

export interface AnalysisResult {
  id?: string; // MongoDB ID returned after saving
  overall_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  sections: Section[];
  missing_keywords: MissingKeywords;
  improvements: Improvement[];
  tone_feedback: string;
  ats_tips: string[];
}

// ─── SSE Types ───────────────────────────────────────────────────────────────

export type AnalysisStage =
  | 'uploading'
  | 'parsing'
  | 'scoring'
  | 'keywords'
  | 'suggestions'
  | 'finalizing';

export type SSEStatus = 'analyzing' | 'complete' | 'error';

export interface SSEAnalyzingEvent {
  status: 'analyzing';
  stage: AnalysisStage;
}

export interface SSECompleteEvent {
  status: 'complete';
  data: AnalysisResult;
}

export interface SSEErrorEvent {
  status: 'error';
  message: string;
}

export type SSEEvent = SSEAnalyzingEvent | SSECompleteEvent | SSEErrorEvent;

// Generic SSE complete event for different result types
export interface SSEGenericCompleteEvent<T> {
  status: 'complete';
  data: T;
}

export type GenericSSEEvent<T> = SSEAnalyzingEvent | SSEGenericCompleteEvent<T> | SSEErrorEvent;

// ─── History Types ────────────────────────────────────────────────────────────

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

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

export type KeywordStatus = 'present' | 'missing' | 'partial';

export interface KeywordChip {
  word: string;
  status: KeywordStatus;
  category: 'technical' | 'soft_skills' | 'industry';
}

// ─── Job Match Types ──────────────────────────────────────────────────────────

export interface JobMatchResult {
  match_score: number;
  match_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  matched_keywords: string[];
  missing_keywords: string[];
  matched_requirements: string[];
  missing_requirements: string[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }[];
  overall_verdict: string;
}

export type JobMatchStage = 'uploading' | 'parsing' | 'matching' | 'finalizing';

export interface SSEJobMatchCompleteEvent {
  status: 'complete';
  data: JobMatchResult;
}

// ─── Resume Compare Types ─────────────────────────────────────────────────────

export interface ComparisonCriteria {
  name: string;
  resume1_score: number;
  resume2_score: number;
  winner: 0 | 1 | 2; // 0 = tie, 1 = resume1, 2 = resume2
  notes: string;
}

export interface CompareResult {
  resume1_score: number;
  resume2_score: number;
  resume1_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  resume2_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  winner: 0 | 1 | 2; // 0 = tie, 1 = resume1, 2 = resume2
  verdict: string;
  criteria: ComparisonCriteria[];
  resume1_strengths: string[];
  resume2_strengths: string[];
  resume1_weaknesses: string[];
  resume2_weaknesses: string[];
  recommendations: string[];
}

export type CompareStage = 'uploading' | 'parsing' | 'comparing' | 'finalizing';

export interface SSECompareCompleteEvent {
  status: 'complete';
  data: CompareResult;
}

// ─── Resume Builder Types ─────────────────────────────────────────────────────

export interface BuilderPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface BuilderExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
}

export interface BuilderEducation {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface BuilderInput {
  personalInfo: BuilderPersonalInfo;
  summary: string;
  experience: BuilderExperience[];
  education: BuilderEducation[];
  skills: string[];
  certifications?: string[];
  targetRole?: string;
}

export interface BuilderResult {
  id?: string;
  resume_markdown: string;
  ats_score: number;
  ats_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  keyword_density: number;
  formatting_tips: string[];
  optimization_notes: string[];
}

// ─── Cover Letter Types ───────────────────────────────────────────────────────

export interface CoverLetterResult {
  cover_letter: string;
  word_count: number;
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational';
  key_highlights: string[];
  personalization_score: number;
  tips: string[];
}

export type CoverLetterStage = 'uploading' | 'parsing' | 'generating' | 'finalizing';

export interface SSECoverLetterCompleteEvent {
  status: 'complete';
  data: CoverLetterResult;
}

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

export interface SSELinkedInCompleteEvent {
  status: 'complete';
  data: LinkedInResult;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}


// ─── Job Application Types ────────────────────────────────────────────────────

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  closingDate?: string;
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ResumeAnalysisSummary {
  fileName: string;
  fileSize: number;
  ats_score: number;
  grade: string;
  overall_score: number;
  sections: Section[];
  missing_keywords: MissingKeywords;
  improvements: Improvement[];
  tone_feedback: string;
  ats_tips: string[];
  analyzedAt: string;
}

export interface PreCheckResult extends AnalysisResult {
  canSubmit: boolean;
  requiredScore: number;
  fileName: string;
  fileSize: number;
  message: string;
}

export interface Application {
  _id: string;
  jobId: string;
  candidateInfo: CandidateInfo;
  resumeAnalysis: ResumeAnalysisSummary;
  status: 'submitted' | 'screening' | 'shortlisted' | 'rejected' | 'interview' | 'hired';
  stage?: string;
  submittedAt: string;
  lastUpdated: string;
  notes: string[];
  source?: string;
}

export interface ApplicationSubmitData {
  jobId: string;
  candidateInfo: CandidateInfo;
  resumeAnalysis: ResumeAnalysisSummary;
  source?: string;
}

export interface ApplicationSubmitResponse {
  success: boolean;
  data: {
    applicationId: string;
    jobTitle: string;
    submittedAt: string;
  };
  message: string;
}

export interface ApplicationsResponse {
  success: boolean;
  data: Application[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApplicationAnalytics {
  totalApplications: number;
  averageATSScore: number;
  passRate: string;
  statusBreakdown: Record<string, number>;
  scoreDistribution: Array<{ _id: number; count: number }>;
  recentTrend: {
    thisWeek: number;
    lastWeek: number;
  };
}
