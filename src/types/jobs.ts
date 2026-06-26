// ─── Job Application Types ────────────────────────────────────────────────────

import { Section, MissingKeywords, Improvement, AnalysisResult } from './analysis';

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
  overall_score: number;
  grade: string;
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
