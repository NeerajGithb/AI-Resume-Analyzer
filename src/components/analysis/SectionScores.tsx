'use client';

import { motion } from 'framer-motion';
import { Section } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface SectionScoresProps {
  sections: Section[];
}

function scoreLabel(score: number) {
  if (score >= 85) return { text: 'Excellent', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (score >= 70) return { text: 'Good', cls: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (score >= 50) return { text: 'Fair', cls: 'text-amber-600 bg-amber-50 border-amber-200' };
  return { text: 'Needs work', cls: 'text-red-600 bg-red-50 border-red-200' };
}

export function SectionScores({ sections }: SectionScoresProps) {
  const avg = Math.round(sections.reduce((s, x) => s + x.score, 0) / sections.length);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>Section Breakdown</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{sections.length} sections analyzed</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Avg score</p>
            <p className="text-2xl font-black text-[var(--text-primary)] leading-none tabular-nums">{avg}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sections.map((section, i) => {
          const badge = scoreLabel(section.score);
          return (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="group p-3 rounded-sm border border-[var(--border)] bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {section.name}
                  </span>
                  <span className={cn(
                    'shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border',
                    badge.cls
                  )}>
                    {badge.text}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-black tabular-nums text-[var(--text-primary)] ml-2">
                  {section.score}
                  <span className="text-[var(--text-muted)] font-normal text-xs">/100</span>
                </span>
              </div>

              <Progress value={section.score} colorByScore animated />

              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 line-clamp-2 group-hover:line-clamp-none transition-all">
                {section.feedback}
              </p>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}