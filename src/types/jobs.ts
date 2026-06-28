// ─── Job & Application Types ──────────────────────────────────────────────────

import type { Section, MissingKeywords, Improvement, AnalysisResult } from './analysis';

// ─── Job ──────────────────────────────────────────────────────────────────────

export interface Job {
  _id:              string;
  title:            string;
  company?:         string;
  department:       string;
  location:         string;
  type:             'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience:       string;
  description:      string;
  requirements:     string[];
  skills:           string[];
  salary?: {
    min:      number;
    max:      number;
    currency: string;
  };
  status:            'active' | 'closed' | 'draft';
  postedDate:        string;
  closingDate?:      string;
  applicationsCount: number;
  viewsCount:        number;
  createdAt:         string;
  updatedAt:         string;
}

/**
 * Response from jobService.list() — envelope stripped by Axios interceptor.
 */
export interface JobsListResponse {
  jobs:       Job[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

// ─── Admin Application (job-portal flow) ─────────────────────────────────────
// Received applications from candidates who applied to a Job posting.

export interface CandidateInfo {
  name:        string;
  email:       string;
  phone:       string;
  linkedin?:   string;
  portfolio?:  string;
}

export interface ResumeAnalysisSummary {
  fileName:         string;
  fileSize:         number;
  overall_score:    number;
  grade:            string;
  sections:         Section[];
  missing_keywords: MissingKeywords;
  improvements:     Improvement[];
  tone_feedback:    string;
  ats_tips:         string[];
  analyzedAt:       string;
}

export interface AdminApplication {
  _id:           string;
  jobId:         string;
  candidateInfo: CandidateInfo;
  resumeAnalysis: ResumeAnalysisSummary;
  status:        'submitted' | 'screening' | 'shortlisted' | 'rejected' | 'interview' | 'hired';
  stage?:        string;
  submittedAt:   string;
  lastUpdated:   string;
  notes:         string[];
  source?:       string;
}

/**
 * Response from applicationService.list() — envelope stripped by Axios interceptor.
 */
export interface AdminApplicationsListResponse {
  applications: AdminApplication[];
  pagination:   { total: number; page: number; limit: number; pages: number };
}

// ─── User Application (personal tracker) ─────────────────────────────────────
// A user's own tracking of job applications they've submitted externally.

export interface Application {
  _id:          string;
  jobId?:       string;
  company:      string;
  position:     string;
  status:       'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedDate?: string;
  notes?:       string;
  jobUrl?:      string;
  createdAt:    string;
  updatedAt:    string;
}

/**
 * Response from applicationService.list() for user tracker — envelope stripped.
 */
export interface ApplicationsListResponse {
  applications: Application[];
  pagination:   { total: number; page: number; limit: number; pages: number };
}

// ─── Pre-check / Job Application Submit ───────────────────────────────────────

export interface PreCheckResult extends AnalysisResult {
  canSubmit:     boolean;
  requiredScore: number;
  fileName:      string;
  fileSize:      number;
  message:       string;
}

export interface ApplicationSubmitData {
  jobId:         string;
  candidateInfo: CandidateInfo;
  resumeAnalysis: ResumeAnalysisSummary;
  source?:       string;
}

export interface ApplicationSubmitResponse {
  applicationId: string;
  jobTitle:      string;
  submittedAt:   string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface ApplicationAnalytics {
  totalApplications: number;
  averageATSScore:   number;
  passRate:          string;
  statusBreakdown:   Record<string, number>;
  scoreDistribution: Array<{ _id: number; count: number }>;
  recentTrend: {
    thisWeek: number;
    lastWeek: number;
  };
}
