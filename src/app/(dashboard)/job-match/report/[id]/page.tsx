'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useJobMatchStore } from '@/store/jobMatchUIStore';
import { useLatestJobMatchQuery, useJobMatchResultQuery, useJobMatchMutation } from '@/hooks/useJobMatchMutation';
import { useQueryClient } from '@tanstack/react-query';
import { JobMatchDashboard } from '@/components/jobMatch/JobMatchDashboard';
import AppShell from '@/components/layout/AppShell';
import { queryKeys } from '@/lib/api/queryKeys';

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

export default function JobMatchResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const queryClient = useQueryClient();

  // Check if this is a temp ID (base64 encoded string containing 'matching')
  const isTempToken = id ? (() => {
    try {
      const decoded = atob(id.replace(/-/g, '+').replace(/_/g, '/'));
      return decoded.startsWith('matching:');
    } catch {
      return false;
    }
  })() : false;

  const { resume, stage, progress, reset } = useJobMatchStore();
  const { abort } = useJobMatchMutation();

  const { data: cache } = useLatestJobMatchQuery();
  const cacheResult = cache?.result ?? null;
  const cacheError = cache?.error ?? null;

  const { data: apiResult, isPending: isLoadingApi, error: apiError } = useJobMatchResultQuery(
    isTempToken ? undefined : id || undefined
  );

  const result = cacheResult || apiResult || null;
  const error = cacheError || apiError || null;
  const isLoading = !cacheResult && isLoadingApi && !isTempToken;

  // Show progress when: stage is active, temp token without result, or loading
  const showProgress = stage || (isTempToken && !result) || isLoading;


  useEffect(() => {
    if (isTempToken && result?.id && !stage) {
      router.replace(`/job-match/report/${result.id}`);
    }
  }, [isTempToken, result?.id, stage, router]);

  const handleReset = () => {
    reset();
    if (id) queryClient.removeQueries({ queryKey: queryKeys.jobMatch.result(id) });
    router.push('/job-match');
  };

  const handleGoBack = () => router.push('/job-match');

  /* ── No resume / result / stage ── */
  if (!resume && !result && !stage && !isLoading && !isTempToken) {
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
              <h2 className="text-base font-semibold text-[var(--text-primary)]">No match analysis found</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Upload a resume and job description to see match results.</p>
            </div>
            <Button variant="default" onClick={handleGoBack}>
              <ArrowLeftIcon />
              Start New Match
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
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Loading Match Results...</h2>
            <p className="text-xs text-[var(--text-muted)]">Please wait while we fetch your results</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">

        {/* ── Matching: full-page progress ── */}
        {stage && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlobalProgress
              title="Matching Resume to Job"
              stages={['uploading', 'parsing', 'matching', 'finalizing']}
              stageMeta={{
                uploading: { label: 'Uploading', desc: 'Uploading your resume' },
                parsing: { label: 'Parsing', desc: 'Extracting resume content' },
                matching: { label: 'Matching', desc: 'Comparing against job requirements' },
                finalizing: { label: 'Finalizing', desc: 'Preparing your match report' },
              }}
              stage={stage}
              progress={progress}
              onCancel={() => {
                abort();
                router.push('/job-match');
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
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Match analysis failed</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                  {(error as Error)?.message || 'An error occurred during job matching'}
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
            <JobMatchDashboard result={result} onReset={handleReset} />
          </motion.div>
        )}

      </AnimatePresence>
    </AppShell>
  );
}
