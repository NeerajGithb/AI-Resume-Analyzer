'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useCompareStore } from '@/store/compareUIStore';
import { useLatestCompareQuery, useCompareResultQuery, useCompareMutation } from '@/hooks/useCompareMutation';
import { useQueryClient } from '@tanstack/react-query';
import { CompareDashboard } from '@/components/compare/CompareDashboard';
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

export default function CompareReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const queryClient = useQueryClient();

  const isTempToken = id ? (() => {
    try {
      const decoded = atob(id.replace(/-/g, '+').replace(/_/g, '/'));
      return decoded.startsWith('comparing:');
    } catch {
      return false;
    }
  })() : false;

  const { resume1, stage, progress, reset } = useCompareStore();
  const { abort } = useCompareMutation();

  const { data: cache } = useLatestCompareQuery();
  const cacheResult = cache?.result ?? null;
  const cacheError  = cache?.error  ?? null;

  const { data: apiResult, isPending: isLoadingApi, error: apiError } = useCompareResultQuery(
    isTempToken ? undefined : id || undefined
  );

  const result    = cacheResult || apiResult || null;
  const error     = cacheError  || apiError  || null;
  const isLoading = !cacheResult && isLoadingApi && !isTempToken;
  const showProgress = stage || (isTempToken && !result) || isLoading;

  useEffect(() => {
    if (isTempToken && result?.id && !stage) {
      router.replace(`/compare/report/${result.id}`);
    }
  }, [isTempToken, result?.id, stage, router]);

  const handleReset = () => {
    reset();
    queryClient.setQueryData(['latest-compare'], undefined);
    router.push('/compare');
  };

  const handleGoBack = () => router.push('/compare');

  /* ── No resume / result / stage ── */
  if (!resume1 && !result && !stage && !isLoading && !isTempToken) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gray-100 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-subtle)]">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">No comparison found</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Upload two resumes to see a comparison report.</p>
            </div>
            <Button variant="default" onClick={handleGoBack}>
              <ArrowLeftIcon />
              Start New Comparison
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
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Loading Comparison...</h2>
            <p className="text-xs text-[var(--text-muted)]">Please wait while we fetch your results</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">

        {/* ── Comparing: full-page progress ── */}
        {stage && (
          <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <GlobalProgress
              title="Comparing your resumes"
              stages={['uploading', 'parsing', 'comparing', 'finalizing']}
              stageMeta={{
                uploading:  { label: 'Uploading',  desc: 'Securely uploading both PDFs'       },
                parsing:    { label: 'Parsing',    desc: 'Extracting text from both resumes'  },
                comparing:  { label: 'Comparing',  desc: 'Running side-by-side AI analysis'   },
                finalizing: { label: 'Finalizing', desc: 'Preparing your comparison report'   },
              }}
              stage={stage}
              progress={progress}
              onCancel={() => { abort(); router.push('/compare'); }}
            />
          </motion.div>
        )}

        {/* ── Error state ── */}
        {error && !stage && !result && (
          <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                <AlertIcon />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Comparison failed</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                  {(error as Error)?.message || 'An error occurred during comparison'}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Button variant="secondary" size="sm" onClick={handleGoBack}><ArrowLeftIcon /> Go back</Button>
                <Button variant="default" size="sm" onClick={() => router.refresh()}>Try again</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {result && !stage && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="p-6">
            <CompareDashboard result={result} onReset={handleReset} />
          </motion.div>
        )}

      </AnimatePresence>
    </AppShell>
  );
}
