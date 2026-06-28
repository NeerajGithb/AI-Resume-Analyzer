'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import {
  BenefitSection,
  HowItWorksSection,
  FAQSection,
  CTASection,
  WhatYouGetSection,
} from '@/components/landing';

const LI_LOGO = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ── Static profile card preview (mirrors resume builder's ModernResumePage) ───
function LinkedInProfilePreview() {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden font-sans">
      {/* Banner */}
      <div className="h-20 bg-linear-to-r from-blue-500 to-cyan-500" />
      {/* Avatar */}
      <div className="px-5 pb-4 relative">
        <div className="w-16 h-16 rounded-full border-4 border-white shadow-md -mt-8 flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50">
          JS
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base font-bold text-gray-900">Jane Smith</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
              {LI_LOGO} Open to Work
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium">Senior Full Stack Engineer · React · Node.js · AWS</p>
          <p className="text-[11px] text-gray-400 mt-0.5">San Francisco Bay Area · 500+ connections</p>
        </div>
        {/* Score badge */}
        <div className="absolute top-2 right-4 flex flex-col items-center bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <span className="text-xl font-extrabold text-emerald-600">92</span>
          <span className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wide">Score</span>
        </div>
      </div>
      {/* Divider */}
      <div className="h-px bg-gray-100 mx-5" />
      {/* Keywords */}
      <div className="px-5 py-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Keywords Coverage</p>
        <div className="flex flex-wrap gap-1.5">
          {['React','TypeScript','Node.js','AWS','PostgreSQL','Docker'].map(k => (
            <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{k}</span>
          ))}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium line-through">Kubernetes</span>
        </div>
      </div>
      {/* Suggestions */}
      <div className="px-5 py-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Top Actions</p>
        {[
          { dot: '#ef4444', text: 'Add measurable achievements to Experience' },
          { dot: '#f59e0b', text: 'Strengthen About with a call-to-action' },
          { dot: '#3b82f6', text: 'Add 3 missing industry keywords' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.dot }} />
            <span className="text-xs text-gray-600">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LinkedInPage() {
  const router = useRouter();
  const go = () => router.push('/linkedin/optimize');

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

        {/* ── Hero ── */}
        <section className="py-12 bg-linear-to-br from-blue-50 via-white to-cyan-50">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 md:px-20">

              {/* Left: Hero */}
              <div className="flex-1 lg:pr-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  AI-Powered LinkedIn Optimizer
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Build a LinkedIn Profile That{' '}
                  <span className="relative inline-block">
                    <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Gets You Found
                    </span>
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full" />
                  </span>
                </h1>

                <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-lg">
                  Upload your resume or paste your profile — get an AI-powered score, keyword gaps, section-by-section feedback, and ready-to-use content in 30 seconds.
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {[
                    { value: '30s',    label: 'Analysis time'     },
                    { value: 'A–F',    label: 'Grade + score'     },
                    { value: '3 paths',label: 'Resume, optimize, build' },
                    { value: 'Free',   label: 'No hidden costs'   },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-baseline gap-1.5">
                      <span className="font-bold text-gray-900">{stat.value}</span>
                      <span className="text-gray-400">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <button
                    onClick={go}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <span>Optimize My LinkedIn</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:translate-x-0.5 transition-transform duration-200">
                      →
                    </span>
                  </button>
                  <p className="text-xs text-gray-400 pl-1">No signup required · 100% free</p>
                </div>
              </div>

              {/* Right: Profile card preview */}
              <div className="lg:pl-4 flex items-start justify-center lg:justify-end">
                <LinkedInProfilePreview />
              </div>

            </div>
          </div>
        </section>

        <WhatYouGetSection
          title="What You Get"
          description="A complete LinkedIn audit + content generation powered by AI"
          features={[
            { icon: '📊', title: 'Profile Score & Grade',    desc: 'A–F grade with 0–100 score and section-by-section breakdown.',   highlight: 'A–F Grade'    },
            { icon: '🔍', title: 'Keyword Gap Analysis',     desc: 'Keywords you have vs. ones recruiters actively search for.',      highlight: 'Gap Detection' },
            { icon: '✍️', title: 'Headline Rewrite',         desc: 'AI-optimized headline if yours needs improvement.',               highlight: 'AI Rewrite'   },
            { icon: '📝', title: 'Generated About Section',  desc: 'Full About section written from your resume or inputs.',          highlight: 'Generated'    },
            { icon: '🎯', title: 'Priority Action Items',    desc: 'High/medium/low ranked fixes — most impactful first.',            highlight: 'Ranked Fixes' },
            { icon: '💬', title: 'Summary Feedback',         desc: 'Detailed critique of your About section narrative.',             highlight: 'Deep Feedback' },
          ]}
          ctaTitle="Ready to Stand Out?"
          ctaDescription="Paste your LinkedIn content and get instant AI analysis — completely free."
          primaryAction={{ label: 'Optimize Now', onClick: go }}
        />

        <BenefitSection
          title="Why Optimize Your LinkedIn?"
          description="95% of recruiters use LinkedIn to find candidates — make sure they find you"
          benefits={[
            { icon: '🎯', title: 'Get Found by Recruiters',    description: 'LinkedIn ranks profiles with keyword-rich headlines and summaries higher in search results.' },
            { icon: '📊', title: 'Know Your Exact Score',      description: 'Understand where your profile stands vs. top performers in your field.' },
            { icon: '🔍', title: 'Close Keyword Gaps',         description: 'Discover the keywords missing from your profile that recruiters search for.' },
            { icon: '✍️', title: 'Better First Impression',    description: 'Your headline is the first thing recruiters see — make it count.' },
            { icon: '🚀', title: 'More Inbound Opportunities', description: 'Optimized profiles get 5× more profile views and recruiter messages.' },
            { icon: '🔒', title: 'Private & Secure',           description: 'Your data is processed securely and never shared or used for AI training.' },
          ]}
        />

        <HowItWorksSection
          title="Optimized in 3 Simple Steps"
          description="From paste to actionable insights in under 30 seconds"
          steps={[
            { number: '1', title: 'Tell us what you have',    description: 'Upload a resume, paste existing LinkedIn sections, or fill in your details from scratch.' },
            { number: '2', title: 'AI analyzes & generates', description: 'Our AI scores every section, finds keyword gaps, and generates ready-to-use content.' },
            { number: '3', title: 'Apply the fixes',         description: 'Copy your new headline, About section, and follow the ranked action items.' },
          ]}
        />

        <FAQSection
          title="Frequently Asked Questions"
          description="Everything about LinkedIn optimization"
          faqs={[
            { question: 'Do I need a resume to use this?',         answer: 'No — you can paste existing LinkedIn sections, or fill in your info from scratch. A resume gives the best results.' },
            { question: 'What gets generated?',                    answer: 'Depending on your path: a headline, About section, Experience bullets, and Skills list — all ready to copy into LinkedIn.' },
            { question: 'Will this improve recruiter visibility?', answer: 'Yes. Adding the suggested keywords directly improves how often you appear in recruiter searches.' },
            { question: 'Is my data safe?',                        answer: 'Your content is sent over HTTPS and used only for this analysis. Never stored permanently or shared.' },
          ]}
        />

        <CTASection
          badge="🚀 Get found by more recruiters"
          title="Optimize Your LinkedIn Profile in 30 Seconds"
          description="Free AI analysis. No signup required."
          primaryAction={{ label: 'Optimize My LinkedIn Now', onClick: go }}
          features={['100% Free', 'No Signup', 'Instant Results', 'Privacy Guaranteed']}
        />

      </motion.div>
    </AppShell>
  );
}
