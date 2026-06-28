/**
 * Score-related utilities.
 * Centralizes all score → color / label mappings.
 * Replaces the 6+ duplicate inline implementations across pages.
 */

export function getScoreRingColor(score: number): string {
  if (score >= 85) return '#10b981'; // emerald-500
  if (score >= 70) return '#3b82f6'; // blue-500
  if (score >= 50) return '#f59e0b'; // amber-500
  return '#ef4444';                  // red-500
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent — Ready to apply';
  if (score >= 70) return 'Good — Minor improvements needed';
  if (score >= 50) return 'Fair — Needs work';
  return 'Poor — Major revisions required';
}

/** Returns Tailwind classes for bg + text + border */
export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    B: 'bg-blue-50 text-blue-700 border-blue-200',
    C: 'bg-amber-50 text-amber-700 border-amber-200',
    D: 'bg-orange-50 text-orange-700 border-orange-200',
    F: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[grade] ?? 'bg-gray-50 text-gray-700 border-gray-200';
}

/** Tailwind text color for a score number */
export function getScoreTextColor(score: number): string {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}
