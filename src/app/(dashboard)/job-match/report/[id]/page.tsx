'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { http } from '@/lib/httpClient';

interface JobMatchResult {
  id: string;
  match_score: number;
  match_grade: string;
  matched_keywords: string[];
  missing_keywords: string[];
  matched_requirements: string[];
  missing_requirements: string[];
  recommendations: Array<{
    priority: string;
    action: string;
    reason: string;
  }>;
  overall_verdict: string;
  fileName: string;
}

async function fetchJobMatch(id: string): Promise<JobMatchResult> {
  const response = await http.get(`/match/${id}`) as { data: JobMatchResult };
  return response.data;
}

export default function JobMatchResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : null;

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['job-match', id],
    queryFn: () => fetchJobMatch(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-sm text-[var(--text-muted)]">Loading job match results...</p>
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
                <h3 className="text-sm font-semibold text-red-900">Error Loading Results</h3>
                <p className="text-sm text-red-700 mt-1">Could not load this job match result.</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push('/job-match')}>
              Back to Job Match
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Job Match Result</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">{result.fileName}</p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/job-match')}>
              New Match Analysis
            </Button>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Match Score</h2>
                <p className="text-sm text-[var(--text-muted)]">Grade: {result.match_grade}</p>
              </div>
              <div className="text-4xl font-bold text-[var(--accent)]">{result.match_score}%</div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.overall_verdict}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.matched_keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">{kw}</span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md">{kw}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-green-700 mb-3">Matched Requirements</h3>
              <ul className="space-y-2">
                {result.matched_requirements.map((req, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)]">✓ {req}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-red-700 mb-3">Missing Requirements</h3>
              <ul className="space-y-2">
                {result.missing_requirements.map((req, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)]">✗ {req}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recommendations</h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="border-l-2 border-[var(--accent)] pl-4">
                  <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">{rec.priority}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{rec.action}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
