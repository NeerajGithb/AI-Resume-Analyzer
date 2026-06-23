'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FREE_FEATURES = [
  { text: 'ATS Score (0–100) with letter grade', included: true },
  { text: 'Section-by-section scoring', included: true },
  { text: 'Keyword gap analysis (found / missing)', included: true },
  { text: 'AI improvement suggestions (5+ per resume)', included: true },
  { text: 'PDF report export', included: true },
  { text: 'Analysis history (up to 10 entries)', included: true },
  { text: 'No signup required', included: true },
  { text: 'Job description keyword matching', included: false },
  { text: 'LinkedIn profile optimization', included: false },
  { text: 'API access', included: false },
];

const PRO_FEATURES = [
  { text: 'Everything in Free', included: true },
  { text: 'Unlimited analyses', included: true },
  { text: 'Advanced AI rewrite engine', included: true },
  { text: 'Job description keyword matching', included: true },
  { text: 'LinkedIn profile optimization', included: true },
  { text: 'Priority AI processing', included: true },
  { text: 'Unlimited history', included: true },
  { text: 'Team workspace (coming later)', included: true },
  { text: 'REST API access', included: true },
  { text: 'Dedicated support', included: true },
];

function CheckIcon({ ok }: { ok: boolean }) {
  if (ok) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-500 shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-300 shrink-0 mt-0.5">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0b0614 0%, #16062a 60%, #0a0e1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)', top: -150, left: -100 }} />
          <div className="absolute rounded-full opacity-20" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.4), transparent 70%)', bottom: -80, right: -60 }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              💎 Pricing Plans
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              The Free plan gives you everything you need. Upgrade to Pro when you want even more power.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, #f9fafb, transparent)' }} />
      </section>

      {/* Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <FadeUp delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Free Plan</span>
                  <div className="flex items-baseline gap-1 mt-2 mb-2">
                    <span className="text-5xl font-extrabold text-gray-900">$0</span>
                    <span className="text-gray-400">/ forever</span>
                  </div>
                  <p className="text-sm text-gray-500">No credit card. No signup. Start instantly.</p>
                </div>

                <Link href="/analyze" className="block text-center py-3.5 px-6 rounded-xl font-semibold text-violet-700 border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors mb-8">
                  Get Started Free →
                </Link>

                <ul className="space-y-3 flex-1">
                  {FREE_FEATURES.map(({ text, included }) => (
                    <li key={text} className="flex items-start gap-2.5">
                      <CheckIcon ok={included} />
                      <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-300'}`}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Pro */}
            <FadeUp delay={0.2}>
              <div className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden text-white"
                style={{ background: 'linear-gradient(145deg, #4c1d95, #7c3aed 55%, #9333ea 100%)', boxShadow: '0 24px 60px rgba(124,58,237,0.4)' }}>
                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20">Coming Soon</span>
                </div>

                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/60">Pro Plan</span>
                  <div className="flex items-baseline gap-1 mt-2 mb-2">
                    <span className="text-5xl font-extrabold">$9</span>
                    <span className="text-white/60">/ month</span>
                  </div>
                  <p className="text-sm text-white/60">For serious job seekers who want every edge.</p>
                </div>

                <button disabled className="block w-full text-center py-3.5 px-6 rounded-xl font-semibold text-violet-700 bg-white opacity-60 mb-8 cursor-not-allowed">
                  Notify Me When Available
                </button>

                <ul className="space-y-3 flex-1">
                  {PRO_FEATURES.map(({ text, included }) => (
                    <li key={text} className="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-purple-200">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <span className={`text-sm ${included ? 'text-white/90' : 'text-white/40'}`}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          {/* Trust signals */}
          <FadeUp delay={0.3} className="text-center mt-10">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              {['✓ No credit card required', '✓ Free plan is free forever', '✓ Cancel Pro anytime', '✓ Your data stays private'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Full feature comparison</h2>
            <p className="text-gray-500">See exactly what's included in each plan.</p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="border border-gray-100 rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
              {/* Header */}
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 py-4 px-6">
                <div className="text-sm font-semibold text-gray-500">Feature</div>
                <div className="text-sm font-bold text-gray-900 text-center">Free</div>
                <div className="text-sm font-bold text-violet-700 text-center">Pro</div>
              </div>

              {/* Rows */}
              {[
                ['ATS Score & Grade', true, true],
                ['Section Scoring', true, true],
                ['Keyword Gap Analysis', true, true],
                ['AI Improvement Suggestions', '5+ per analysis', 'Unlimited'],
                ['PDF Export', true, true],
                ['Analysis History', '10 entries', 'Unlimited'],
                ['Job Description Matching', false, true],
                ['LinkedIn Optimization', false, true],
                ['Priority Processing', false, true],
                ['API Access', false, true],
              ].map(([feature, freeVal, proVal], i) => (
                <div key={i} className={`grid grid-cols-3 py-4 px-6 border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <div className="text-sm text-gray-700">{feature as string}</div>
                  <div className="text-center">
                    {typeof freeVal === 'boolean'
                      ? <CheckIcon ok={freeVal} />
                      : <span className="text-xs font-medium text-gray-600">{freeVal as string}</span>}
                  </div>
                  <div className="text-center">
                    {typeof proVal === 'boolean'
                      ? <CheckIcon ok={proVal} />
                      : <span className="text-xs font-bold text-violet-600">{proVal as string}</span>}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start improving your resume today</h2>
            <p className="text-gray-500 mb-8">The Free plan is powerful. No signup needed — get results in 30 seconds.</p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-[15px] transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}
            >
              Analyze My Resume Free →
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

