'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CoverLetterResult } from '@/types';
import { useCoverLetterVariation } from '@/hooks/useCoverLetterMutation';
import { VariationAction } from '@/services/coverLetterService';

interface Props {
  result: CoverLetterResult;
  onReset: () => void;
}

const VARIATION_ACTIONS: { label: string; value: VariationAction; icon: string }[] = [
  { label: 'Shorter',           value: 'shorten',           icon: 'ti-scissors'   },
  { label: 'More professional', value: 'more_professional', icon: 'ti-briefcase'  },
  { label: 'More confident',    value: 'more_confident',    icon: 'ti-flame'      },
  { label: 'ATS optimized',     value: 'ats_optimized',     icon: 'ti-robot'      },
  { label: 'Friendly',          value: 'more_confident',    icon: 'ti-mood-smile' },
  { label: 'Simplify language', value: 'shorten',           icon: 'ti-text-size'  },
  { label: 'Fix grammar',       value: 'more_professional', icon: 'ti-spellcheck' },
];

const PRIORITY_STYLE: Record<string, { dot: string; badge: string }> = {
  high:   { dot: '#ef4444', badge: 'background:#fef2f2;color:#dc2626' },
  medium: { dot: '#f59e0b', badge: 'background:#fffbeb;color:#b45309' },
  low:    { dot: '#3b82f6', badge: 'background:#eff6ff;color:#1d4ed8' },
};

function scoreColor(score: number) {
  if (score >= 90) return { bar: '#8b5cf6', light: '#f5f3ff', accent: '#7c3aed' };
  if (score >= 75) return { bar: '#3b82f6', light: '#eff6ff', accent: '#1d4ed8' };
  if (score >= 60) return { bar: '#f59e0b', light: '#fffbeb', accent: '#b45309' };
  return               { bar: '#ef4444', light: '#fef2f2', accent: '#b91c1c' };
}

