'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultsDashboard } from '@/components/analysis/ResultsDashboard';
import { Button } from '@/components/ui/Button';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { useLatestAnalysisQuery, useAnalysisResultQuery, useAnalyzeMutation } from '@/hooks/useAnalysisMutation';
import { useQueryClient } from '@tanstack/react-query';
import AppShell from '@/components/layout/AppShell';

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

  const isTempToken = id && !id.match(/^[0-9a-fA-F]{24}$/);

  const { file, stage, reset } = useAnalysisStore();
  const { abort } = useAnalyzeMutation();

  const { data: cache } = useLatestAnalysisQuery();
  const cacheResult = cache?.result ?? null;
  const cacheError = cache?.error ?? null;

  const { data: apiResult, isPending: isLoadingApi, error: apiError } = useAnalysisResultQuery(
    isTempToken ? undefined : id
  );

  const result = cacheResult || apiResult || null;
  const error = cacheError || apiError || null;
  const isLoading = !cacheResult && isLoadingApi && !isTempToken;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isTempToken && result?.id && !stage) {
      router.replace(`/analyze/report/${result.id}`);
    }
  }, [isTempToken, result?.id, stage, router]);

  const handleReset = () => {
    reset();
    queryClient.setQueryData(['latest-analysis'], undefined);
    router.push('/analyze');
  };

  const handleGoBack = () => router.push('/analyze');

  /* ── No file / result / stage ── */
  if (!file && !result && !stage && !isLoading && !isTempToken) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
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
            <Button variant="default" onClick={handleGoBack}>
              <ArrowLeftIcon />
              Upload Resume
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ── Fetching from API ── */
  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-12 shadow-[var(--shadow-xs)] text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Loading Analysis Results...</h2>
            <p className="text-xs text-[var(--text-muted)]">Please wait while we fetch your results</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">

        {/* ── Analyzing: full-page progress instead of overlay ── */}
        {stage && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlobalProgress
              onCancel={() => {
                abort();
                router.push('/analyze');
              }}
            />
          </motion.div>
        )}

        {/* ── Error state ── */}
        {error && !stage && !result && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                <AlertIcon />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Analysis failed</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                  {(error as Error)?.message || 'An error occurred'}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Button variant="secondary" size="sm" onClick={handleGoBack}>
                  <ArrowLeftIcon />
                  Go back
                </Button>
                <Button variant="default" size="sm" onClick={() => router.refresh()}>
                  Try again
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {result && !stage && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
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
  );
}