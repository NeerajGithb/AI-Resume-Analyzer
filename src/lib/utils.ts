/**
 * Main utils barrel.
 *
 * Import from specific sub-modules when possible:
 *   import { formatDate }      from '@/lib/utils/format'
 *   import { getScoreLabel }   from '@/lib/utils/score'
 *   import { cn }              from '@/lib/utils'        ← always from here
 *
 * This file also re-exports everything for backward-compat.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge }               from 'tailwind-merge';

// ── cn ────────────────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Re-exports (so existing imports keep working) ─────────────────────────────
export { formatDate, formatFileSize, formatNumber, formatPercent } from './utils/format';
export { getGradeColor, getScoreLabel, getScoreRingColor, getScoreTextColor } from './utils/score';
