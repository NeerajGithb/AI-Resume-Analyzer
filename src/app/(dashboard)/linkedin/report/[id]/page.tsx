'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { getLinkedInById } from '@/services/linkedinService';

interface LinkedInResult {
  id: string;
  overall_score: number;
  grade: string;
  completeness: number;
  section_scores: Array<{
    section: string;
    score: number;
    status: string;
    feedback: string;
  }>;
  strengths: string[];
  improvements: string[];
  keyword_optimization: {
    current_keywords: string[];
    suggested_keywords: string[];
  };
  headline_suggestions: string[];
}

export default function LinkedInResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : null;

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['linkedin', id],
    queryFn: () => getLinkedInById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-sm text-[var(--text-muted)]">Loading LinkedIn analysis...</p>
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
                <h3 className="text-sm font-semibold text-red-900">Error Loading Analysis</h3>
                <p className="text-sm text-red-700 mt-1">Could not load this LinkedIn analysis.</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push('/linkedin')}>
              Back to LinkedIn Optimizer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'text-green-700 bg-green-50';
      case 'good':
        return 'text-blue-700 bg-blue-50';
      case 'needs improvement':
        return 'text-orange-700 bg-orange-50';
      case 'poor':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">LinkedIn Profile Analysis</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Optimization Report & Recommendations
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/linkedin')}>
              New Analysis
            </Button>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Overall Score</h2>
                <p className="text-sm text-[var(--text-muted)]">Grade: {result.grade}</p>
              </div>
              <div className="text-4xl font-bold text-[var(--accent)]">{result.overall_score}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[var(--accent)] h-2 rounded-full transition-all"
                style={{ width: `${result.completeness}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Profile Completeness: {result.completeness}%
            </p>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Section Scores</h3>
            <div className="space-y-3">
              {result.section_scores.map((section, i) => (
                <div key={i} className="border-l-2 border-[var(--accent)] pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{section.section}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{section.score}%</span>
                      <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(section.status)}`}>
                        {section.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{section.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-green-700 mb-4">Strengths</h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="shrink-0 w-4 h-4 text-green-600 mt-0.5">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
              <h3 className="text-sm font-semibold text-orange-700 mb-4">Areas for Improvement</h3>
              <ul className="space-y-2">
                {result.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="shrink-0 w-4 h-4 text-orange-600 mt-0.5">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Keyword Optimization</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Current Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_optimization.current_keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Suggested Keywords to Add</p>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_optimization.suggested_keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-xs)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Headline Suggestions</h3>
            <div className="space-y-3">
              {result.headline_suggestions.map((headline, i) => (
                <div key={i} className="border-l-2 border-[var(--accent)] pl-4">
                  <p className="text-sm text-[var(--text-secondary)]">{headline}</p>
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
                <h4 className="text-sm font-semibold text-blue-900">Next Steps</h4>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• Update your profile with the suggested keywords</li>
                  <li>• Improve sections marked as "Needs Improvement"</li>
                  <li>• Consider using one of the suggested headlines</li>
                  <li>• Re-analyze your profile after making changes</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
