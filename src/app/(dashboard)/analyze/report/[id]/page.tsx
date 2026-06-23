'use client';

import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { AnalysisProgress } from '@/components/analysis/AnalysisProgress';
import { ResultsDashboard } from '@/components/analysis/ResultsDashboard';
import { Button } from '@/components/ui/Button';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { useLatestAnalysisQuery } from '@/hooks/useAnalysisMutation';
import { useQueryClient } from '@tanstack/react-query';

function AlertIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default function AnalysisReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { file, stage, progress, reset } = useAnalysisStore();
  const { data: cache } = useLatestAnalysisQuery();
  const result = cache?.result ?? null;
  const error = cache?.error ?? null;
  const queryClient = useQueryClient();
  const isAnalyzing = !!stage;

  const handleReset = () => {
    reset();
    queryClient.setQueryData(['latest-analysis'], undefined);
    router.push('/analyze');
  };

  const handleGoBack = () => {
    router.push('/analyze');
  };

  // No file and no result — redirect to analyze
  if (!file && !result && !isAnalyzing) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto mt-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gray-100 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-subtle)]">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">No resume uploaded</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Upload a resume first to see your analysis results.</p>
          </div>
          <Button variant="primary" onClick={handleGoBack} icon={<ArrowLeftIcon />}>
            Upload Resume
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <>
      <AppShell>
        <AnimatePresence mode="wait">
          {/* Analyzing state */}
          {isAnalyzing && stage && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <AnalysisProgress stage={stage} progress={progress} />
            </motion.div>
          )}

          {/* Error state */}
          {error && !isAnalyzing && !result && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto mt-8 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                <AlertIcon />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Analysis failed</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{error.message}</p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Button variant="secondary" size="sm" onClick={handleGoBack} icon={<ArrowLeftIcon />}>
                  Go back
                </Button>
                <Button variant="primary" size="sm" onClick={() => router.refresh()}>
                  Try again
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results state */}
          {result && !isAnalyzing && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsDashboard
                result={result}
                fileName={file?.name ?? 'resume.pdf'}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AppShell>
    </>
  );
}
