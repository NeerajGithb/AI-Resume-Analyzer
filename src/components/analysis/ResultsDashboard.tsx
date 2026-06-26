'use client';

import { motion } from 'framer-motion';
import { AnalysisResult } from '@/types';
import { ScoreRing } from './ScoreRing';
import { DetailedSections } from './DetailedSections';
import { ImprovementsList } from './ImprovementCard';
import { Button } from '@/components/ui/Button';
import { exportReportAsPDF } from '@/lib/reportExporter';
import { cn } from '@/lib/utils';

interface ResultsDashboardProps {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' as const, delay },
  };
}

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function scoreColor(score: number) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number) {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

const SECTION_SCORES = (result: AnalysisResult) => [
  { name: 'ATS Compatibility', score: result.ats_compatibility?.score ?? 0, id: 'ats-compatibility' },
  { name: 'Keyword Analysis', score: result.keyword_analysis.score, id: 'keyword-analysis' },
  { name: 'Role Match', score: result.role_matching.score, id: 'role-match' },
  { name: 'Experience & Impact', score: result.experience_impact.score, id: 'experience-impact' },
  { name: 'Content Quality', score: result.content_quality.score, id: 'content-quality' },
  { name: 'Resume Structure', score: result.resume_structure.score, id: 'resume-structure' },
  { name: 'Project Analysis', score: 0, id: 'project-analysis' },
  { name: 'Skills Categorization', score: 0, id: 'skills-categorization' },
  { name: 'Formatting Analysis', score: 0, id: 'formatting-analysis' },
  { name: 'Summary Analysis', score: 0, id: 'summary-analysis' },
  { name: 'Grammar Analysis', score: 0, id: 'grammar-analysis' },
];

function SidebarCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm',
      className
    )}>
      {children}
    </div>
  );
}

function SidebarSectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-4 pb-2">{label}</p>
  );
}

function OverviewPanel({ result, fileName, onReset, onDownload }: {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
  onDownload: () => void;
}) {
  const totalMissing =
    result.keyword_analysis.missing.technical.length +
    result.keyword_analysis.missing.soft_skills.length +
    result.keyword_analysis.missing.industry.length;

  return (
    <aside className="flex flex-col gap-3">

      {/* Score block */}
      <motion.div {...fade(0)}>
        <SidebarCard>
          <div className="p-4 flex items-center gap-4">
            <ScoreRing score={result.overall_score} grade={result.grade} />
            <div className="flex-1 min-w-0 space-y-3">
              {/* File */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Analyzed file</p>
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-sm border border-gray-200">
                  <span className="text-gray-400"><IconFile /></span>
                  <p className="text-xs font-medium text-gray-600 truncate">{fileName}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Score', value: `${result.overall_score}`, highlight: false },
                  { label: 'Grade', value: result.grade, highlight: false },
                  { label: 'Missing KW', value: String(totalMissing), highlight: totalMissing > 5 },
                  { label: 'Fixes', value: String(result.improvements.length), highlight: false },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className={cn(
                      'text-base font-bold leading-tight tabular-nums mt-0.5',
                      stat.highlight ? 'text-red-600' : 'text-gray-800'
                    )}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SidebarCard>
      </motion.div>

      {/* Section scores */}
      <motion.div {...fade(0.06)}>
        <SidebarCard>
          <SidebarSectionLabel label="Section scores" />
          <div className="px-3 pb-3 space-y-1">
            {SECTION_SCORES(result).map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  const element = document.getElementById(s.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Flash highlight effect
                    element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
                    setTimeout(() => {
                      element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
                    }, 2000);
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm transition-all duration-200 group',
                  'hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm',
                  'border border-transparent',
                  s.score > 0 ? 'cursor-pointer' : 'cursor-default opacity-60'
                )}
              >
                <div className={cn(
                  'w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200',
                  s.score > 0 ? scoreColor(s.score) : 'bg-gray-300',
                  'group-hover:scale-125'
                )} />
                <p className="text-[11px] font-medium text-gray-700 flex-1 text-left truncate group-hover:text-gray-900">
                  {s.name}
                </p>
                <span className={cn(
                  'text-xs font-bold tabular-nums shrink-0 min-w-[1.5rem] text-right transition-all duration-200',
                  s.score > 0 ? scoreTextColor(s.score) : 'text-gray-400',
                  'group-hover:scale-110'
                )}>
                  {s.score > 0 ? s.score : '—'}
                </span>
                {s.score > 0 && (
                  <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </SidebarCard>
      </motion.div>

      {/* Priority actions */}
      {result.top_3_actions?.length === 3 && (
        <motion.div {...fade(0.1)}>
          <SidebarCard>
            <SidebarSectionLabel label="Priority actions" />
            <div className="px-4 pb-4 space-y-2.5">
              {result.top_3_actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100">
                  <span className={cn(
                    'shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-sm',
                    i === 0 ? 'bg-red-500' : i === 1 ? 'bg-amber-500' : 'bg-blue-500'
                  )}>
                    {i + 1}
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">{action}</p>
                </div>
              ))}
            </div>
          </SidebarCard>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div {...fade(0.14)} className="flex flex-col gap-2">
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-sm transition-colors duration-150"
        >
          <IconDownload />
          Download PDF report
        </button>
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-sm border border-gray-200 transition-colors duration-150"
        >
          <IconRefresh />
          Analyze another resume
        </button>
      </motion.div>

    </aside>
  );
}

export function ResultsDashboard({ result, fileName, onReset }: ResultsDashboardProps) {
  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Left sidebar */}
        <div className="lg:col-span-2 lg:sticky lg:top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
          <motion.div {...fade(0)} className="mb-5">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1 h-5 rounded-full bg-gray-800" />
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Resume analysis</h1>
            </div>
            <p className="text-xs text-gray-400 pl-3.5 leading-relaxed">
              ATS compatibility, keyword coverage, and prioritized fixes.
            </p>
          </motion.div>

          <OverviewPanel
            result={result}
            fileName={fileName}
            onReset={onReset}
            onDownload={() => exportReportAsPDF(result, fileName)}
          />
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <motion.div {...fade(0.12)}>
            <DetailedSections result={result} />
          </motion.div>
          <motion.div {...fade(0.2)}>
            <ImprovementsList improvements={result.improvements} />
          </motion.div>
        </div>

      </div>
    </div>
  );
}