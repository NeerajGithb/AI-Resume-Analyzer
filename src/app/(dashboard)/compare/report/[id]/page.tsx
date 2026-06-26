'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { getComparisonById } from '@/services/resumeCompareService';

interface ComparisonResult {
  id: string;
  winner: number;
  verdict: string;
  resume1_score: number;
  resume1_grade: string;
  resume1_strengths: string[];
  resume1_weaknesses: string[];
  resume2_score: number;
  resume2_grade: string;
  resume2_strengths: string[];
  resume2_weaknesses: string[];
  criteria: Array<{
    name: string;
    resume1: number;
    resume2: number;
    notes: string;
  }>;
  file1Name: string;
  file2Name: string;
}

export default function CompareResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : null;

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => getComparisonById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-sm text-[var(--text-muted)]">Loading comparison...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div>
        <div>
          <div className="bg-red-50 border border-red-200 rounded-[var(--radius-lg)] p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-5 h-5 text-red-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">Error Loading Comparison</h3>
                <p className="text-sm text-red-700 mt-1">Could not load this comparison result.</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push('/compare')}>
              Back to Compare
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const winnerName = result.winner === 1 ? 'Resume 1' : result.winner === 2 ? 'Resume 2' : 'Tie';

  return (
    <div>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Resume Comparison Result</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {result.file1Name} vs {result.file2Name}
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/compare')}>
              New Comparison
            </Button>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)] mb-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Winner: {winnerName}</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.verdict}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Resume 1</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">{result.file1Name}</p>
              <p className="text-2xl font-bold text-[var(--accent)] mb-1">{result.resume1_score}%</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">Grade: {result.resume1_grade}</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2">Strengths</p>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                    {result.resume1_strengths.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-2">Weaknesses</p>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                    {result.resume1_weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Resume 2</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">{result.file2Name}</p>
              <p className="text-2xl font-bold text-[var(--accent)] mb-1">{result.resume2_score}%</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">Grade: {result.resume2_grade}</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2">Strengths</p>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                    {result.resume2_strengths.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-2">Weaknesses</p>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                    {result.resume2_weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)] mt-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Comparison Criteria</h3>
            <div className="space-y-3">
              {result.criteria.map((c, i) => (
                <div key={i} className="border-l-2 border-[var(--accent)] pl-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{c.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-[var(--text-muted)]">
                      Resume 1: <strong>{c.resume1}</strong>
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      Resume 2: <strong>{c.resume2}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{c.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
