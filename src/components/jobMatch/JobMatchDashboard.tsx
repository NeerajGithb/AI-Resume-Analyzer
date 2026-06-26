'use client';

import { motion } from 'framer-motion';
import { JobMatchResult } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface JobMatchDashboardProps {
  result: JobMatchResult & { id: string };
  onReset: () => void;
}

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' as const, delay },
  };
}

function scoreColor(score: number) {
  if (score >= 80) return { ring: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 60) return { ring: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' };
  if (score >= 40) return { ring: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' };
  return { ring: '#ef4444', bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' };
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Partial Match';
  return 'Weak Match';
}

const PRIORITY_META = {
  high:   { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    bar: 'bg-red-400',    dot: 'bg-red-500'    },
  medium: { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  bar: 'bg-amber-400',  dot: 'bg-amber-500'  },
  low:    { color: 'text-sky-600',    bg: 'bg-sky-50',    border: 'border-sky-200',    bar: 'bg-sky-400',    dot: 'bg-sky-500'    },
};

// Static context — always meaningful, doesn't require AI
function MatchContextBar({ matched, total, label, color }: { matched: number; total: number; label: string; color: string }) {
  const pct = total === 0 ? 0 : Math.round((matched / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-12 text-right">{matched}/{total}</span>
    </div>
  );
}



function SidebarCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm',
      className
    )}>
      {children}
    </div>
  );
}

function SidebarSectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-4 pb-2">{label}</p>
  );
}

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

