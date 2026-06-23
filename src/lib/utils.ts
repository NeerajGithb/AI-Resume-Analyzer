import { type ClassValue, clsx } from 'clsx';
import { SCORE_THRESHOLDS } from './constants';

// ─── Class merging ────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// ─── File utilities ───────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Score utilities ──────────────────────────────────────────────────────────
export function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.good) return 'text-emerald-600';
  if (score >= SCORE_THRESHOLDS.fair) return 'text-amber-600';
  return 'text-red-600';
}

export function getScoreRingColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.good) return '#059669'; // emerald-600
  if (score >= SCORE_THRESHOLDS.fair) return '#d97706'; // amber-600
  return '#dc2626'; // red-600
}

export function getScoreBgColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.good) return 'bg-emerald-50 border-emerald-200';
  if (score >= SCORE_THRESHOLDS.fair) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Very Poor';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'B': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'C': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'D': return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'F': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-gray-700 bg-gray-50 border-gray-200';
  }
}

// ─── Date utilities ───────────────────────────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

// ─── Stage utilities ──────────────────────────────────────────────────────────
export function getStageProgress(
  stage: string,
  stages: string[]
): number {
  const idx = stages.indexOf(stage);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / stages.length) * 100);
}

