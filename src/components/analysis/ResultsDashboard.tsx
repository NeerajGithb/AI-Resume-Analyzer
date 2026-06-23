'use client';

import { motion } from 'framer-motion';
import { AnalysisResult } from '@/types';
import { ScoreRing } from './ScoreRing';
import { SectionScores } from './SectionScores';
import { KeywordChips } from './KeywordChips';
import { ImprovementsList } from './ImprovementCard';
import { ATSTips } from './ATSTips';
import { ToneFeedback } from './ToneFeedback';
import { Button } from '@/components/ui/Button';
import { exportReportAsPDF } from '@/lib/reportExporter';

interface ResultsDashboardProps {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

function container(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' as const, delay },
  };
}


function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

export function ResultsDashboard({ result, fileName, onReset }: ResultsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Action bar */}
      <motion.div
        {...container(0)}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-xs text-[var(--text-muted)]">
            Analyzed: <span className="font-medium text-[var(--text-secondary)]">{fileName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<DownloadIcon />}
            onClick={() => exportReportAsPDF(result, fileName)}
          >
            Download Report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshIcon />}
            onClick={onReset}
          >
            Analyze Another
          </Button>
        </div>
      </motion.div>

      {/* Score + Overview row */}
      <motion.div
        {...container(0.06)}
        className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Score Ring */}
          <div className="shrink-0">
            <ScoreRing score={result.overall_score} grade={result.grade} />
          </div>

          {/* Quick stats */}
          <div className="flex-1 w-full">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Stat
                label="ATS Score"
                value={`${result.overall_score}/100`}
              />
              <Stat
                label="Grade"
                value={result.grade}
              />
              <Stat
                label="Sections"
                value={String(result.sections.length)}
              />
              <Stat
                label="Missing Keywords"
                value={String(
                  result.missing_keywords.technical.length +
                  result.missing_keywords.soft_skills.length +
                  result.missing_keywords.industry.length
                )}
              />
              <Stat
                label="Improvements"
                value={String(result.improvements.length)}
              />
              <Stat
                label="ATS Tips"
                value={String(result.ats_tips.length)}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...container(0.12)}>
          <SectionScores sections={result.sections} />
        </motion.div>
        <motion.div {...container(0.18)}>
          <KeywordChips missingKeywords={result.missing_keywords} />
        </motion.div>
      </div>

      {/* Improvements */}
      <motion.div {...container(0.24)}>
        <ImprovementsList improvements={result.improvements} />
      </motion.div>

      {/* ATS Tips + Tone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...container(0.30)}>
          <ATSTips tips={result.ats_tips} />
        </motion.div>
        <motion.div {...container(0.36)}>
          <ToneFeedback feedback={result.tone_feedback} />
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-[var(--text-primary)] leading-none">{value}</p>
    </div>
  );
}

