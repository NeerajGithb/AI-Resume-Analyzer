'use client';

import { motion } from 'framer-motion';
import { CoverLetterResult } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CoverLetterDashboardProps {
  result: CoverLetterResult;
  onReset: () => void;
}

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any, delay },
  };
}

function scoreColor(score: number) {
  if (score >= 90) return { label: 'Excellent', accent: '#6d28d9', light: '#f5f3ff', ring: '#7c3aed' };
  if (score >= 75) return { label: 'Strong',    accent: '#1d4ed8', light: '#eff6ff', ring: '#2563eb' };
  if (score >= 60) return { label: 'Good',      accent: '#b45309', light: '#fffbeb', ring: '#d97706' };
  return               { label: 'Fair',         accent: '#b91c1c', light: '#fef2f2', ring: '#dc2626' };
}

// Thin horizontal meter — no card, just a line
function Meter({ label, value, accent = '#111' }: { label: string; value: number; accent?: string }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: accent }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-600 tabular-nums w-8 text-right">{value}</span>
    </div>
  );
}

function ScoreArc({ score }: { score: number }) {
  const sc = scoreColor(score);
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  // Only draw 270deg arc (from 135deg to 405deg)
  const startAngle = 135 * (Math.PI / 180);
  const totalArc = 270 * (Math.PI / 180);
  const fraction = score / 100;
  const endAngle = startAngle + totalArc;

  function arcPath(start: number, end: number) {
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }
  const fillEnd = startAngle + totalArc * fraction;

  return (
    <div className="relative" style={{ width: 128, height: 128 }}>
      <svg viewBox="0 0 128 128" width="128" height="128">
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke="#f0f0f0" strokeWidth="8" strokeLinecap="round" />
        <path d={arcPath(startAngle, fillEnd)} fill="none" stroke={sc.ring} strokeWidth="8" strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 8 }}>
        <span className="text-3xl font-black text-gray-900 leading-none">{score}</span>
        <span className="text-[10px] font-semibold mt-1" style={{ color: sc.accent }}>{sc.label}</span>
      </div>
    </div>
  );
}

const PRIORITY = {
  high:   { color: '#dc2626', bg: '#fef2f2', label: 'High priority' },
  medium: { color: '#d97706', bg: '#fffbeb', label: 'Medium' },
  low:    { color: '#2563eb', bg: '#eff6ff', label: 'Low' },
};

