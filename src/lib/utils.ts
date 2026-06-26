import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'B':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'C':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'D':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'F':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function getScoreRingColor(score: number): string {
  if (score >= 85) return '#10b981'; // emerald-500
  if (score >= 70) return '#3b82f6'; // blue-500
  if (score >= 50) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent — Ready to apply';
  if (score >= 70) return 'Good — Minor improvements needed';
  if (score >= 50) return 'Fair — Needs work';
  return 'Poor — Major revisions required';
}
