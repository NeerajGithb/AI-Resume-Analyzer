'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  colorByScore?: boolean;
  size?: 'sm' | 'md';
  animated?: boolean;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  colorByScore = false,
  size = 'md',
  animated = true,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColor = colorByScore
    ? value >= 75
      ? 'bg-emerald-500'
      : value >= 50
        ? 'bg-amber-500'
        : 'bg-red-500'
    : 'bg-[var(--accent)]';

  const trackSize = size === 'sm' ? 'h-1' : 'h-1.5';

  return (
    <div className={cn('w-full', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs text-[var(--text-secondary)] font-medium">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-semibold text-[var(--text-primary)]">{value}</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', trackSize)}>
        <div
          className={cn(
            'h-full rounded-full',
            barColor,
            animated && 'transition-[width] duration-700 ease-out'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