export function CoverLetterDashboard({ result, onReset }: CoverLetterDashboardProps) {
  const [copied, setCopied] = useState(false);
  const sc = scoreColor(result.overall_score);
  const kwTotal = result.job_keywords_used.length + result.job_keywords_missing.length;

  function copy() {
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPDF() {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Cover Letter — ${result.companyName}</title>
      <style>body{font-family:Georgia,serif;max-width:720px;margin:64px auto;padding:0 40px;font-size:15px;line-height:1.85;color:#111}pre{white-space:pre-wrap;font-family:inherit;font-size:inherit;line-height:inherit}</style>
      </head><body><pre>${result.cover_letter.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  }

  function downloadTXT() {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([result.cover_letter], { type: 'text/plain' })),
      download: `cover-letter-${result.companyName.replace(/\s+/g,'-').toLowerCase()}.txt`,
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>

      {/* ── Top nav strip ── */}
      <motion.div {...fade(0)} style={{
        background: '#fff', borderBottom: '1px solid #f0f0f0',
        padding: '0 32px', display: 'flex', alignItems: 'center', gap: 16, height: 56,
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <button onClick={onReset} style={{
          display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#888',
          background:'none', border:'none', cursor:'pointer', padding:'4px 0',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Cover letters
        </button>
        <span style={{ color: '#ddd' }}>/</span>
        <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{result.companyName}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={copy} style={{
            fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8,
            background: copied ? '#f0fdf4' : '#111', color: copied ? '#16a34a' : '#fff',
            border: 'none', cursor: 'pointer', transition: 'all .2s',
          }}>
            {copied ? '✓ Copied' : 'Copy text'}
          </button>
          <button onClick={downloadPDF} style={{
            fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 8,
            background: '#f5f5f5', color: '#444', border: '1px solid #e5e5e5', cursor: 'pointer',
          }}>Download PDF</button>
          <button onClick={downloadTXT} style={{
            fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 8,
            background: '#f5f5f5', color: '#444', border: '1px solid #e5e5e5', cursor: 'pointer',
          }}>Export TXT</button>
        </div>
      </motion.div>

      {/* ── Score banner — thin, elegant ── */}
      <motion.div {...fade(0.05)} style={{
        background: '#fff', borderBottom: '1px solid #f0f0f0',
        padding: '28px 32px 24px', display: 'flex', alignItems: 'center', gap: 40,
      }}>
        <ScoreArc score={result.overall_score} />

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 6 }}>
            Cover letter quality
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'ATS compatible', value: result.ats_compatibility },
              { label: 'Tone', value: result.professional_tone_score },
              { label: 'Personalization', value: result.personalization_score },
              { label: 'Readability', value: result.readability_score },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#111', lineHeight: 1 }}>{m.value}
                  <span style={{ fontSize: 11, color: '#bbb', fontWeight: 400 }}>/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter verdict pill */}
        <div style={{
          background: sc.light, borderRadius: 12, padding: '14px 20px', minWidth: 160, textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: sc.accent, textTransform: 'uppercase', marginBottom: 4 }}>
            Recruiter verdict
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: sc.accent }}>
            {result.recruiter_review.overall_impression}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
            {result.tone} · {result.word_count}w
          </div>
        </div>
      </motion.div>

      {/* ── Main: letter left, analysis right ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, maxWidth: 1280, margin: '0 auto' }}>

        {/* ════ LEFT: The actual letter ════ */}
        <div style={{ padding: '40px 40px 40px 32px', borderRight: '1px solid #f0f0f0' }}>

          {/* Letter as a document — not in a card box */}
          <motion.div {...fade(0.1)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>
                Your cover letter
              </h2>
              <span style={{ fontSize: 11, color: '#bbb' }}>{result.word_count} words · {result.tone}</span>
            </div>

            {/* The letter itself — paper-like */}
            <div style={{
              background: '#fff',
              border: '1px solid #e8e8e8',
              borderRadius: 12,
              padding: '48px 52px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 15,
              lineHeight: 1.9,
              color: '#1a1a1a',
              letterSpacing: '0.01em',
            }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', margin: 0, color: 'inherit' }}>
                {result.cover_letter}
              </pre>
            </div>
          </motion.div>

          {/* ── Why it works — no card, just inline section ── */}
          <motion.div {...fade(0.15)} style={{ marginTop: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 16 }}>
              Why this works
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {result.effectiveness_reasons.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
                  background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: sc.light,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke={sc.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Resume mapping — horizontal flow ── */}
          <motion.div {...fade(0.2)} style={{ marginTop: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 16 }}>
              Resume → cover letter
            </div>
            {result.resume_to_cover_letter_mapping.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid #f5f5f5',
              }}>
                <span style={{ fontSize: 13, color: '#555', flex: 1 }}>{m.resume_section}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: sc.accent, background: sc.light,
                  padding: '3px 8px', borderRadius: 4,
                }}>¶ {m.cover_letter_paragraph}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Resume evidence chips ── */}
          <motion.div {...fade(0.25)} style={{ marginTop: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 12 }}>
              Resume evidence used
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {result.resume_claims_used.map((c, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '5px 11px', borderRadius: 20,
                  background: '#f5f5f5', color: '#444', border: '1px solid #ebebeb',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6 5 9 10 3" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ════ RIGHT: Analysis panel — NOT cards, just sections with dividers ════ */}
        <div style={{ padding: '40px 28px', background: '#fafafa' }}>

          {/* Keyword coverage */}
          <motion.div {...fade(0.1)}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase' }}>
                Keywords
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
                {result.job_keywords_used.length}/{kwTotal} <span style={{ fontSize: 11, fontWeight: 400, color: '#bbb' }}>matched</span>
              </span>
            </div>
            <div style={{ height: 4, background: '#ebebeb', borderRadius: 2, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{
                height: '100%', background: sc.accent, borderRadius: 2,
                width: `${result.keywords_coverage_percentage}%`, transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {result.job_keywords_used.map((k, i) => (
                <span key={i} style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 4,
                  background: '#111', color: '#fff',
                }}>{k}</span>
              ))}
            </div>
            {result.job_keywords_missing.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.job_keywords_missing.map((k, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 4,
                    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                  }}>{k}</span>
                ))}
              </div>
            )}
          </motion.div>

          <div style={{ height: 1, background: '#ebebeb', margin: '28px 0' }} />

          {/* All scores — clean meters */}
          <motion.div {...fade(0.15)}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 12 }}>
              Scores
            </div>
            {[
              { label: 'Overall', v: result.overall_score, accent: sc.accent },
              { label: 'ATS compatibility', v: result.ats_compatibility },
              { label: 'Professional tone', v: result.professional_tone_score },
              { label: 'Personalization', v: result.personalization_score },
              { label: 'Grammar', v: result.grammar_score },
              { label: 'Readability', v: result.readability_score },
              { label: 'Conciseness', v: result.conciseness_score },
            ].map(m => (
              <Meter key={m.label} label={m.label} value={m.v} accent={m.accent || '#555'} />
            ))}
          </motion.div>

          <div style={{ height: 1, background: '#ebebeb', margin: '28px 0' }} />

          {/* Tone breakdown */}
          <motion.div {...fade(0.2)}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 12 }}>
              Tone
            </div>
            {[
              { label: 'Professional',    v: result.tone_analysis.professional },
              { label: 'Confidence',      v: result.tone_analysis.confidence },
              { label: 'Enthusiasm',      v: result.tone_analysis.enthusiasm },
              { label: 'Personalization', v: result.tone_analysis.personalization },
              { label: 'Clarity',         v: result.tone_analysis.clarity },
            ].map(m => (
              <Meter key={m.label} label={m.label} value={m.v} />
            ))}
          </motion.div>

          <div style={{ height: 1, background: '#ebebeb', margin: '28px 0' }} />

          {/* Recruiter feedback — editorial blockquote */}
          <motion.div {...fade(0.25)}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 14 }}>
              Recruiter view
            </div>
            <div style={{
              borderLeft: `3px solid ${sc.accent}`, paddingLeft: 14, borderRadius: 0,
            }}>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                "{result.recruiter_review.feedback}"
              </p>
            </div>
          </motion.div>

          <div style={{ height: 1, background: '#ebebeb', margin: '28px 0' }} />

          {/* Suggestions — no cards, just annotated list */}
          <motion.div {...fade(0.3)}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 14 }}>
              Suggestions
            </div>
            {result.improvement_suggestions.map((s, i) => {
              const p = PRIORITY[s.priority];
              return (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '10px 0',
                  borderBottom: '1px solid #f5f5f5',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: p.color,
                    flexShrink: 0, marginTop: 6,
                  }} />
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                        background: p.bg, color: p.color,
                      }}>{p.label}</span>
                      <span style={{ fontSize: 10, color: '#bbb' }}>{s.estimated_impact}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#555', margin: 0, lineHeight: 1.6 }}>{s.suggestion}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Missing opportunities */}
          {result.missing_opportunities.length > 0 && (
            <>
              <div style={{ height: 1, background: '#ebebeb', margin: '28px 0' }} />
              <motion.div {...fade(0.35)}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 14 }}>
                  Could also mention
                </div>
                {result.missing_opportunities.map((o, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    padding: '8px 0', borderBottom: '1px solid #f5f5f5',
                  }}>
                    <span style={{ fontSize: 12, color: '#555' }}>{o}</span>
                    <button style={{
                      fontSize: 10, fontWeight: 700, color: sc.accent, background: sc.light,
                      border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer',
                    }}>Add</button>
                  </div>
                ))}
              </motion.div>
            </>
          )}

          <div style={{ height: 1, background: '#ebebeb', margin: '28px 0' }} />

          {/* Generate variations */}
          <motion.div {...fade(0.4)}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: 12 }}>
              Try a variation
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Formal', 'Friendly', 'Concise', 'Detailed', 'Startup', 'Executive'].map(s => (
                <button key={s} style={{
                  fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 6,
                  background: '#fff', color: '#444', border: '1px solid #e5e5e5',
                  cursor: 'pointer', transition: 'border-color .15s, background .15s',
                }}>{s}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}