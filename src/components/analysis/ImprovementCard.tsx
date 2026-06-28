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
  high:   { cls: 'text-red-600 bg-red-50 border-red-200',    dot: 'bg-red-500',    label: 'High' },
  medium: { cls: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500', label: 'Medium' },
  low:    { cls: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500',   label: 'Low' },
};

export function ImprovementCard({ improvement, index }: ImprovementCardProps) {
  const [open, setOpen] = useState(index < 2);
  const p = priorityConfig[improvement.impact];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.22 }}
      className="rounded-sm border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50/80 transition-colors"
        aria-expanded={open}
      >
        <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black flex items-center justify-center">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{improvement.section}</p>
            <span className={cn('inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border', p.cls)}>
              <span className={cn('w-1 h-1 rounded-full', p.dot)} />
              {p.label}
            </span>
          </div>
          <p className="text-xs font-semibold text-gray-700 truncate">{improvement.section} improvement</p>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={cn('shrink-0 text-gray-400 transition-transform duration-200', open && 'rotate-180')}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 space-y-2 border-t border-gray-100">
              {/* Before */}
              <div className="relative bg-red-50 border border-red-100 rounded-sm p-2.5 pl-3.5">
                <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l bg-red-300" />
                <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">Before</p>
                <p className="text-xs text-red-800 leading-relaxed font-mono">{improvement.original}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 h-px bg-gray-100" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 rotate-90">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* After */}
              <div className="relative bg-emerald-50 border border-emerald-100 rounded-sm p-2.5 pl-3.5">
                <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l bg-emerald-400" />
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">After</p>
                <p className="text-xs text-emerald-800 leading-relaxed font-mono">{improvement.rewrite}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ImprovementsList({ improvements }: { improvements: Improvement[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle>Suggested improvements</CardTitle>
            <p className="text-[11px] text-gray-400 mt-0.5">Ranked by potential impact</p>
          </div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
            {improvements.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {improvements.map((imp, i) => (
          <ImprovementCard key={i} improvement={imp} index={i} />
        ))}
      </CardContent>
    </Card>
  );
}