'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisStage } from '@/types';
import { STAGE_LABELS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AnalysisProgressProps {
  stage: AnalysisStage | string;
  progress: number;
  stageOrder?: string[];
  stageLabels?: Record<string, string>;
  onCancel?: () => void;
}

function CheckIcon() {
  return (
    <motion.svg
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <motion.polyline
        points="20 6 9 17 4 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </motion.svg>
  );
}

function SpinnerIcon() {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </motion.svg>
  );
}

export function AnalysisProgress({ stage, stageOrder, stageLabels, onCancel }: AnalysisProgressProps) {
  // Use provided stage order or default to common stages
  const stages = stageOrder || ['uploading', 'parsing', 'processing', 'finalizing'];
  const labels = stageLabels || STAGE_LABELS;
  
  const currentIndex = stages.indexOf(stage);

  return (
    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Analyzing your resume…</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{labels[stage] || stage}</p>
        </div>
      </div>

      {/* Stage Steps - Vertical List */}
      <div className="space-y-3">
        {stages.map((s, i) => {
          const isComplete = i < currentIndex;
          const isActive = i === currentIndex;
          const isPending = i > currentIndex;

          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              {/* Status Icon */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                isComplete && 'bg-green-100 text-green-600',
                isActive && 'bg-blue-100 text-blue-600',
                isPending && 'bg-gray-100 text-gray-400'
              )}>
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <CheckIcon key="check" />
                  ) : isActive ? (
                    <SpinnerIcon key="spinner" />
                  ) : (
                    <motion.div
                      key="pending"
                      className="w-2 h-2 rounded-full bg-current"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Stage Label */}
              <div className="flex-1">
                <p className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  isComplete && 'text-green-700',
                  isActive && 'text-blue-700',
                  isPending && 'text-gray-400'
                )}>
                  {labels[s] || s}
                </p>
              </div>

              {/* Completion Indicator */}
              {isComplete && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-medium text-green-600"
                >
                  Done
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Skeleton preview of incoming results */}
      <div className="space-y-3 pt-2 border-t border-[var(--border)]">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-4/5" />
        <Skeleton className="h-1.5 w-full rounded-full mt-2" />
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel Analysis
          </Button>
        </div>
      )}
    </div>
  );
}

