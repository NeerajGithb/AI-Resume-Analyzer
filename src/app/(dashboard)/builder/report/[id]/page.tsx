'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useBuilderStore } from '@/store/builderUIStore';
import { useBuilderResultQuery, useLatestBuilderQuery } from '@/hooks/useBuilderMutation';
import AppShell from '@/components/layout/AppShell';

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}

function EditIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function BuilderResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : null;
  
  const isTempToken = id && id.startsWith('cHJvY2Vzc2luZzo');
  
  const { stage, progress } = useBuilderStore();
  
  const { data: cache } = useLatestBuilderQuery();
  const cacheResult = cache?.result ?? null;
  const cacheError = cache?.error ?? null;
  
  const { data: apiResult, isLoading, error: apiError } = useBuilderResultQuery(
    isTempToken ? undefined : (id ?? undefined)
  );

  const result = cacheResult || apiResult || null;
  const error = cacheError || apiError || null;

  useEffect(() => {
    if (isTempToken && result?.id && !stage) {
      router.replace(`/builder/report/${result.id}`);
    }
  }, [isTempToken, result?.id, stage, router]);

  const handleGoBack = () => router.push('/builder');

  const handleDownloadPDF = async () => {
    if (!result?.id) return;
    
    try {
      // Download PDF directly from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builder/${result.id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const showProgress = stage !== null || (isTempToken && !result);

  const BUILDER_STAGES = ['uploading', 'analyzing', 'organizing', 'generating'] as const;
  const BUILDER_STAGE_META: Record<string, { label: string; desc: string }> = {
    uploading:   { label: 'Uploading',   desc: 'Processing your information' },
    analyzing:   { label: 'Analyzing',   desc: 'Analyzing your profile'  },
    organizing:  { label: 'Organizing',  desc: 'Structuring content sections'     },
    generating:  { label: 'Generating',  desc: 'Creating your resume'     },
  };

  if (isTempToken || showProgress) {
    return (
      <AppShell>
        <GlobalProgress
          title="Generating Your Resume"
          stages={BUILDER_STAGES}
          stageMeta={BUILDER_STAGE_META}
          stage={stage}
          progress={progress}
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
              <AlertIcon />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Error Loading Resume</h2>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {(error as Error)?.message || 'Could not load this resume. It may have been deleted or never saved.'}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Button variant="secondary" size="sm" onClick={handleGoBack}>
                <ArrowLeftIcon />
                Go Back
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
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                This resume does not exist or has been deleted.
              </p>
            </div>
            <Button variant="default" size="sm" onClick={handleGoBack}>
              Generate New Resume
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Success Header */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Resume Generated Successfully!</h2>
            <p className="text-[var(--text-muted)]">Your professional resume is ready to download</p>
          </div>

          {/* Resume Preview */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-center border-b pb-4">{result.name}</h3>
            
            {/* Contact Info */}
            <div className="text-center mb-6 text-sm space-y-1">
              <div>{result.email} | {result.phone}</div>
              {result.location && <div>{result.location}</div>}
              <div className="flex justify-center gap-4 mt-2 flex-wrap">
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
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2 border-b pb-1">Professional Summary</h4>
              <p className="text-sm text-gray-700">{result.summary}</p>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2 border-b pb-1">Education</h4>
              <div>
                <div className="font-semibold">{result.degree}</div>
                <div className="text-sm text-gray-600">{result.institution}</div>
                {result.graduationYear && <div className="text-sm text-gray-500">{result.graduationYear}</div>}
              </div>
            </div>

            {/* Projects */}
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-3 border-b pb-1">Projects</h4>
              <div className="space-y-4">
                {result.projects.map((project: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.year}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{project.technologies}</div>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mb-1 block">
                        {project.url}
                      </a>
                    )}
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                      {project.bullets.map((bullet: string, bulletIdx: number) => (
                        <li key={bulletIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2 border-b pb-1">Technical Skills</h4>
              <p className="text-sm text-gray-700">{result.skills}</p>
            </div>

            {/* Achievements */}
            {result.achievements && result.achievements.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-2 border-b pb-1">Achievements</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                  {result.achievements.map((achievement: string, idx: number) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <DownloadIcon />
              Download PDF
            </Button>
            <Button variant="secondary" onClick={handleGoBack} className="flex items-center gap-2">
              <EditIcon />
              Edit & Generate New
            </Button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
