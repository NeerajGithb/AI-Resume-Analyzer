'use client';

import { useEffect, useRef } from 'react';
import { getScoreRingColor, getScoreLabel, getGradeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  grade: string;
  size?: number;
}

export function ScoreRing({ score, grade, size = 180 }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const ringColor = getScoreRingColor(score);

  useEffect(() => {
    const circle = circleRef.current;
    const glow = glowRef.current;
    if (!circle) return;

    circle.style.strokeDashoffset = String(circumference);
    circle.style.strokeDasharray = String(circumference);
    if (glow) {
      glow.style.strokeDashoffset = String(circumference);
      glow.style.strokeDasharray = String(circumference);
    }

    const timer = setTimeout(() => {
      if (circle) {
        circle.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        circle.style.strokeDashoffset = String(offset);
      }
      if (glow) {
        glow.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        glow.style.strokeDashoffset = String(offset);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [score, circumference, offset]);

  return (
    <div
      className="flex flex-col items-center gap-5"
      role="img"
      aria-label={`ATS Score: ${score} out of 100, Grade ${grade}`}
    >
      {/* SVG Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#f1f5f9" strokeWidth="12"
          />
          {/* Subtle tick marks */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
            const x1 = size / 2 + (radius - 8) * Math.cos(angle);
            const y1 = size / 2 + (radius - 8) * Math.sin(angle);
            const x2 = size / 2 + (radius + 2) * Math.cos(angle);
            const y2 = size / 2 + (radius + 2) * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#e2e8f0" strokeWidth="1" />
            );
          })}
          {/* Glow layer */}
          <circle
            ref={glowRef}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={ringColor} strokeWidth="14"
            strokeLinecap="round" opacity="0.2"
            filter="url(#glow)"
          />
          {/* Progress ring */}
          <circle
            ref={circleRef}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={ringColor} strokeWidth="11"
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-4xl font-black text-[var(--text-primary)] leading-none tabular-nums tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      {/* Grade badge + label */}
      <div className="text-center space-y-2">
        <span className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border tracking-wide shadow-sm',
          getGradeColor(grade)
        )}>
          Grade {grade}
        </span>
        <p className="text-xs font-medium text-[var(--text-muted)]">{getScoreLabel(score)}</p>
      </div>
    </div>
  );
}