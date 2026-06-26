'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ── Icons ────────────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </motion.svg>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('rounded bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] animate-shimmer', className)}
      style={style}
    />
  );
}

function SkeletonLeft() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Overall Score Card - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5 overflow-hidden relative"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-purple-50/20 pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Skeleton className="w-14 h-14 rounded-full shrink-0" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-violet-200 border-t-violet-400"
              />
            </div>
            <div className="flex-1">
              <Skeleton className="h-3 w-36 mb-2 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3"
              >
                <Skeleton className="h-2 w-16 mb-2 rounded-full" />
                <Skeleton className="h-5 w-14 rounded" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section Scores - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <Skeleton className="h-3 w-32 mb-4 rounded-full" />
        <div className="flex flex-col gap-3.5">
          {[65, 72, 58, 80].map((width, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <Skeleton className="w-2 h-2 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
                    />
                  </div>
                  <Skeleton className="h-2.5 w-8 rounded" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Keywords Preview - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <Skeleton className="h-3 w-28 mb-3.5 rounded-full" />
        <div className="flex flex-wrap gap-2">
          {[65, 80, 55, 70, 90, 60].map((width, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
            >
              <Skeleton
                className="h-7 rounded-full"
                style={{ width: `${width}px` }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suggestions Preview - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <Skeleton className="h-3 w-36 mb-3.5 rounded-full" />
        <div className="space-y-2.5">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
              className="flex items-start gap-2.5 bg-gradient-to-br from-violet-50/50 to-purple-50/30 rounded-lg p-3"
            >
              <Skeleton className="w-4 h-4 rounded-full shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-2 w-3/4 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Stages ───────────────────────────────────────────────────────────────── */
const STAGES = [
  'uploading',
  'parsing',
  'scoring',
  'keywords',
  'suggestions',
  'finalizing',
] as const;
type Stage = typeof STAGES[number];

const STAGE_META: Record<Stage, { label: string; desc: string }> = {
  uploading:   { label: 'Uploading',        desc: 'Securely uploading your PDF'     },
  parsing:     { label: 'Parsing',          desc: 'Extracting text & structure'     },
  scoring:     { label: 'ATS scoring',      desc: 'Calculating compatibility score' },
  keywords:    { label: 'Keyword analysis', desc: 'Detecting gaps & missing terms'  },
  suggestions: { label: 'AI suggestions',   desc: 'Generating improvement tips'     },
  finalizing:  { label: 'Finalizing',       desc: 'Preparing your results'          },
};

/* ── Sub-progress bar ─────────────────────────────────────────────────────── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-[3px] w-full bg-gray-100 rounded-full overflow-hidden mt-1.5">
      <motion.div
        className="h-full bg-violet-500 rounded-full"
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ── Overall % ────────────────────────────────────────────────────────────── */
function calcOverall(stage: string | null, stageProgress: number): number {
  const idx = (STAGES as readonly string[]).indexOf(stage ?? '');
  if (idx === -1) return 0;
  const perStage = 100 / STAGES.length;
  return Math.min(99, Math.round(idx * perStage + (stageProgress / 100) * perStage));
}

/* ── Props ────────────────────────────────────────────────────────────────── */
interface GlobalProgressProps {
  onCancel?: () => void;
  stages?: readonly string[];
  stageMeta?: Record<string, { label: string; desc: string }>;
  title?: string;
  stage?: string | null;
  progress?: number;
}

export function GlobalProgress({
  onCancel,
  stages = STAGES,
  stageMeta = STAGE_META as Record<string, { label: string; desc: string }>,
  title = 'Analyzing your resume',
  stage: externalStage,
  progress: externalProgress,
}: GlobalProgressProps) {
  const analysisStore = useAnalysisStore();
  
  // Use external props if provided, otherwise fallback to analysis store
  const stage = externalStage !== undefined ? externalStage : analysisStore.stage;
  const progress = externalProgress !== undefined ? externalProgress : analysisStore.progress;

  if (!stage) return null;

  const currentIdx = stages.indexOf(stage);
  const overall    = calcOverall(stage, progress);
  const meta       = stageMeta[stage];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full min-h-screen bg-gray-50/60"
    >
      <div className="max-w-6xl mx-auto px-6 py-8 h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 3  }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
                className="text-sm text-gray-400 mt-0.5"
              >
                {meta?.desc ?? stage}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            {/* Overall progress pill */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-1.5">
              <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-violet-500 rounded-full"
                  animate={{ width: `${overall}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
              <motion.span
                key={overall}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium text-violet-600 tabular-nums w-8"
              >
                {overall}%
              </motion.span>
            </div>

            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-xs h-8 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-[300px_1fr] gap-6 items-start">

          {/* ── Left: Small skeleton preview ── */}
          <div className="sticky top-6">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
              Preview
            </p>
            <SkeletonLeft />
          </div>

          {/* ── Right: Full width progress ── */}
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
              Analysis Progress
            </p>
            <div className="bg-white rounded-xl border border-gray-100 p-6 w-full">
              <div className="flex flex-col gap-1.5">
                {stages.map((s, i) => {
                  const isComplete  = i < currentIdx;
                  const isActiveNow = i === currentIdx;
                  const isPending   = i > currentIdx;
                  const m           = stageMeta[s];

                  return (
                    <div
                      key={s}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                        isComplete  && 'bg-green-50',
                        isActiveNow && 'bg-violet-50',
                      )}
                      style={{ opacity: isPending ? 0.4 : 1 }}
                    >
                      {/* Circle */}
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200',
                        isComplete  && 'bg-green-500 text-white',
                        isActiveNow && 'bg-violet-500 text-white',
                        isPending   && 'bg-gray-100 text-gray-400',
                      )}>
                        <AnimatePresence mode="wait">
                          {isComplete ? (
                            <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckIcon />
                            </motion.span>
                          ) : isActiveNow ? (
                            <motion.span key="spin" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <SpinnerIcon />
                            </motion.span>
                          ) : (
                            <span className="text-[10px] font-semibold">{i + 1}</span>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-medium leading-tight',
                          isComplete  && 'text-green-700',
                          isActiveNow && 'text-violet-700',
                          isPending   && 'text-gray-400',
                        )}>
                          {m?.label ?? s}
                        </p>
                        {isActiveNow && <ProgressBar value={progress} />}
                      </div>

                      {/* Badge */}
                      <AnimatePresence mode="wait">
                        {isComplete ? (
                          <motion.span
                            key="done"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1   }}
                            className="text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full shrink-0"
                          >
                            done
                          </motion.span>
                        ) : isActiveNow ? (
                          <motion.span
                            key="pct"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium text-violet-500 tabular-nums shrink-0 min-w-[3rem] text-right"
                          >
                            {progress}%
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}