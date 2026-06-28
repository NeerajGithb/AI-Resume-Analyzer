'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useCoverLetterStore } from '@/store/coverLetterUIStore';
import {
  useLatestCoverLetterQuery,
  useCoverLetterResultQuery,
  useCoverLetterMutation,
} from '@/hooks/useCoverLetterMutation';
import { useQueryClient } from '@tanstack/react-query';
import { CoverLetterDashboard } from '@/components/coverLetter/CoverLetterDashboard';
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

export default function CoverLetterReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const queryClient = useQueryClient();

  const isTempToken = id ? (() => {
    try {
      const decoded = atob(id.replace(/-/g, '+').replace(/_/g, '/'));
      return decoded.startsWith('generating:');
    } catch {
      return false;
    }
  })() : false;

  const { resume, stage, progress, reset, jobTitle, companyName } = useCoverLetterStore();
  const { abort } = useCoverLetterMutation();

  const { data: cache } = useLatestCoverLetterQuery();
  const cacheResult = cache?.result ?? null;
  const cacheError  = cache?.error  ?? null;

  const { data: apiResult, isPending: isLoadingApi, error: apiError } = useCoverLetterResultQuery(
    isTempToken ? undefined : id || undefined
  );

  const result    = cacheResult || apiResult || null;
  // Patch missing fields from the Zustand store (covers stale cache/persisted data)
  const patchedResult = result ? {
    ...result,
    jobTitle:    result.jobTitle    || jobTitle    || '',
    companyName: result.companyName || companyName || '',
  } : null;
  const error     = cacheError  || apiError  || null;
  const isLoading = !cacheResult && isLoadingApi && !isTempToken;

  useEffect(() => {
    if (isTempToken && patchedResult?.id && !stage) {
      router.replace(`/cover-letter/report/${patchedResult.id}`);
    }
  }, [isTempToken, patchedResult?.id, stage, router]);

  const handleReset = () => {
    reset();
    queryClient.setQueryData(['latest-cover-letter'], undefined);
    router.push('/cover-letter');
  };

  /* ── No context ── */
  if (!resume && !patchedResult && !stage && !isLoading && !isTempToken) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gray-100 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">No cover letter found</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Upload your resume to generate a cover letter.</p>
            </div>
            <Button variant="default" onClick={() => router.push('/cover-letter')}>
              <ArrowLeftIcon /> Generate Cover Letter
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ── Loading from API ── */
  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-12 shadow-[var(--shadow-xs)] text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Loading cover letter…</h2>
            <p className="text-xs text-[var(--text-muted)]">Fetching your results</p>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ── Full-bleed states: progress / error / dashboard ── */
  return (
    <AnimatePresence mode="wait">

      {/* Generating */}
      {stage && (
        <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          style={{ height: '100vh', overflow: 'hidden' }}>
          <GlobalProgress
            title="Generating your cover letter"
            stages={['uploading', 'parsing', 'generating', 'finalizing']}
            stageMeta={{
              uploading:  { label: 'Uploading',  desc: 'Securely uploading your resume'          },
              parsing:    { label: 'Parsing',    desc: 'Extracting your experience and skills'   },
              generating: { label: 'Writing',    desc: 'Crafting your personalized cover letter' },
              finalizing: { label: 'Finalizing', desc: 'Polishing and preparing your letter'     },
            }}
            stage={stage}
            progress={progress}
            onCancel={() => { abort(); router.push('/cover-letter'); }}
          />
        </motion.div>
      )}

      {/* Error */}
      {error && !stage && !patchedResult && (
        <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: '#fef2f2', border: '1px solid #fecaca',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <AlertIcon />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>Generation failed</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: '0 0 20px' }}>
              {(error as Error)?.message || 'An error occurred during cover letter generation'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="secondary" size="sm" onClick={() => router.push('/cover-letter')}>
                <ArrowLeftIcon /> Go back
              </Button>
              <Button variant="default" size="sm" onClick={() => router.refresh()}>Try again</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dashboard — full height, no AppShell wrapper */}
      {patchedResult && !stage && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{ height: '100vh', overflow: 'hidden' }}
        >
          <CoverLetterDashboard result={patchedResult} onReset={handleReset} />
        </motion.div>
      )}

    </AnimatePresence>
  );
}