export function CoverLetterDashboard({ result, onReset }: Props) {
  const sc    = scoreColor(result.overall_score);
  const scAts = scoreColor(result.ats_compatibility);

  const { mutate: applyVariation, isPending: isVariationPending, reset: resetVariation } = useCoverLetterVariation(result.id);

  const [activeAction,    setActiveAction]    = useState<VariationAction | null>(null);
  const [variationLetter, setVariationLetter] = useState<string | null>(null);
  const [variationWords,  setVariationWords]  = useState(0);
  const [variationError,  setVariationError]  = useState<string | null>(null);
  const [pendingAction,   setPendingAction]   = useState<typeof VARIATION_ACTIONS[0] | null>(null);
  const [copied,          setCopied]          = useState(false);
  const [dlOpen,          setDlOpen]          = useState(false);
  const dlRef = useRef<HTMLDivElement>(null);

  const displayLetter    = variationLetter ?? result.cover_letter;
  const displayWordCount = variationLetter  ? variationWords : result.word_count;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dlRef.current && !dlRef.current.contains(e.target as Node)) setDlOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleVariation = useCallback((item: typeof VARIATION_ACTIONS[0]) => {
    setPendingAction(item);
  }, []);

  const confirmApply = useCallback(() => {
    if (!pendingAction) return;
    const item = pendingAction;
    setPendingAction(null);
    setActiveAction(item.value);
    setVariationError(null);
    applyVariation(item.value, {
      onSuccess: (data) => { setVariationLetter(data.cover_letter); setVariationWords(data.word_count); },
      onError:   (err)  => { setVariationError(err.message); setActiveAction(null); },
    });
  }, [pendingAction, applyVariation]);

  const revert = () => {
    setVariationLetter(null);
    setActiveAction(null);
    resetVariation();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (ext: string) => {
    setDlOpen(false);
    if (ext === 'pdf') {
      try {
        const safeFilename = `${result.companyName || 'Company'}_${result.jobTitle || 'Cover_Letter'}`.replace(/[^a-z0-9_-]/gi, '_');
        const res = await fetch('/api/cover-letter/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: displayLetter, filename: safeFilename }),
        });
        if (!res.ok) throw new Error('PDF generation failed');
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `${safeFilename}.pdf` });
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
      }
      return;
    }
    // TXT / DOCX — plain text download
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([displayLetter], { type: 'text/plain' })),
      download: `cover-letter.${ext}`,
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const kwTotal = result.job_keywords_used.length + result.job_keywords_missing.length;
  const kwPct   = kwTotal > 0 ? Math.round((result.job_keywords_used.length / kwTotal) * 100) : 0;

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 7,
    border: '1px solid #e5e7eb', background: '#fff', color: '#374151',
    cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui,-apple-system,sans-serif', background: '#f9fafb' }}>

      {/* ── Header ── */}
      <div style={{ height: 48, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <button onClick={onReset} style={{ ...btnBase, border: 'none', background: 'none', color: '#9ca3af', padding: '4px 6px' }}>
            <i className="ti ti-arrow-left" style={{ fontSize: 14 }} aria-hidden="true" />
            Cover letters
          </button>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontWeight: 600 }}>{result.companyName}</span>
          <span style={{ color: '#9ca3af' }}>· {result.jobTitle}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={handleCopy} style={btnBase}>
            <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} style={{ fontSize: 14, color: copied ? '#16a34a' : '#6b7280' }} aria-hidden="true" />
            {copied ? 'Copied' : 'Copy'}
          </button>

          <div ref={dlRef} style={{ position: 'relative' }}>
            <button onClick={() => setDlOpen(v => !v)} style={{ ...btnBase, background: '#111', color: '#fff', border: 'none' }}>
              <i className="ti ti-download" style={{ fontSize: 14 }} aria-hidden="true" />
              Download
            </button>
            {dlOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: 110, zIndex: 20 }}>
                {[['pdf','ti-file-type-pdf'],['docx','ti-file-type-doc'],['txt','ti-file-type-txt']].map(([ext, icon]) => (
                  <button key={ext} onClick={() => handleDownload(ext)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, borderRadius: 5, color: '#374151', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <i className={`ti ${icon}`} style={{ fontSize: 15, color: '#9ca3af' }} aria-hidden="true" />
                    {ext.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Score strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid #e5e7eb', background: '#fff', flexShrink: 0 }}>
        {[
          { label: 'Overall', value: result.overall_score,   bar: sc.bar,    suffix: '/100' },
          { label: 'ATS',     value: result.ats_compatibility, bar: scAts.bar, suffix: '/100' },
        ].map(({ label, value, bar, suffix }) => (
          <div key={label} style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#111', lineHeight: 1.1 }}>
              {value}<span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>{suffix}</span>
            </div>
            <div style={{ height: 2, background: '#f0f0f0', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${value}%`, background: bar, borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
          </div>
        ))}
        <div style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em', marginBottom: 4 }}>Tone</div>
          <span style={{ fontSize: 12, background: '#f0f9ff', color: '#0369a1', padding: '3px 8px', borderRadius: 5, fontWeight: 500, textTransform: 'capitalize' }}>
            {result.tone}
          </span>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em', marginBottom: 2 }}>Words</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#111', lineHeight: 1.1 }}>{displayWordCount}</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {/* Letter pane */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', borderRight: '1px solid #e5e7eb' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={variationLetter ? activeAction ?? 'v' : 'original'}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
                  padding: '32px 40px',
                  fontFamily: 'Georgia,"Times New Roman",serif',
                  fontSize: 14.5, lineHeight: 1.9, color: '#1a1a1a',
                  opacity: isVariationPending ? 0.3 : 1, transition: 'opacity .2s',
                  pointerEvents: isVariationPending ? 'none' : 'auto',
                }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', margin: 0 }}>
                    {displayLetter}
                  </pre>
                </div>
                {isVariationPending && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, border: '2.5px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Applying…</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {variationLetter && !isVariationPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Viewing {activeAction?.replace(/_/g, ' ')} version</span>
              <button onClick={revert} style={{ ...btnBase, fontSize: 12, padding: '3px 10px' }}>
                <i className="ti ti-rotate" style={{ fontSize: 13 }} aria-hidden="true" />
                Revert to original
              </button>
            </motion.div>
          )}

          {variationError && (
            <div style={{ marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
              {variationError}
            </div>
          )}

          {/* ── Refine with AI — inline below letter ── */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#9ca3af', textTransform: 'uppercase' }}>Refine with AI</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {VARIATION_ACTIONS.map((a) => (
                <button
                  key={a.value + a.label}
                  onClick={() => handleVariation(a)}
                  disabled={isVariationPending}
                  style={{
                    ...btnBase,
                    opacity: isVariationPending ? 0.5 : 1,
                    cursor: isVariationPending ? 'not-allowed' : 'pointer',
                    ...(activeAction === a.value && !isVariationPending
                      ? { background: sc.light, color: sc.accent, border: `1px solid ${sc.bar}` }
                      : {}),
                  }}
                >
                  <i className={`ti ${a.icon}`} style={{ fontSize: 14, color: activeAction === a.value ? sc.accent : sc.bar }} aria-hidden="true" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div style={{ width: 256, flexShrink: 0, overflowY: 'auto', padding: '20px 16px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Keywords */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px' }}>Keywords</p>
            <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${kwPct}%`, background: scAts.bar, borderRadius: 2 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {result.job_keywords_used.map((k, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, padding: '2px 7px', borderRadius: 4, background: '#f0fdf4', color: '#15803d' }}>
                  <i className="ti ti-check" style={{ fontSize: 11 }} aria-hidden="true" />{k}
                </span>
              ))}
              {result.job_keywords_missing.map((k, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, padding: '2px 7px', borderRadius: 4, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <i className="ti ti-x" style={{ fontSize: 11 }} aria-hidden="true" />{k}
                </span>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#e5e7eb' }} />

          {/* Suggestions */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px' }}>Suggestions</p>
            {result.improvement_suggestions.map((s, i) => {
              const p = PRIORITY_STYLE[s.priority] ?? PRIORITY_STYLE.low;
              return (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 3, ...Object.fromEntries(p.badge.split(';').map(e => e.split(':'))) }}>
                      {s.priority}
                    </span>
                    <p style={{ fontSize: 12, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{s.suggestion}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: '#e5e7eb' }} />

          {/* Job details */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px' }}>Job details</p>
            {[
              { k: 'Company', v: result.companyName },
              { k: 'Role',    v: result.jobTitle },
              { k: 'Tone',    v: result.tone },
              { k: 'Created', v: result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Today' },
            ].map(({ k, v }) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span style={{ color: '#9ca3af' }}>{k}</span>
                <span style={{ fontWeight: 500, color: '#111', textTransform: 'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Confirm dialog ── */}
      <AnimatePresence>
        {pendingAction && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.14 }}
              style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Replace current letter?</p>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>
                The <strong>{pendingAction.label}</strong> version will replace what's shown. Consider copying first.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setPendingAction(null)} style={btnBase}>Cancel</button>
                <button onClick={confirmApply} style={{ ...btnBase, background: '#111', color: '#fff', border: 'none' }}>Apply</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}