export function JobMatchDashboard({ result, onReset }: JobMatchDashboardProps) {
  const colors = scoreColor(result.match_score);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (result.match_score / 100) * circumference;

  const totalKeywords = result.matched_keywords.length + result.missing_keywords.length;
  const totalReqs = result.matched_requirements.length + result.missing_requirements.length;
  const keywordPct = totalKeywords === 0 ? 0 : Math.round((result.matched_keywords.length / totalKeywords) * 100);

  const highCount = result.recommendations.filter(r => r.priority === 'high').length;
  const medCount  = result.recommendations.filter(r => r.priority === 'medium').length;

  return (
    <div className="max-w-[1300px] mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── Left Sidebar ── */}
        <aside className="lg:col-span-2 lg:sticky lg:top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col gap-3">
          
          {/* Header */}
          <motion.div {...fade(0)} className="mb-2">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1 h-5 rounded-full bg-gray-800" />
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Job match analysis</h1>
            </div>
            <p className="text-xs text-gray-400 pl-3.5 leading-relaxed">
              Match score, skill coverage, and actionable recommendations.
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div {...fade(0)}>
            <SidebarCard>
              <div className="p-4 flex items-center gap-4">
                {/* Score ring */}
                <div className="relative shrink-0 w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 116 116">
                    <circle cx="58" cy="58" r="52" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                    <circle
                      cx="58" cy="58" r="52"
                      stroke={colors.ring}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold leading-none text-gray-900">{result.match_score}</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">/ 100</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Match quality</p>
                    <div className={cn('px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider inline-block', colors.light, colors.text)}>
                      Grade {result.match_grade} · {scoreLabel(result.match_score)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Skills', value: `${result.matched_keywords.length}/${totalKeywords}` },
                      { label: 'Reqs', value: `${result.matched_requirements.length}/${totalReqs}` },
                      { label: 'Gaps', value: result.missing_keywords.length, highlight: result.missing_keywords.length > 5 },
                      { label: 'Actions', value: result.recommendations.length, highlight: false },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className={cn(
                          'text-base font-bold leading-tight tabular-nums mt-0.5',
                          stat.highlight ? 'text-red-600' : 'text-gray-800'
                        )}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SidebarCard>
          </motion.div>

          {/* Coverage Bars */}
          <motion.div {...fade(0.06)}>
            <SidebarCard>
              <SidebarSectionLabel label="Coverage breakdown" />
              <div className="px-4 pb-4 space-y-2.5">
                <MatchContextBar matched={result.matched_keywords.length} total={totalKeywords} label="Skill coverage" color={colors.bg} />
                <MatchContextBar matched={result.matched_requirements.length} total={totalReqs} label="Requirements met" color="bg-sky-500" />
                <MatchContextBar matched={result.recommendations.filter(r => r.priority !== 'high').length} total={result.recommendations.length} label="Non-critical actions" color="bg-violet-500" />
              </div>
            </SidebarCard>
          </motion.div>

          {/* Priority Actions */}
          {highCount > 0 && (
            <motion.div {...fade(0.1)}>
              <SidebarCard>
                <SidebarSectionLabel label="Priority actions" />
                <div className="px-4 pb-4 space-y-2.5">
                  {result.recommendations.filter(r => r.priority === 'high').slice(0, 3).map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-sm border border-red-200">
                      <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-sm bg-red-500">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-red-900 font-semibold leading-tight mb-0.5">{rec.title}</p>
                        <p className="text-[11px] text-red-700 leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarCard>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div {...fade(0.14)} className="flex flex-col gap-2">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-sm transition-colors duration-150"
            >
              <IconDownload />
              Download match report
            </button>
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-sm border border-gray-200 transition-colors duration-150"
            >
              <IconRefresh />
              Analyze another match
            </button>
          </motion.div>

        </aside>

        {/* ── Right: Main Content ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* Hero Summary Card */}
          <motion.div {...fade(0)} className="relative overflow-hidden rounded-xl bg-gray-900 text-white px-8 py-10 shadow-lg">
            {/* subtle grid texture */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full', colors.light, colors.text)}>
                  {result.match_score}% Match · Grade {result.match_grade}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 leading-tight">AI Match Analysis</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{result.overall_verdict}</p>

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
                {[
                  { label: 'Skills matched', value: `${result.matched_keywords.length}/${totalKeywords}` },
                  { label: 'Reqs met', value: `${result.matched_requirements.length}/${totalReqs}` },
                  { label: 'Gaps to fix', value: result.missing_keywords.length },
                  { label: 'Action items', value: result.recommendations.length },
                ].map(s => (
                  <div key={s.label} className="bg-white/8 rounded-lg px-4 py-3 text-center border border-white/10">
                    <div className="text-xl font-bold text-white">{s.value}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── All Content Sections ── */}
          
          {/* Overview Section */}
          <motion.div {...fade(0.1)} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Overview</h2>
              <p className="text-xs text-gray-500">Match quality and coverage summary</p>
            </div>

          {/* Context callout — static but useful */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '🎯',
                title: 'Skill coverage',
                value: `${keywordPct}%`,
                sub: `${result.matched_keywords.length} of ${totalKeywords} required skills found in your resume`,
                color: colors.text,
              },
              {
                icon: '⚠️',
                title: 'Critical gaps',
                value: highCount,
                sub: `${highCount} high-priority item${highCount !== 1 ? 's' : ''} need attention before applying`,
                color: 'text-red-600',
              },
              {
                icon: '✅',
                title: 'Action plan',
                value: `${medCount + highCount}`,
                sub: `${highCount} high + ${medCount} medium priority improvements identified`,
                color: 'text-amber-600',
              },
            ].map(c => (
              <div key={c.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <div className="text-2xl mb-3">{c.icon}</div>
                <div className={cn('text-3xl font-bold mb-1', c.color)}>{c.value}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{c.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Experience gap callout if present */}
          {result.experience_gap && (
            <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <span className="text-2xl shrink-0">📅</span>
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Experience gap detected</p>
                <p className="text-sm text-amber-700">{result.experience_gap}</p>
                <p className="text-xs text-amber-600 mt-2">Consider emphasising project work and impact metrics in your resume to partially compensate.</p>
              </div>
            </div>
          )}

          {/* Requirements split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Requirements you meet</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {result.matched_requirements.length}
                </span>
              </div>
              <ul className="space-y-2">
                {result.matched_requirements.length === 0 && (
                  <li className="text-xs text-gray-400 italic">None detected</li>
                )}
                {result.matched_requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Requirements you're missing</h3>
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  {result.missing_requirements.length}
                </span>
              </div>
              <ul className="space-y-2">
                {result.missing_requirements.length === 0 && (
                  <li className="text-xs text-gray-400 italic">None — great fit!</li>
                )}
                {result.missing_requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div {...fade(0.15)} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Skills Analysis</h2>
              <p className="text-xs text-gray-500">Matched and missing skills breakdown</p>
            </div>

          {/* Skill breakdown stat */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Skill coverage breakdown</h3>
                <p className="text-xs text-gray-500 mt-0.5">{keywordPct}% of required skills found in your resume</p>
              </div>
              <div className="text-right">
                <span className={cn('text-2xl font-bold', colors.text)}>{keywordPct}%</span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-700', colors.bg)}
                style={{ width: `${keywordPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{result.matched_keywords.length} matched</span>
              <span>{result.missing_keywords.length} missing</span>
            </div>
          </div>

          {/* Matched + Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Matched skills
                <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {result.matched_keywords.length}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mb-4">These appear in both your resume and the job description.</p>
              <div className="flex flex-wrap gap-2">
                {result.matched_keywords.length === 0 && <span className="text-xs text-gray-400 italic">None detected</span>}
                {result.matched_keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Missing skills
                <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  {result.missing_keywords.length}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mb-4">Required by the job but not found in your resume.</p>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.length === 0 && <span className="text-xs text-gray-400 italic">None — full coverage!</span>}
                {result.missing_keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">
                    ✕ {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Static tip — always useful */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Pro tip</p>
            <p className="text-sm text-gray-200 leading-relaxed">
              Missing skills listed above don't always mean you're unqualified. If you have related experience, add a <strong className="text-white">Skills</strong> section to your resume that mirrors the JD's exact phrasing — many ATS systems do exact-match keyword filtering before a human ever reads your resume.
            </p>
          </div>
          </motion.div>

          {/* Recommendations Section */}
          <motion.div {...fade(0.2)} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Recommendations</h2>
              <p className="text-xs text-gray-500">Prioritized action items to improve your match</p>
            </div>
          <div className="flex items-center gap-4 mb-2">
            <p className="text-sm text-gray-500">
              {result.recommendations.length} improvement actions · sorted by priority
            </p>
            <div className="flex gap-2 ml-auto">
              {(['high', 'medium', 'low'] as const).map(p => {
                const count = result.recommendations.filter(r => r.priority === p).length;
                if (!count) return null;
                return (
                  <span key={p} className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full border', PRIORITY_META[p].color, PRIORITY_META[p].bg, PRIORITY_META[p].border)}>
                    {count} {p}
                  </span>
                );
              })}
            </div>
          </div>

          {result.recommendations.map((rec, idx) => {
            const meta = PRIORITY_META[rec.priority];
            return (
              <div key={idx} className={cn('bg-white border rounded-xl p-5 shadow-xs flex gap-4', meta.border)}>
                <div className={cn('w-1 self-stretch rounded-full shrink-0', meta.bar)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border', meta.color, meta.bg, meta.border)}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{rec.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{rec.description}</p>
                </div>
                <div className={cn('w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-white text-[10px] font-bold', meta.bar)}>
                  {idx + 1}
                </div>
              </div>
            );
          })}

          {/* Static guidance block */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 mt-2">
            <p className="text-xs font-bold text-violet-800 uppercase tracking-wide mb-2">How to use this list</p>
            <p className="text-xs text-violet-700 leading-relaxed">
              Tackle high-priority items before applying — these are the gaps most likely to get your resume filtered out.
              Medium items improve your chances in interviews. Low-priority items are nice-to-haves that signal seniority.
            </p>
          </div>
          </motion.div>

          {/* Hiring View Section */}
          <motion.div {...fade(0.25)} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Hiring Manager View</h2>
              <p className="text-xs text-gray-500">How recruiters evaluate your application</p>
            </div>

          {/* Hiring perspective from AI */}
          {result.hiring_perspective && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">HR</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Hiring manager perspective</p>
                  <p className="text-xs text-gray-400">How a recruiter likely views this resume</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4">{result.hiring_perspective}</p>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.strengths && result.strengths.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Your strengths for this role</h3>
                <ul className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-gray-700">{s}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.weaknesses && result.weaknesses.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Weaknesses vs. this role</h3>
                <ul className="space-y-3">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-gray-700">{w}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Static recruiter context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">What recruiters actually look for</p>
              <ul className="space-y-2 text-xs text-gray-600">
                {[
                  'Exact keyword match with the JD in your skills section',
                  'Quantified achievements (not just responsibilities)',
                  'Relevant project titles that mirror the job domain',
                  'Gaps in employment explained or minimised',
                  'Resume length under 2 pages for < 5 years experience',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-300 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ATS survival checklist</p>
              <ul className="space-y-2 text-xs text-gray-600">
                {[
                  'No tables, columns, or text boxes in PDF',
                  'Standard section headers: Experience, Skills, Education',
                  'Skills listed as plain text, not icons or graphics',
                  'File submitted as PDF (unless .docx explicitly asked)',
                  'Each job title followed by company + dates on same line',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-300 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
