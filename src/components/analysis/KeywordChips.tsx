'use client';

import { motion } from 'framer-motion';
import { MissingKeywords } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface KeywordChipsProps {
  missingKeywords: MissingKeywords;
}

type Category = 'technical' | 'soft' | 'industry';

const categoryConfig: Record<Category, {
  label: string;
  chipCls: string;
  dotCls: string;
  badgeCls: string;
  icon: string;
}> = {
  technical: {
    label: 'Technical',
    chipCls: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
    dotCls: 'bg-violet-400',
    badgeCls: 'bg-violet-50 text-violet-600 border-violet-200',
    icon: '⚙',
  },
  soft: {
    label: 'Soft Skills',
    chipCls: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    dotCls: 'bg-blue-400',
    badgeCls: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: '💬',
  },
  industry: {
    label: 'Industry',
    chipCls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    dotCls: 'bg-amber-400',
    badgeCls: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: '🏢',
  },
};

interface ChipProps {
  word: string;
  chipCls: string;
  delay?: number;
}

function Chip({ word, chipCls, delay = 0 }: ChipProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
        'cursor-default transition-colors duration-150 select-none',
        chipCls
      )}
    >
      <span className="text-[10px] opacity-60">−</span>
      {word}
    </motion.span>
  );
}

function CategoryBlock({
  category,
  keywords,
  baseDelay,
}: {
  category: Category;
  keywords: string[];
  baseDelay: number;
}) {
  if (keywords.length === 0) return null;
  const cfg = categoryConfig[category];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.dotCls)} />
        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          {cfg.label}
        </span>
        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border', cfg.badgeCls)}>
          {keywords.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((word, i) => (
          <Chip key={word} word={word} chipCls={cfg.chipCls} delay={baseDelay + i * 0.035} />
        ))}
      </div>
    </div>
  );
}

export function KeywordChips({ missingKeywords }: KeywordChipsProps) {
  const total =
    missingKeywords.technical.length +
    missingKeywords.soft_skills.length +
    missingKeywords.industry.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>Missing Keywords</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Add these to improve ATS ranking</p>
          </div>
          {total > 0 && (
            <span className="shrink-0 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
              {total} missing
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">✓</div>
            <p className="text-sm font-semibold text-emerald-700">Full keyword coverage</p>
            <p className="text-xs text-[var(--text-muted)] text-center">Your resume already contains all detected keywords.</p>
          </motion.div>
        ) : (
          <>
            <CategoryBlock
              category="technical"
              keywords={missingKeywords.technical}
              baseDelay={0}
            />
            <CategoryBlock
              category="soft"
              keywords={missingKeywords.soft_skills}
              baseDelay={missingKeywords.technical.length * 0.035}
            />
            <CategoryBlock
              category="industry"
              keywords={missingKeywords.industry}
              baseDelay={(missingKeywords.technical.length + missingKeywords.soft_skills.length) * 0.035}
            />
            <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-3 leading-relaxed">
              Weave these naturally into your bullet points, summary, or skills section — never keyword-stuff.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}