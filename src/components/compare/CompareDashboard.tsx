'use client';

import { motion } from 'framer-motion';
import { CompareResult, ComparisonCriteria } from '@/types';
import { cn } from '@/lib/utils';

interface CompareDashboardProps {
  result: CompareResult & { id: string };
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
  if (score >= 60) return { ring: '#3b82f6', bg: 'bg-blue-500',    text: 'text-blue-600',    light: 'bg-blue-50',    border: 'border-blue-200'    };
  if (score >= 40) return { ring: '#f59e0b', bg: 'bg-amber-500',   text: 'text-amber-600',   light: 'bg-amber-50',   border: 'border-amber-200'   };
  return               { ring: '#ef4444', bg: 'bg-red-500',     text: 'text-red-600',     light: 'bg-red-50',     border: 'border-red-200'     };
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const c = scoreColor(score);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 116 116">
        <circle cx="58" cy="58" r={r} stroke="#e5e7eb" strokeWidth="10" fill="none" />
        <circle cx="58" cy="58" r={r} stroke={c.ring} strokeWidth="10" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none text-gray-900">{score}</span>
        <span className="text-[9px] text-gray-400 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function SidebarCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm', className)}>{children}</div>;
}

function SidebarLabel({ label }: { label: string }) {
  return <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-4 pb-2">{label}</p>;
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

export function CompareDashboard({ result, onReset }: CompareDashboardProps) {
  const winnerLabel = result.winner === 1 ? 'Resume 1' : result.winner === 2 ? 'Resume 2' : 'Tie';
  const c1 = scoreColor(result.resume1_score);
  const c2 = scoreColor(result.resume2_score);
  const winnerColors = result.winner === 1 ? c1 : result.winner === 2 ? c2 : scoreColor(70);

  return (
    <div className="max-w-[1300px] mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── Left Sidebar ── */}
        <aside className="lg:col-span-2 lg:sticky lg:top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col gap-3">

          {/* Header */}
          <motion.div {...fade(0)} className="mb-2">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1 h-5 rounded-full bg-gray-800" />
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Resume comparison</h1>
            </div>
            <p className="text-xs text-gray-400 pl-3.5 leading-relaxed">
              Side-by-side AI analysis with winner declaration.
            </p>
          </motion.div>

          {/* Winner card */}
          <motion.div {...fade(0)}>
            <SidebarCard>
              <div className="p-4 flex items-center gap-4">
                <div className={cn('w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-2xl font-bold text-white shadow-sm', winnerColors.bg)}>
                  🏆
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Winner</p>
                  <p className="text-xl font-bold text-gray-900">{winnerLabel}</p>
                  <div className={cn('px-2.5 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider inline-block mt-1', winnerColors.light, winnerColors.text)}>
                    {result.winner === 0 ? 'Tie — both equal' : `+${Math.abs(result.resume1_score - result.resume2_score)} pts ahead`}
                  </div>
                </div>
              </div>
            </SidebarCard>
          </motion.div>

          {/* Scores side by side */}
          <motion.div {...fade(0.06)}>
            <SidebarCard>
              <SidebarLabel label="Scores" />
              <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                {([1, 2] as const).map((n) => {
                  const score = n === 1 ? result.resume1_score : result.resume2_score;
                  const grade = n === 1 ? result.resume1_grade : result.resume2_grade;
                  const c = scoreColor(score);
                  const isWinner = result.winner === n;
                  return (
                    <div key={n} className={cn('flex flex-col items-center gap-2 p-3 rounded-sm border', isWinner ? `${c.light} ${c.border}` : 'bg-gray-50 border-gray-200')}>
                      <ScoreRing score={score} size={64} />
                      <p className="text-xs font-bold text-gray-700">Resume {n}</p>
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', c.text, c.light, c.border)}>Grade {grade}</span>
                      {isWinner && result.winner !== 0 && (
                        <span className="text-[9px] font-bold text-white bg-gray-900 px-2 py-0.5 rounded-full">WINNER</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </SidebarCard>
          </motion.div>

          {/* Criteria summary */}
          {result.criteria?.length > 0 && (
            <motion.div {...fade(0.1)}>
              <SidebarCard>
                <SidebarLabel label="Criteria wins" />
                <div className="px-4 pb-4 space-y-2">
                  {[
                    { label: 'Resume 1 wins', count: result.criteria.filter(c => c.winner === 1).length, color: c1.bg },
                    { label: 'Resume 2 wins', count: result.criteria.filter(c => c.winner === 2).length, color: c2.bg },
                    { label: 'Tied criteria', count: result.criteria.filter(c => c.winner === 0).length, color: 'bg-gray-400' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-28 shrink-0">{item.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', item.color)} style={{ width: `${(item.count / result.criteria.length) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-4 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </SidebarCard>
            </motion.div>
          )}

          {/* Reset button */}
          <motion.div {...fade(0.14)}>
            <button onClick={onReset} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-sm border border-gray-200 transition-colors duration-150">
              <IconRefresh /> Compare again
            </button>
          </motion.div>

        </aside>

        {/* ── Right: Main Content ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* Hero verdict card */}
          <motion.div {...fade(0)} className="relative overflow-hidden rounded-xl bg-gray-900 text-white px-8 py-10 shadow-lg">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full', winnerColors.light, winnerColors.text)}>
                  Winner: {winnerLabel}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 leading-tight">AI Comparison Verdict</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{result.verdict}</p>
              <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
                {[
                  { label: 'Resume 1 score', value: `${result.resume1_score}%` },
                  { label: 'Resume 2 score', value: `${result.resume2_score}%` },
                  { label: 'Criteria total', value: result.criteria?.length ?? 0 },
                  { label: 'Score gap', value: `${Math.abs(result.resume1_score - result.resume2_score)}pts` },
                ].map(s => (
                  <div key={s.label} className="bg-white/8 rounded-lg px-4 py-3 text-center border border-white/10">
                    <div className="text-xl font-bold text-white">{s.value}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Side-by-side strengths & weaknesses */}
          <motion.div {...fade(0.1)} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Strengths & Weaknesses</h2>
              <p className="text-xs text-gray-500">What each resume does well and where it falls short</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {([1, 2] as const).map((n) => {
                const strengths  = n === 1 ? result.resume1_strengths  : result.resume2_strengths;
                const weaknesses = n === 1 ? result.resume1_weaknesses : result.resume2_weaknesses;
                const score      = n === 1 ? result.resume1_score      : result.resume2_score;
                const grade      = n === 1 ? result.resume1_grade      : result.resume2_grade;
                const c          = scoreColor(score);
                const isWinner   = result.winner === n;
                return (
                  <div key={n} className={cn('bg-white border rounded-xl p-6 shadow-xs space-y-4', isWinner ? c.border : 'border-gray-200')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">Resume {n}</h3>
                        {isWinner && result.winner !== 0 && (
                          <span className="text-[9px] font-bold text-white bg-gray-900 px-2 py-0.5 rounded-full">WINNER</span>
                        )}
                      </div>
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border', c.text, c.light, c.border)}>
                        {score}% · {grade}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 mb-2">Strengths</p>
                      <ul className="space-y-1.5">
                        {strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-2">Weaknesses</p>
                      <ul className="space-y-1.5">
                        {weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Criteria breakdown */}
          {result.criteria?.length > 0 && (
            <motion.div {...fade(0.15)} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Criteria Breakdown</h2>
                <p className="text-xs text-gray-500">Head-to-head score for each evaluation criterion</p>
              </div>
              {result.criteria.map((c: ComparisonCriteria, i: number) => {
                const maxScore = Math.max(c.resume1_score, c.resume2_score);
                const r1Win = c.resume1_score > c.resume2_score;
                const r2Win = c.resume2_score > c.resume1_score;
                return (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      {c.winner !== 0 && (
                        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                          Resume {c.winner} wins
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 mb-3">
                      {([1, 2] as const).map((n) => {
                        const score = n === 1 ? c.resume1_score : c.resume2_score;
                        const pct = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
                        const isWinner = (n === 1 && r1Win) || (n === 2 && r2Win);
                        const barColor = isWinner ? 'bg-violet-500' : 'bg-gray-300';
                        return (
                          <div key={n} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-16 shrink-0">Resume {n}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={cn('h-full rounded-full transition-all duration-700', barColor)} style={{ width: `${pct}%` }} />
                            </div>
                            <span className={cn('text-xs font-bold w-8 text-right', isWinner ? 'text-violet-700' : 'text-gray-500')}>{score}</span>
                          </div>
                        );
                      })}
                    </div>
                    {c.notes && <p className="text-xs text-gray-500 leading-relaxed border-l-2 border-gray-200 pl-3">{c.notes}</p>}
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <motion.div {...fade(0.2)} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Recommendations</h2>
                <p className="text-xs text-gray-500">How to improve the winning resume further</p>
              </div>
              {result.recommendations.map((rec, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex gap-4">
                  <div className="w-1 self-stretch rounded-full shrink-0 bg-violet-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-white text-[10px] font-bold bg-violet-500">{i + 1}</div>
                </div>
              ))}
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
                <p className="text-xs font-bold text-violet-800 uppercase tracking-wide mb-2">How to use this comparison</p>
                <p className="text-xs text-violet-700 leading-relaxed">
                  Take the winning resume as your base, apply the improvements above, and run another comparison to confirm the changes make a difference.
                </p>
              </div>
            </motion.div>
          )}

          {/* Static tips */}
          <motion.div {...fade(0.25)}>
            <div className="bg-gray-900 text-white rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Pro tip</p>
              <p className="text-sm text-gray-200 leading-relaxed">
                Use the stronger resume as a template. Copy its structure, tone, and keyword density into your weaker version — then run a fresh comparison to verify the improvement.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
