'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Improvement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ImprovementCardProps {
  improvement: Improvement;
  index: number;
}

const priorityConfig = {
  high: { cls: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500', label: 'High' },
  medium: { cls: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500', label: 'Medium' },
  low: { cls: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500', label: 'Low' },
};

export function ImprovementCard({ improvement, index }: ImprovementCardProps) {
  const [open, setOpen] = useState(index < 2);
  const p = priorityConfig[improvement.impact];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="rounded-sm border border-[var(--border)] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className={cn('w-full flex items-center gap-3 px-4 py-3.5 text-left', 'hover:bg-gray-50/80 transition-colors duration-100')}
        aria-expanded={open}
      >
        <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-[11px] font-black flex items-center justify-center">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">
              {improvement.section}
            </p>
            <span className={cn('shrink-0 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border', p.cls)}>
              <span className={cn('w-1.5 h-1.5 rounded-full', p.dot)} />
              {p.label} impact
            </span>
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {improvement.section} improvement
          </p>
        </div>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          className={cn('shrink-0 text-[var(--text-muted)] transition-transform duration-200', open && 'rotate-180')}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[var(--border)]">
              <div className="grid grid-cols-1 gap-2 mt-2">
                {/* Before */}
                <div>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span className="w-3 h-px bg-red-400 inline-block" />
                    Before
                  </p>
                  <div className="relative bg-red-50 border border-red-100 rounded-sm p-3 pl-4">
                    <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-red-300" />
                    <p className="text-xs text-red-800 leading-relaxed font-mono">{improvement.original}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 px-1">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)] rotate-90">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                {/* After */}
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span className="w-3 h-px bg-emerald-400 inline-block" />
                    After
                  </p>
                  <div className="relative bg-emerald-50 border border-emerald-100 rounded-sm p-3 pl-4">
                    <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-emerald-400" />
                    <p className="text-xs text-emerald-800 leading-relaxed font-mono">{improvement.rewrite}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

interface ImprovementsListProps {
  improvements: Improvement[];
}

export function ImprovementsList({ improvements }: ImprovementsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>Suggested Improvements</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Ranked by potential impact</p>
          </div>
          <span className="shrink-0 text-xs font-bold text-[var(--accent)] bg-[var(--accent-light)] border border-[var(--accent)]/20 px-2.5 py-1 rounded-full">
            {improvements.length} suggestions
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {improvements.map((imp, i) => (
          <ImprovementCard key={i} improvement={imp} index={i} />
        ))}
      </CardContent>
    </Card>
  );
}