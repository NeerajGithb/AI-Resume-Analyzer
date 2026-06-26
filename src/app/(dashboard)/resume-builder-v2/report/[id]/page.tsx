'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useLatestBuilderV2Query, useBuilderV2ResultQuery } from '@/hooks/useResumeBuilderV2Mutation';
import AppShell from '@/components/layout/AppShell';
import type { BuilderV2Result } from '@/hooks/useResumeBuilderV2Mutation';

// ─── Icons ─────────────────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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

const BUILDER_STAGES = ['uploading', 'analyzing', 'organizing', 'generating'] as const;
const BUILDER_STAGE_META: Record<string, { label: string; desc: string }> = {
  uploading:  { label: 'Uploading',  desc: 'Processing your information' },
  analyzing:  { label: 'Analyzing',  desc: 'Analyzing your profile' },
  organizing: { label: 'Organizing', desc: 'Structuring content sections' },
  generating: { label: 'Generating', desc: 'Creating your resume' },
};

// ─── Resume preview component ───────────────────────────────────────────────
function ResumePreview({ result }: { result: BuilderV2Result }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm font-sans">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-700 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-900">{result.name}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {result.email} | {result.phone}
          {result.location ? ` | ${result.location}` : ''}
        </p>
        {(result.linkedin || result.github || result.leetcode) && (
          <div className="flex justify-center gap-4 mt-2 text-sm flex-wrap">
            {result.linkedin && (
              <a href={result.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {result.github && (
              <a href={result.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                GitHub
              </a>
            )}
            {result.leetcode && (
              <a href={result.leetcode} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                LeetCode
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      <Section title="Professional Summary">
        <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
      </Section>

      {/* Work Experience */}
      {result.experience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-5">
            {result.experience.map((exp, i) => {
              const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              return (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-gray-900">{exp.jobTitle}</span>
                      {exp.employer && (
                        <span className="text-gray-600 text-sm"> — {exp.employer}</span>
                      )}
                    </div>
                    {dates && <span className="text-xs text-gray-500 shrink-0 ml-2">{dates}</span>}
                  </div>
                  {exp.location && (
                    <p className="text-xs text-gray-500 italic">{exp.location}</p>
                  )}
                  {exp.description && (
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700">
                      {exp.description
                        .split('\n')
                        .map((l) => l.replace(/^[•\-]\s*/, '').trim())
                        .filter(Boolean)
                        .map((line, li) => (
                          <li key={li}>{line}</li>
                        ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Education */}
      {result.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-3">
            {result.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-600">
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ''}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                {edu.graduationDate && (
                  <span className="text-xs text-gray-500 shrink-0 ml-2">{edu.graduationDate}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {result.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-4">
            {result.projects.map((project, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-gray-900">{project.name}</span>
                  <span className="text-xs text-gray-500">{project.year}</span>
                </div>
                <p className="text-xs text-gray-500 italic mb-1">{project.technologies}</p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline block mb-1"
                  >
                    {project.url}
                  </a>
                )}
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                  {project.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      <Section title="Skills">
        <div className="space-y-1 text-sm text-gray-700">
          {result.technicalSkills && (
            <p><span className="font-medium">Technical:</span> {result.technicalSkills}</p>
          )}
          {result.softSkills && (
            <p><span className="font-medium">Soft Skills:</span> {result.softSkills}</p>
          )}
          {result.languages && (
            <p><span className="font-medium">Languages:</span> {result.languages}</p>
          )}
        </div>
      </Section>

      {/* Achievements */}
      {result.achievements.length > 0 && (
        <Section title="Achievements">
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            {result.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="font-bold text-base text-blue-900 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wide text-sm">
        {title}
      </h4>
      {children}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function BuilderV2ResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : null;

  // Temp tokens are base64 of "processing:timestamp:random"
  const isTempToken = id ? (() => { try { return atob(id.replace(/-/g,'+').replace(/_/g,'/')).startsWith('processing:'); } catch { return false; } })() : false;

  const { data: cache } = useLatestBuilderV2Query();
  const cacheResult = cache?.result ?? null;
  const cacheError = cache?.error ?? null;

  const { data: apiResult, isLoading, error: apiError } = useBuilderV2ResultQuery(
    isTempToken ? undefined : (id ?? undefined),
  );

  const result = cacheResult ?? apiResult ?? null;
  const error = cacheError ?? apiError ?? null;

  // Once generation completes, replace temp URL with real ID
  useEffect(() => {
    if (isTempToken && result?.id) {
      router.replace(`/resume-builder-v2/report/${result.id}`);
    }
  }, [isTempToken, result?.id, router]);

  const handleGoBack = () => router.push('/resume-builder-v2');

  const handleDownloadPDF = async () => {
    if (!result?.id) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/builder-v2/${result.id}/download`,
      );
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  // Show progress spinner while generating or waiting for result on temp token
  if (isTempToken && !result) {
    return (
      <AppShell>
        <GlobalProgress
          title="Generating Your Resume"
          stages={BUILDER_STAGES}
          stageMeta={BUILDER_STAGE_META}
          stage="generating"
          progress={80}
        />
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 rounded-xl p-12 shadow-sm text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Loading Resume...</h2>
            <p className="text-xs text-gray-500">Please wait while we fetch your results</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Error Loading Resume</h2>
              <p className="text-sm text-gray-600 mt-1">
                {(error as Error)?.message || 'Could not load this resume.'}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Button variant="secondary" size="sm" onClick={handleGoBack}>
                <ArrowLeftIcon /> Go Back
              </Button>
              <Button variant="default" size="sm" onClick={() => router.refresh()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!result) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">No Resume Found</h2>
              <p className="text-sm text-gray-600 mt-1">
                This resume does not exist or has been deleted.
              </p>
            </div>
            <Button variant="default" size="sm" onClick={handleGoBack}>
              <PlusIcon /> Build New Resume
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Success banner */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Resume Generated!</h2>
            <p className="text-sm text-gray-500">
              Your resume for <strong>{result.targetRole}</strong> is ready.
            </p>
          </div>

          {/* Full resume preview */}
          <ResumePreview result={result} />

          {/* Actions */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <DownloadIcon /> Download PDF
            </Button>
            <Button variant="secondary" onClick={handleGoBack} className="flex items-center gap-2">
              <PlusIcon /> Build Another Resume
            </Button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
