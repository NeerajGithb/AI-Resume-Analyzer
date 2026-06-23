'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AnalysisProgress } from '@/components/analysis/AnalysisProgress';
import { useCompareStore } from '@/store/compareUIStore';
import { useCompareMutation } from '@/hooks/useCompareMutation';
import { COMPARE_STAGES } from '@/lib/constants';

function ArrowRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}

function FileUpload({ label, file, onFile, disabled }: { label: string; file: File | null; onFile: (f: File | null) => void; disabled: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[var(--text-primary)]">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="px-4 py-3 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors cursor-pointer">
          <p className="text-sm text-[var(--text-secondary)]">{file ? file.name : 'Click to upload PDF'}</p>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const router = useRouter();
  const { resume1, resume2, setResumes, stage, progress } = useCompareStore();
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: compare, isPending: isComparing, error, abort } = useCompareMutation();

  const handleCompare = () => {
    if (!file1 || !file2) {
      setValidationError('Please upload both resumes to compare.');
      return;
    }
    setValidationError(null);
    setResumes(file1, file2);
    compare({ resume1: file1, resume2: file2 }, {
      onSuccess: (data: any) => {
        setIsRedirecting(true);
        if (data.id) {
          router.push(`/compare/report/${data.id}`);
        }
      },
    });
  };

  return (
    <AppShell>
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Resume Comparison
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Compare two resumes side-by-side to see which performs better.
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
                  <p className="text-xs text-[var(--text-muted)]">Please wait while we load your comparison</p>
                </div>
              </motion.div>
            )}

            {isComparing && stage && !isRedirecting && (
              <motion.div
                key="comparing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <AnalysisProgress
                  stage={stage as any}
                  progress={progress}
                  stageOrder={COMPARE_STAGES}
                  onCancel={abort}
                />
              </motion.div>
            )}

            {!isComparing && !isRedirecting && (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUpload label="Resume 1" file={file1} onFile={(f) => { setFile1(f); setValidationError(null); }} disabled={isComparing} />
                    <FileUpload label="Resume 2" file={file2} onFile={(f) => { setFile2(f); setValidationError(null); }} disabled={isComparing} />
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCompare}
                      disabled={!file1 || !file2}
                      loading={isComparing}
                      iconRight={<ArrowRightIcon />}
                    >
                      Compare Resumes
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

