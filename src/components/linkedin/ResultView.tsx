'use client';

import { ChevronLeft } from 'lucide-react';
import type { LinkedInResult } from '@/types';
import { CopyBlock } from './ui';

interface Props { result: LinkedInResult; onReset: () => void; }

const PRIORITY_DOT: Record<string, string> = {
  high:   'bg-red-400',
  medium: 'bg-amber-400',
  low:    'bg-blue-400',
};
const PRIORITY_BADGE: Record<string, string> = {
  high:   'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-700',
  low:    'bg-blue-50 text-blue-600',
};

const MODE_LABEL: Record<string, string> = {
  resume:  'Generated from your resume',
  build:   'Generated from your profile info',
  analyze: 'Analysis of your sections',
};

const SECTION_LABEL: Record<string, string> = {
  generated_headline:   'Headline',
  generated_about:      'About',
  generated_experience: 'Experience',
  generated_skills:     'Skills',
};

export function ResultView({ result, onReset }: Props) {
  const kwTotal = result.keywords_found.length + result.keywords_missing.length;
  const kwPct   = kwTotal > 0 ? Math.round((result.keywords_found.length / kwTotal) * 100) : 0;

  const generatedKeys = (['generated_headline', 'generated_about', 'generated_experience', 'generated_skills'] as const)
    .filter(k => (result as any)[k]?.trim());

  const sectionRewrites = (result as any).section_rewrites as Array<{
    section: string; score: number; status: string; feedback: string; rewritten: string; original?: string;
  }> | undefined;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Your LinkedIn content</h1>
          <p className="text-xs text-gray-400 mt-0.5">{MODE_LABEL[result.mode] ?? ''}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Start over
        </button>
      </div>



      {/* Body */}
      <div className="flex min-h-0">

        {/* LEFT — main content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 border-r border-gray-200 space-y-6">

          {/* resume / build — generated content */}
          {generatedKeys.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Ready to copy</p>
              {generatedKeys.map(k => (
                <div key={k}>
                  <CopyBlock label={SECTION_LABEL[k]} content={(result as any)[k]} />
                  {k === 'generated_headline' && (result as any).headline_reasoning && (
                    <div className="mt-2 mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-1">
                        Why this headline works
                      </p>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        {(result as any).headline_reasoning}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* analyze — per-section score + rewrite */}
          {sectionRewrites && sectionRewrites.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Section analysis & rewrites</p>
              {sectionRewrites.map((s, i) => {
                return (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center px-5 py-3 border-b border-gray-100 bg-gray-50">
                      <span className="text-sm font-semibold text-gray-900 capitalize">{s.section}</span>
                    </div>
                    <div className="px-5 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 leading-relaxed">{s.feedback}</p>
                    </div>
                    {s.original && s.original.trim() && (
                      <div className="px-5 py-3 border-b border-gray-100 bg-red-50/40">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-red-400 mb-2">Your original</p>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{s.original.trim()}</p>
                      </div>
                    )}
                    <div className="px-5 py-3">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-emerald-500 mb-2">Rewritten — ready to copy</p>
                      <CopyBlock label={s.section} content={s.rewritten} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {result.summary_feedback && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Overall take</p>
              <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3">{result.summary_feedback}</p>
            </div>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="w-72 shrink-0 overflow-y-auto px-5 py-6 space-y-4">

          {/* Keywords */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Keywords</p>
              <span className="text-xs font-semibold text-gray-700">{result.keywords_found.length}/{kwTotal}</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${kwPct}%` }} />
            </div>
            {result.keywords_found.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {result.keywords_found.map((k, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">{k}</span>
                ))}
              </div>
            )}
            {result.keywords_missing.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Add these</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords_missing.map((k, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100 font-medium">{k}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Strengths</p>
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600 leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action items */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Action items</p>
            {result.improvements.map((imp, i) => (
              <div key={i} className="flex gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${PRIORITY_DOT[imp.priority] ?? 'bg-gray-300'}`} />
                <div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded inline-block mb-1 ${PRIORITY_BADGE[imp.priority] ?? 'bg-gray-50 text-gray-500'}`}>
                    {imp.section}
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">{imp.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}