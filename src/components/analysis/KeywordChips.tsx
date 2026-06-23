'use client';

import { motion } from 'framer-motion';
import { MissingKeywords } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface KeywordChipsProps {
  missingKeywords: MissingKeywords;
}

interface ChipProps {
  word: string;
  status: 'missing';
  delay?: number;
}

function Chip({ word, delay = 0 }: ChipProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        'bg-red-50 text-red-700 border-red-200'
      )}
    >
      <span className="mr-1 text-red-400">−</span>
      {word}
    </motion.span>
  );
}

interface CategorySectionProps {
  title: string;
  keywords: string[];
  baseDelay?: number;
}

function CategorySection({ title, keywords, baseDelay = 0 }: CategorySectionProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          {title}
        </h4>
        <span className="text-[10px] font-medium text-[var(--text-muted)] bg-gray-100 px-1.5 py-0.5 rounded">
          {keywords.length} missing
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((word, i) => (
          <Chip
            key={word}
            word={word}
            status="missing"
            delay={baseDelay + i * 0.04}
          />
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
    <Card>
      <CardHeader>
        <CardTitle>Missing Keywords</CardTitle>
        {total > 0 && (
          <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
            {total} missing
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {total === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-emerald-600 font-medium">✓ No critical keywords missing</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Your resume has good keyword coverage</p>
          </div>
        ) : (
          <>
            <CategorySection
              title="Technical"
              keywords={missingKeywords.technical}
              baseDelay={0}
            />
            <CategorySection
              title="Soft Skills"
              keywords={missingKeywords.soft_skills}
              baseDelay={missingKeywords.technical.length * 0.04}
            />
            <CategorySection
              title="Industry"
              keywords={missingKeywords.industry}
              baseDelay={(missingKeywords.technical.length + missingKeywords.soft_skills.length) * 0.04}
            />
          </>
        )}

        {total > 0 && (
          <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-3 mt-3">
            Add these keywords naturally in your resume to improve ATS compatibility.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

