'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { http } from '@/lib/httpClient';

interface CoverLetterResult {
  id: string;
  fileName: string;
  companyName: string;
  tone: string;
  cover_letter: string;
  word_count: number;
  key_highlights: string[];
}

async function fetchCoverLetter(id: string): Promise<CoverLetterResult> {
  const response = await http.get(`/cover-letter/${id}`) as { data: CoverLetterResult };
  return response.data;
}

export default function CoverLetterResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : null;

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['cover-letter', id],
    queryFn: () => fetchCoverLetter(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-sm text-[var(--text-muted)]">Loading cover letter...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !result) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 rounded-[var(--radius-lg)] p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-5 h-5 text-red-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">Error Loading Cover Letter</h3>
                <p className="text-sm text-red-700 mt-1">Could not load this cover letter.</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push('/cover-letter')}>
              Back to Cover Letter Generator
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.cover_letter);
  };

  const handleDownload = () => {
    const blob = new Blob([result.cover_letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${result.companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Generated Cover Letter</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                For {result.companyName} • {result.tone} tone • {result.word_count} words
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/cover-letter')}>
              Generate New Letter
            </Button>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Your Cover Letter</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </Button>
                <Button variant="primary" size="sm" onClick={handleDownload}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </Button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                {result.cover_letter}
              </pre>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Key Highlights</h3>
            <div className="space-y-2">
              {result.key_highlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 text-[var(--accent)] mt-0.5">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-[var(--radius-lg)] p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-5 h-5 text-blue-600 mt-0.5">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Tips for Using Your Cover Letter</h4>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• Customize the opening paragraph with specific details about the company</li>
                  <li>• Review and adjust examples to match your exact experience</li>
                  <li>• Ensure contact information is current and accurate</li>
                  <li>• Proofread carefully before sending</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
