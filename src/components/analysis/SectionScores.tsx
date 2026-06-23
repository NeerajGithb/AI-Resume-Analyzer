'use client';

import { motion } from 'framer-motion';
import { Section } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface SectionScoresProps {
  sections: Section[];
}

export function SectionScores({ sections }: SectionScoresProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Breakdown</CardTitle>
        <span className="text-xs text-[var(--text-muted)]">{sections.length} sections</span>
      </CardHeader>
      <CardContent className="space-y-5">
        {sections.map((section, i) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">{section.name}</span>
              <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                {section.score}
                <span className="text-[var(--text-muted)] font-normal">/100</span>
              </span>
            </div>
            <Progress value={section.score} colorByScore animated />
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{section.feedback}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

