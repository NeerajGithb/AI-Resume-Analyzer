import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score:     number;
  grade?:    string;
  size?:     'sm' | 'md' | 'lg';
  showGrade?: boolean;
  className?: string;
}

function getScoreColors(score: number) {
  if (score >= 85) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-400' };
  if (score >= 70) return { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    ring: 'ring-blue-400'    };
  if (score >= 50) return { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   ring: 'ring-amber-400'   };
  return             { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     ring: 'ring-red-400'     };
}

function getGradeColors(grade: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    A: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    B: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
    C: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
    D: { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200'  },
    F: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200'     },
  };
  return map[grade] ?? { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
}

const sizeMap = {
  sm: { badge: 'text-xs px-2 py-0.5 rounded',    score: 'text-sm font-bold', grade: 'text-xs' },
  md: { badge: 'text-sm px-2.5 py-1 rounded-lg', score: 'text-base font-bold', grade: 'text-sm' },
  lg: { badge: 'text-base px-3 py-1.5 rounded-xl', score: 'text-lg font-bold', grade: 'text-base' },
};

/**
 * Reusable score+grade badge.
 * Replaces 6+ inline score color implementations scattered across pages.
 */
export function ScoreBadge({ score, grade, size = 'md', showGrade = true, className }: ScoreBadgeProps) {
  const colors = getScoreColors(score);
  const sz     = sizeMap[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium',
        colors.bg, colors.text, colors.border,
        sz.badge,
        className,
      )}
    >
      <span className={sz.score}>{score}</span>
      {showGrade && grade && (
        <>
          <span className="opacity-40">/</span>
          <span className={cn(sz.grade, getGradeColors(grade).text)}>Grade {grade}</span>
        </>
      )}
    </span>
  );
}

/** Standalone grade-only badge */
export function GradeBadge({ grade, className }: { grade: string; className?: string }) {
  const colors = getGradeColors(grade);
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border',
      colors.bg, colors.text, colors.border,
      className,
    )}>
      Grade {grade}
    </span>
  );
}
