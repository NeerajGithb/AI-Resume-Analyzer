'use client';

import { useEffect, useRef } from 'react';
import { getScoreRingColor, getScoreLabel, getGradeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  grade: string;
  size?: number;
}

export function ScoreRing({ score, grade, size = 160 }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const ringColor = getScoreRingColor(score);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    // Set initial position to full offset (empty ring)
    circle.style.strokeDashoffset = String(circumference);
    circle.style.strokeDasharray = String(circumference);

    // Animate to target offset after a short delay
    const timer = setTimeout(() => {
      if (circle) {
        circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        circle.style.strokeDashoffset = String(offset);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [score, circumference, offset]);

  return (
    <div
      className="flex flex-col items-center gap-4"
      role="img"
      aria-label={`ATS Score: ${score} out of 100, Grade ${grade}`}
    >
      {/* SVG Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--text-primary)] leading-none tabular-nums">
            {score}
          </span>
          <span className="text-xs text-[var(--text-muted)] mt-1">/ 100</span>
        </div>
      </div>

      {/* Score info */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center gap-2 justify-center">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded text-sm font-bold border',
            getGradeColor(grade)
          )}>
            Grade {grade}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">{getScoreLabel(score)}</p>
      </div>
    </div>
  );
}

