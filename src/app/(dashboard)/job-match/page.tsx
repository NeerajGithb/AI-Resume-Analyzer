'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { DropZone } from '@/components/upload/DropZone';
import { Button } from '@/components/ui/Button';
import { AnalysisProgress } from '@/components/analysis/AnalysisProgress';
import { useJobMatchStore } from '@/store/jobMatchUIStore';
import { useJobMatchMutation } from '@/hooks/useJobMatchMutation';
import { JOB_MATCH_STAGES } from '@/lib/constants';

function ArrowRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}

export default function JobMatchPage() {
  const router = useRouter();
  const { resume, setResume, stage, progress } = useJobMatchStore();
  const [jobDescription, setJobDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: matchJob, isPending: isMatching, error, abort } = useJobMatchMutation();

  const handleMatch = () => {
    if (!resume) {
      setValidationError('Please upload a PDF resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setValidationError('Please paste the job description.');
      return;
    }
    setValidationError(null);
    matchJob({ resume, jobDescription }, {
      onSuccess: (data: any) => {
        setIsRedirecting(true);
        if (data.id) {
          router.push(`/job-match/report/${data.id}`);
        }
      },
    });
  };

  return (
    <AppShell>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Job Match Analyzer
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Compare your resume against a specific job description to see how well you match.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isRedirecting && (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-12 shadow-[var(--shadow-xs)] text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Redirecting to Results...</h2>
                  <p className="text-xs text-[var(--text-muted)]">Please wait while we load your match results</p>
                </div>
              </motion.div>
            )}

            {isMatching && stage && !isRedirecting && (
              <motion.div
                key="matching"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <AnalysisProgress
                  stage={stage as any}
                  progress={progress}
                  stageOrder={JOB_MATCH_STAGES}
                  onCancel={abort}
                />
              </motion.div>
            )}

            {!isMatching && !isRedirecting && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {(validationError || error) && (
                  <div className="bg-red-50 border border-red-200 rounded-[var(--radius-lg)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-5 h-5 text-red-600">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-sm text-red-700">{validationError || error?.message}</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-5 shadow-[var(--shadow-xs)]">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Upload Resume</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">PDF format, max 5 MB</p>
                  </div>
                  <DropZone
                    file={resume}
                    onFile={(f) => {
                      setResume(f);
                      setValidationError(null);
                    }}
                    disabled={isMatching}
                    error={null}
                  />
                </div>

                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-5 shadow-[var(--shadow-xs)]">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Job Description</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Paste the full job posting</p>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="Paste the job description here..."
                    className="w-full h-48 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleMatch}
                      disabled={!resume || !jobDescription.trim()}
                      loading={isMatching}
                      iconRight={<ArrowRightIcon />}
                    >
                      Analyze Match
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
  );
}

