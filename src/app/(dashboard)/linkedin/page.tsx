'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AnalysisProgress } from '@/components/analysis/AnalysisProgress';
import { useLinkedInStore } from '@/store/linkedinUIStore';
import { useLinkedInMutation } from '@/hooks/useLinkedInMutation';

import { LINKEDIN_STAGES } from '@/lib/constants';

function ArrowRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}

export default function LinkedInPage() {
  const router = useRouter();
  const { stage, progress } = useLinkedInStore();
  const [headline, setHeadline] = useState('');
  const [aboutSection, setAboutSection] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: analyze, isPending: isAnalyzing, error, abort } = useLinkedInMutation();

  const handleAnalyze = () => {
    if (!headline.trim()) {
      setValidationError('Please enter your LinkedIn headline.');
      return;
    }
    if (!aboutSection.trim()) {
      setValidationError('Please enter your about section.');
      return;
    }
    setValidationError(null);
    
    // Combine headline and about section
    const profileText = `Headline: ${headline}\n\nAbout: ${aboutSection}`;
    
    analyze(profileText, {
      onSuccess: (data: any) => {
        setIsRedirecting(true);
        if (data.id) {
          router.push(`/linkedin/report/${data.id}`);
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
              LinkedIn Profile Analyzer
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Enter your LinkedIn headline and about section to get optimization recommendations.
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
                  <p className="text-xs text-[var(--text-muted)]">Please wait while we load your analysis</p>
                </div>
              </motion.div>
            )}

            {isAnalyzing && stage && !isRedirecting && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <AnalysisProgress
                  stage={stage}
                  progress={progress}
                  stageOrder={LINKEDIN_STAGES}
                  onCancel={abort}
                />
              </motion.div>
            )}

            {!isAnalyzing && !isRedirecting && (
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
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">LinkedIn Headline</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Your professional headline from your LinkedIn profile
                    </p>
                  </div>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setHeadline(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="e.g., Senior Software Engineer | Full Stack Developer | Tech Enthusiast"
                    className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  />
                </div>

                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-5 shadow-[var(--shadow-xs)]">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">About Section</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Your about/summary section from your LinkedIn profile
                    </p>
                  </div>
                  <textarea
                    value={aboutSection}
                    onChange={(e) => {
                      setAboutSection(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="Paste your LinkedIn about section here..."
                    className="w-full h-48 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-end pt-1">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAnalyze}
                      disabled={!headline.trim() || !aboutSection.trim()}
                      loading={isAnalyzing}
                      iconRight={<ArrowRightIcon />}
                    >
                      Analyze Profile
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

