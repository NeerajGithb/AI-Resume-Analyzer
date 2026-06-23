'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Improvement } from '@/types';
import { cn } from '@/lib/utils';

interface ImprovementCardProps {
  improvement: Improvement;
  index: number;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn('text-[var(--text-muted)] transition-transform duration-200', open && 'rotate-180')}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)] shrink-0">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ImprovementCard({ improvement, index }: ImprovementCardProps) {
  const [open, setOpen] = useState(index < 2); // First two open by default

  return (
    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-left',
          'hover:bg-gray-50 transition-colors duration-100'
        )}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-[11px] font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              {improvement.section}
            </p>
            <p className="text-sm font-medium text-[var(--text-primary)] truncate mt-0.5">
              {improvement.reason}
            </p>
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)]">
              {/* Before */}
              <div className="mt-3 space-y-1">
                <p className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
                  Original
                </p>
                <div className="bg-red-50 border border-red-100 rounded-[var(--radius-md)] p-3">
                  <p className="text-xs text-red-800 leading-relaxed font-mono">
                    {improvement.original}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  <ArrowIcon />
                </div>
              </div>

              {/* After */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                  Improved
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-[var(--radius-md)] p-3">
                  <p className="text-xs text-emerald-800 leading-relaxed font-mono">
                    {improvement.rewrite}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 border border-[var(--border)] rounded-[var(--radius-md)] p-3">
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Why this helps
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {improvement.reason}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Improvements List ────────────────────────────────────────────────────────
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ImprovementsListProps {
  improvements: Improvement[];
}

export function ImprovementsList({ improvements }: ImprovementsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Improvements</CardTitle>
        <span className="text-xs text-[var(--text-muted)]">{improvements.length} suggestions</span>
      </CardHeader>
      <CardContent className="space-y-2">
        {improvements.map((imp, i) => (
          <ImprovementCard key={i} improvement={imp} index={i} />
        ))}
      </CardContent>
    </Card>
  );
}

