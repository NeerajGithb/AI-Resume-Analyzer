// ─── SSE (Server-Sent Events) Types ───────────────────────────────────────────

import { AnalysisResult, AnalysisStage } from './analysis';
import { JobMatchResult } from './jobMatch';
import { CompareResult } from './compare';
import { CoverLetterResult } from './coverLetter';
import { LinkedInResult } from './linkedin';

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

export interface SSEGenericCompleteEvent<T> {
  status: 'complete';
  data: T;
}

export type GenericSSEEvent<T> = SSEAnalyzingEvent | SSEGenericCompleteEvent<T> | SSEErrorEvent;

export interface SSEJobMatchCompleteEvent {
  status: 'complete';
  data: JobMatchResult;
}

export interface SSECompareCompleteEvent {
  status: 'complete';
  data: CompareResult;
}

export interface SSECoverLetterCompleteEvent {
  status: 'complete';
  data: CoverLetterResult;
}

export interface SSELinkedInCompleteEvent {
  status: 'complete';
  data: LinkedInResult;
}
