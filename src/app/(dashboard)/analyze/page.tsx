'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { DropZone } from '@/components/upload/DropZone';
import { Button } from '@/components/ui/Button';
import { AnalysisProgress } from '@/components/analysis/AnalysisProgress';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { useAnalyzeMutation } from '@/hooks/useAnalysisMutation';
import { STAGE_ORDER } from '@/lib/constants';

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ScoreIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function KeyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>;
}
function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}
const EXPERIENCE_OPTIONS = [
  { value: 'internship', label: 'Internship' },
  { value: 'fresher', label: 'Fresher (0 years)' },
  { value: '0-1', label: '0-1 year' },
  { value: '1-2', label: '1-2 years' },
  { value: '2-3', label: '2-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-7', label: '5-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10-15', label: '10-15 years' },
  { value: '15+', label: '15+ years' },
];

const ROLE_OPTIONS = [
  // Software & Engineering
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Data Engineer', label: 'Data Engineer' },
  { value: 'Mobile Developer', label: 'Mobile Developer' },
  { value: 'QA Engineer', label: 'QA Engineer' },
  { value: 'Security Engineer', label: 'Security Engineer' },
  { value: 'Cloud Architect', label: 'Cloud Architect' },
  
  // Data & AI
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
  { value: 'AI Engineer', label: 'AI Engineer' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  
  // Product & Design
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Product Designer', label: 'Product Designer' },
  { value: 'UX Designer', label: 'UX Designer' },
  { value: 'UI Designer', label: 'UI Designer' },
  { value: 'UX Researcher', label: 'UX Researcher' },
  
  // Marketing & Sales
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  { value: 'Digital Marketing Specialist', label: 'Digital Marketing Specialist' },
  { value: 'Content Writer', label: 'Content Writer' },
  { value: 'SEO Specialist', label: 'SEO Specialist' },
  { value: 'Sales Manager', label: 'Sales Manager' },
  { value: 'Account Manager', label: 'Account Manager' },
  
  // Operations & Finance
  { value: 'Operations Manager', label: 'Operations Manager' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Scrum Master', label: 'Scrum Master' },
  { value: 'Financial Analyst', label: 'Financial Analyst' },
  { value: 'Accountant', label: 'Accountant' },
  
  // HR & Administration
  { value: 'HR Manager', label: 'HR Manager' },
  { value: 'Recruiter', label: 'Recruiter' },
  { value: 'Administrative Assistant', label: 'Administrative Assistant' },
  
  // Customer Support
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Customer Success Manager', label: 'Customer Success Manager' },
  { value: 'Technical Support', label: 'Technical Support' },
];

function ArrowRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}

export default function AnalyzePage() {
  const router = useRouter();
  const { file, setFile, stage, progress } = useAnalysisStore();
  const { mutate: analyze, isPending: isAnalyzing, error, abort } = useAnalyzeMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const handleAnalyze = () => {
    if (!file) {
      return; // Error will show in DropZone component
    }
    analyze({ 
      file, 
      yearsOfExperience: yearsOfExperience || undefined,
      targetRole: targetRole || undefined 
    }, {
      onSuccess: (data) => {
        setIsRedirecting(true);
        if (data.id) {
          router.push(`/analyze/report/${data.id}`);
        } else {
          router.push('/analyze/report');
        }
      },
    });
  };

  return (
    <AppShell>
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              AI-Powered Resume Analysis
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Upload your resume and get an instant ATS score, keyword gap analysis, and personalized improvement suggestions.
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
                  stageOrder={STAGE_ORDER}
                  onCancel={abort}
                />
              </motion.div>
            )}

            {!isAnalyzing && !isRedirecting && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Upload Card */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-5 shadow-[var(--shadow-xs)]">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Upload Resume</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">PDF format, max 5 MB</p>
                  </div>

                  <DropZone
                    file={file}
                    onFile={setFile}
                    disabled={isAnalyzing}
                    error={error?.message ?? null}
                  />
                </div>

                {/* Additional Information Card */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-5 shadow-[var(--shadow-xs)]">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Additional Information</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Help us provide better analysis</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="years-experience" className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                        Years of Experience
                      </label>
                      <select
                        id="years-experience"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="">Select experience level</option>
                        {EXPERIENCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="target-role" className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                        Target Role <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                      </label>
                      <select
                        id="target-role"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="">Select target role</option>
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-[var(--text-subtle)]">
                      {file ? 'Ready to analyze' : 'No file selected'}
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAnalyze}
                      disabled={!file}
                      loading={isAnalyzing}
                      iconRight={<ArrowRightIcon />}
                      id="analyze-button"
                    >
                      Analyze Resume
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
                  <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                    What you get
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FeatureItem icon={<ScoreIcon />} title="ATS Score" desc="0–100 compatibility score with animated ring visualization and letter grade." />
                    <FeatureItem icon={<KeyIcon />} title="Keyword Analysis" desc="Find missing technical, soft skill, and industry keywords." />
                    <FeatureItem icon={<EditIcon />} title="Improvements" desc="Before/after rewrites for at least 5 sections with explanations." />
                    <FeatureItem icon={<DownloadIcon />} title="PDF Report" desc="Download a full analysis report as a PDF for sharing or reference." />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
  );
}

