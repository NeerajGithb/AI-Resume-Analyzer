'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.93 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const step = target / (duration / 16);
    let cur = 0;
    const t = setInterval(() => { cur = Math.min(cur + step, target); setCount(Math.floor(cur)); if (cur >= target) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Hero score card ─────────────────────────────────────────────────────── */
function HeroScoreCard() {
  return (
    <div className="relative w-[340px] flex-shrink-0">
      <div className="absolute inset-0 blur-3xl opacity-30 rounded-3xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }} />
      <div className="relative rounded-2xl p-6 z-10 glass">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">ATS Analysis</p>
            <p className="text-sm font-semibold text-white leading-snug">Software Engineer Resume</p>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
        </div>
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="url(#sGrad)" strokeWidth="7" strokeLinecap="round" strokeDasharray="175.9" strokeDashoffset="26" transform="rotate(-90 36 36)" />
              <defs><linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[18px] font-bold text-white leading-none">87</span>
              <span className="text-[9px] text-gray-500 mt-0.5">/ 100</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-0.5">Grade <span className="gradient-text">A</span></div>
            <div className="text-xs text-emerald-400 font-medium">✓ ATS Ready</div>
            <div className="text-[11px] text-gray-500 mt-1">Top 15% of resumes</div>
          </div>
        </div>
        <div className="space-y-2.5 mb-5">
          {[{ label: 'Work Experience', score: 92, color: '#34d399' }, { label: 'Skills & Tools', score: 84, color: '#7c3aed' }, { label: 'Keywords', score: 79, color: '#f59e0b' }].map(({ label, score, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 w-28 shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.2, delay: 0.5 }} />
              </div>
              <span className="text-[11px] text-gray-400 w-6 text-right">{score}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Missing Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {['Docker', 'Kubernetes', 'AWS'].map(kw => (
              <span key={kw} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/20">{kw}</span>
            ))}
          </div>
        </div>
      </div>
      <motion.div className="absolute -bottom-10 -right-8 glass rounded-xl p-3 z-20 border border-white/10"
        animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
          </div>
          <div className="whitespace-nowrap">
            <p className="text-[11px] font-semibold text-white">AI Tip</p>
            <p className="text-[11px] text-gray-400">Add "Docker" → +6 pts</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(150deg,#0b0614 0%,#16062a 45%,#0a0e1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full opacity-40" style={{ width: 700, height: 700, background: 'radial-gradient(circle,rgba(124,58,237,0.5),transparent 70%)', top: -200, left: -150, animation: 'orb-float 14s ease-in-out infinite' }} />
        <div className="absolute rounded-full opacity-30" style={{ width: 500, height: 500, background: 'radial-gradient(circle,rgba(236,72,153,0.5),transparent 70%)', top: '25%', right: -100, animation: 'orb-float-2 11s ease-in-out infinite 2s' }} />
        <div className="absolute rounded-full opacity-20" style={{ width: 350, height: 350, background: 'radial-gradient(circle,rgba(59,130,246,0.6),transparent 70%)', bottom: '8%', left: '35%', animation: 'orb-float 18s ease-in-out infinite 5s' }} />
      </div>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-[13px] font-medium mb-8">
              <span className="text-base">✨</span> AI-Powered Resume Analysis
            </div>
          </motion.div>
          <motion.h1 className="text-5xl md:text-6xl xl:text-[68px] font-extrabold text-white leading-[1.08] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Beat ATS Filters.{' '}<span className="gradient-text block mt-1">Land More Interviews.</span>
          </motion.h1>
          <motion.p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            Upload your PDF resume and get an instant ATS score, keyword gap analysis, and AI-powered improvement suggestions in under 30 seconds. Completely free.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-[15px] shadow-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
              Analyze My Resume Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all text-[15px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
              See How It Works
            </a>
          </motion.div>
          <motion.div className="flex flex-wrap gap-5 text-sm text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}>
            {['✓ No signup required', '✓ Results in 30 seconds', '✓ Free forever', '✓ Privacy first'].map(t => (
              <span key={t} className="text-gray-400">{t}</span>
            ))}
          </motion.div>
        </div>
        <motion.div className="hidden lg:flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.88, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          <HeroScoreCard />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none" style={{ background: 'linear-gradient(to top,#f9fafb,transparent)' }} />
    </section>
  );
}

/* ─── Trusted By ─────────────────────────────────────────────────────────── */
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Shopify', 'Airbnb', 'Uber', 'LinkedIn', 'Salesforce'];

function TrustedBySection() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by professionals heading to top companies
        </p>
        <div className="overflow-hidden">
          <div className="marquee-inner">
            {[...COMPANIES, ...COMPANIES].map((name, i) => (
              <span key={i} className="inline-flex items-center mx-6 text-sm font-bold text-gray-300 tracking-wide hover:text-gray-500 transition-colors cursor-default shrink-0">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ value: 50000, suffix: '+', label: 'Resumes Analyzed' }, { value: 94, suffix: '%', label: 'Average Score Boost' }, { value: 4, suffix: '.9★', label: 'User Rating', static: true }, { value: 30, suffix: 's', label: 'Average Analysis Time' }].map(({ value, suffix, label, static: isStatic }, i) => (
            <FadeUp key={label} delay={i * 0.08} className="text-center">
              <div className="text-4xl font-extrabold gradient-text mb-1">
                {isStatic ? `${value}${suffix}` : <AnimatedCounter target={value} suffix={suffix} />}
              </div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '📊', title: 'ATS Score Analysis', desc: 'Instantly know how ATS software rates your resume. Get a 0–100 score with letter grade and a breakdown by section.', bg: '#f5f3ff', color: '#7c3aed' },
  { icon: '🔍', title: 'Keyword Gap Detection', desc: 'Identify missing technical keywords, soft skills, and industry terms that recruiters and ATS systems look for.', bg: '#fff1f2', color: '#ec4899' },
  { icon: '✏️', title: 'AI Improvement Suggestions', desc: 'Get before/after rewrites for every weak section — real suggestions powered by Llama 3.3 you can apply immediately.', bg: '#eff6ff', color: '#2563eb' },
  { icon: '📄', title: 'PDF Report Export', desc: 'Download a professional, shareable PDF report of your full analysis — score, keywords, and all suggestions included.', bg: '#ecfdf5', color: '#059669' },
  { icon: '📋', title: 'Section-Level Scoring', desc: 'Every resume section scored individually — experience, skills, education, summary — so you know exactly what to fix.', bg: '#fff7ed', color: '#ea580c' },
  { icon: '🕒', title: 'Analysis History', desc: 'Track your progress over time. View all past analyses, compare scores, and see how your improvements are paying off.', bg: '#eef2ff', color: '#4f46e5' },
];

function FeaturesSection() {
  return (
    <section className="py-28 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-violet-100 text-violet-700 border border-violet-200">⚡ Powerful Features</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">Everything you need to{' '}<span className="gradient-text">beat the ATS</span></h2>
          <p className="text-lg text-gray-500 leading-relaxed">Our AI analyzes every element of your resume using the same criteria that Fortune 500 ATS systems use.</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc, bg, color }, i) => (
            <FadeUp key={title} delay={i * 0.07}>
              <div className="feature-card bg-white rounded-2xl p-6 border border-gray-100 h-full shadow-[0_4px_28px_rgba(0,0,0,0.07)]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: bg }}>{icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────────────────────── */
const STEPS = [
  { number: '01', title: 'Upload Your Resume', desc: 'Drag and drop your PDF resume or click to browse. We accept any PDF file up to 5MB.', emoji: '📁' },
  { number: '02', title: 'AI Scans Every Detail', desc: 'Our Llama 3.3 AI reads your resume, evaluates ATS compatibility, identifies keyword gaps, and scores each section.', emoji: '🤖' },
  { number: '03', title: 'Get Actionable Results', desc: 'Receive your full report instantly — score, grade, missing keywords, section scores, and specific improvement suggestions.', emoji: '🎯' },
];

function HowItWorksSection() {
  return (
    <section className="py-28 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-emerald-100 text-emerald-700 border border-emerald-200">⏱ 30 Seconds to Results</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">Simple as <span className="gradient-text">1, 2, 3</span></h2>
          <p className="text-lg text-gray-500 leading-relaxed">No signup, no friction. Upload your resume and get a complete analysis in under a minute.</p>
        </FadeUp>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-[54px] left-[33%] right-[33%] h-0.5 step-line" />
          {STEPS.map(({ title, desc, emoji }, i) => (
            <FadeUp key={title} delay={i * 0.15}>
              <div className="relative text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-[108px] h-[108px] rounded-2xl flex items-center justify-center mx-auto text-5xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>{emoji}</div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#ec4899,#f43f5e)' }}>{i + 1}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.4} className="text-center mt-14">
          <Link href="/analyze" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-[15px] transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
            Try It Free — No Signup
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── Results preview ────────────────────────────────────────────────────── */
function ResultsPreviewSection() {
  return (
    <section className="py-28 overflow-hidden" style={{ background: 'linear-gradient(150deg,#0b0614 0%,#16062a 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-white/10 text-purple-300 border border-purple-400/20">🔍 Real Results</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">See exactly what you get</h2>
          <p className="text-lg text-gray-400 leading-relaxed">Every analysis includes a full report with actionable insights you can apply immediately.</p>
        </FadeUp>
        <ScaleIn>
          <div className="glass rounded-3xl p-6 md:p-8 max-w-4xl mx-auto border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400/60" /><div className="w-3 h-3 rounded-full bg-amber-400/60" /><div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              <div className="flex-1 mx-4 h-7 rounded-lg bg-white/8 flex items-center px-3"><span className="text-[11px] text-gray-500">ResuPulse.app/analysis</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 text-center border border-white/8">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">ATS Score</p>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="url(#pGrad)" strokeWidth="9" strokeLinecap="round" strokeDasharray="251.3" strokeDashoffset="40" transform="rotate(-90 48 48)" />
                    <defs><linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">87</span>
                    <span className="text-[9px] text-gray-500">Grade A</span>
                  </div>
                </div>
                <div className="text-xs text-emerald-400 font-medium">✓ ATS Ready</div>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/8">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Keywords Found</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git', 'Agile'].map(kw => (
                    <span key={kw} className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{kw}</span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-3 mb-2">Missing</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'AWS', 'CI/CD'].map(kw => (
                    <span key={kw} className="px-2 py-0.5 rounded-full text-[11px] bg-red-500/15 text-red-400 border border-red-500/20">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/8">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">AI Suggestion</p>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/15">
                    <p className="text-[10px] text-red-400 font-medium mb-1">BEFORE</p>
                    <p className="text-[11px] text-gray-400 leading-snug">"Helped with React projects and fixed bugs"</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                    <p className="text-[10px] text-emerald-400 font-medium mb-1">AFTER</p>
                    <p className="text-[11px] text-gray-300 leading-snug">"Led development of 3 React apps, reducing bug rate by 40%"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </section>
  );
}

/* ─── Comparison table ───────────────────────────────────────────────────── */
function ComparisonSection() {
  const rows = [
    { feature: 'ATS Score (0–100)', ai: true, manual: false, others: '~' },
    { feature: 'Keyword Gap Analysis', ai: true, manual: false, others: false },
    { feature: 'AI Improvement Suggestions', ai: true, manual: false, others: false },
    { feature: 'Section-Level Scoring', ai: true, manual: false, others: '~' },
    { feature: 'Results in 30 Seconds', ai: true, manual: false, others: true },
    { feature: 'PDF Report Export', ai: true, manual: false, others: false },
    { feature: 'Free Forever', ai: true, manual: false, others: false },
    { feature: 'Privacy First (no storage)', ai: true, manual: '~', others: false },
  ];

  const Cell = ({ val }: { val: boolean | string }) => {
    if (val === true) return <span className="text-emerald-600 font-bold text-base">✓</span>;
    if (val === false) return <span className="text-gray-300 text-base">✗</span>;
    return <span className="text-amber-500 text-sm font-medium">~</span>;
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-violet-100 text-violet-700 border border-violet-200">📊 Why ResuPulse?</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ResuPulse vs. the alternatives</h2>
          <p className="text-gray-500">See why thousands of job seekers choose ResuPulse over manual review or paid tools.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-[0_4px_28px_rgba(0,0,0,0.07)] bg-white">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100 py-4 px-6">
              <div className="text-sm font-semibold text-gray-500">Feature</div>
              <div className="text-sm font-bold text-violet-700 text-center">ResuPulse ✨</div>
              <div className="text-sm font-semibold text-gray-500 text-center">Manual Review</div>
              <div className="text-sm font-semibold text-gray-500 text-center">Other Tools</div>
            </div>
            {rows.map(({ feature, ai, manual, others }, i) => (
              <div key={feature} className={`grid grid-cols-4 py-4 px-6 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <div className="text-sm text-gray-700">{feature}</div>
                <div className="text-center"><Cell val={ai} /></div>
                <div className="text-center"><Cell val={manual} /></div>
                <div className="text-center"><Cell val={others} /></div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'I went from getting zero callbacks to landing 4 interviews in 2 weeks after using ResuPulse. The keyword suggestions were spot on.', name: 'Sarah M.', role: 'Software Engineer', company: 'Now at Google', score: { before: 52, after: 91 }, initials: 'SM', color: '#7c3aed' },
  { quote: 'The before/after improvement suggestions are incredible. I had no idea my resume was so vague. One revision and my score jumped 28 points.', name: 'James K.', role: 'Product Manager', company: 'Now at Meta', score: { before: 61, after: 89 }, initials: 'JK', color: '#ec4899' },
  { quote: 'As a career switcher, I needed help. ResuPulse told me exactly which transferable skills to highlight and what language to use.', name: 'Priya R.', role: 'Data Analyst', company: 'Now at Stripe', score: { before: 48, after: 85 }, initials: 'PR', color: '#2563eb' },
];

function TestimonialsSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-amber-100 text-amber-700 border border-amber-200">⭐ Success Stories</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">Real results from <span className="gradient-text">real people</span></h2>
          <p className="text-lg text-gray-500 leading-relaxed">Thousands of professionals have landed their dream jobs using ResuPulse insights.</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, company, score, initials, color }, i) => (
            <FadeUp key={name} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full flex flex-col shadow-[0_4px_28px_rgba(0,0,0,0.07)]">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">"{quote}"</p>
                <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="font-semibold text-red-400 text-xs">{score.before}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  <span className="font-bold text-emerald-600 text-sm">{score.after}</span>
                  <span className="text-[11px] text-gray-400 ml-1">ATS Score</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100">+{score.after - score.before} pts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>{initials}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role} · <span className="text-violet-600 font-medium">{company}</span></p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────────────────────── */
function PricingSection() {
  const FREE = ['ATS Score (0–100) with letter grade', 'Full section-by-section scoring', 'Keyword gap analysis', 'AI improvement suggestions (5+)', 'PDF report download', 'Analysis history (10 entries)', 'No signup required'];
  const PRO = ['Everything in Free', 'Unlimited analyses', 'Advanced AI rewrite engine', 'Job description matching', 'LinkedIn profile optimization', 'Priority AI processing', 'API access', 'Unlimited history'];
  return (
    <section className="py-28 bg-gray-50" id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-violet-100 text-violet-700 border border-violet-200">💎 Simple Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">Start free, <span className="gradient-text">upgrade when ready</span></h2>
          <p className="text-lg text-gray-500 leading-relaxed">The Free plan gives you everything you need to dramatically improve your resume.</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <FadeUp delay={0.1}>
            <div className="border border-gray-200 rounded-2xl p-8 h-full bg-white shadow-[0_4px_28px_rgba(0,0,0,0.07)]">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-extrabold text-gray-900">$0</span><span className="text-gray-400 text-sm">/ forever</span></div>
              <p className="text-sm text-gray-500 mb-6">Everything you need to get started.</p>
              <Link href="/analyze" className="block text-center py-3 px-6 rounded-xl font-semibold text-violet-700 border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors mb-6">Get Started Free</Link>
              <ul className="space-y-3">{FREE.map(f => <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-emerald-500"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>{f}</li>)}</ul>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="rounded-2xl p-8 h-full relative overflow-hidden text-white" style={{ background: 'linear-gradient(145deg,#4c1d95 0%,#7c3aed 50%,#9333ea 100%)', boxShadow: '0 20px 60px rgba(124,58,237,0.4)' }}>
              <div className="absolute top-5 right-5"><span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white">Coming Soon</span></div>
              <h3 className="text-lg font-bold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-extrabold">$9</span><span className="text-white/60 text-sm">/ month</span></div>
              <p className="text-sm text-white/70 mb-6">For serious job seekers.</p>
              <button disabled className="w-full py-3 px-6 rounded-xl font-semibold text-violet-700 bg-white opacity-70 mb-6 cursor-not-allowed">Notify Me When Available</button>
              <ul className="space-y-3">{PRO.map(f => <li key={f} className="flex items-start gap-2.5 text-sm text-white/90"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-purple-200"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>{f}</li>)}</ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────────────── */
function CtaBannerSection() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(150deg,#0b0614 0%,#1e0a33 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: 'radial-gradient(circle,rgba(124,58,237,0.35),transparent 70%)', top: -100, left: -100 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, background: 'radial-gradient(circle,rgba(236,72,153,0.3),transparent 70%)', bottom: -80, right: -80 }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">🚀 Ready to land your dream job?</div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">Your perfect resume is{' '}<span className="gradient-text">30 seconds away</span></h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">Join 50,000+ professionals who have already improved their resumes and landed more interviews. No signup, no credit card, no catch.</p>
          <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)', boxShadow: '0 8px 40px rgba(124,58,237,0.5)' }}>
            Analyze My Resume — Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-500">
            {['✓ No account needed', '✓ Results in 30 seconds', '✓ PDF download included', '✓ 100% private'].map(t => <span key={t} className="text-gray-400">{t}</span>)}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── Page export ────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <TrustedBySection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ResultsPreviewSection />
      <ComparisonSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaBannerSection />
    </div>
  );
}

