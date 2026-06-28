'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/upload/DropZone';
import { Button } from '@/components/ui/Button';
import {
  BenefitSection,
  HowItWorksSection,
  FeatureGrid,
  FAQSection,
  CTASection,
  WhatYouGetSection,
} from '@/components/landing';
import { useCompareStore } from '@/store/compareUIStore';
import { useCompareMutation } from '@/hooks/useCompareMutation';
import AppShell from '@/components/layout/AppShell';

export default function ComparePage() {
  const router = useRouter();
  const { resume1, resume2, setResume1, setResume2, setResumes } = useCompareStore();
  const { mutate: compare, isPending: isComparing, error } = useCompareMutation();

  const handleCompare = () => {
    if (!resume1 || !resume2 || isComparing) return;

    setResumes(resume1, resume2);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const tempToken = btoa(`comparing:${timestamp}:${random}`)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    router.push(`/compare/report/${tempToken}`);

    compare(
      { resume1, resume2 },
      {
        onSuccess: (data) => {
          if (!data?.id) return;
          router.replace(`/compare/report/${data.id}`);
        },
      }
    );
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {!isComparing && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Hero + Upload Split Layout ── */}
            <section className="py-12 bg-gradient-to-br from-violet-50 via-white to-pink-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                  {/* Left: Hero Content */}
                  <div className="lg:pr-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                      Compare Two Resumes{' '}
                      <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        Side by Side
                      </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Upload two resumes and get an instant AI-powered comparison — scores, strengths, weaknesses, and a clear winner declared in seconds.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                      {[
                        { value: '20K+', label: 'Compared' },
                        { value: '95%', label: 'Accuracy' },
                        { value: '20s', label: 'Avg Time' },
                        { value: '4.9★', label: 'Rating' },
                      ].map((stat, index) => (
                        <div key={stat.label} className="flex items-center gap-1">
                          <span className="font-bold text-violet-700">{stat.value}</span>
                          <span className="text-gray-600">{stat.label}</span>
                          {index < 3 && <span className="text-gray-300 ml-3">|</span>}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white border-2 border-violet-100 rounded-lg p-6 space-y-4">
                      <h3 className="text-base font-bold text-gray-900">What You'll Get:</h3>
                      <ul className="space-y-2.5">
                        {[
                          'Head-to-head score with letter grades',
                          'Strengths & weaknesses for each resume',
                          'Criteria-by-criteria breakdown',
                          'Clear winner with AI verdict',
                          'Actionable recommendations',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: Upload Form */}
                  <div className="lg:pl-4">
                    <div className="bg-white border border-gray-200 rounded-sm shadow-xl overflow-hidden sticky top-20">

                      {/* Card header */}
                      <div className="px-6 pt-6 pb-0">
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">Compare Resumes</h2>
                            <p className="text-[11px] text-gray-500">Free · Instant · No signup needed</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-5 space-y-5">
                        {/* Resume 1 */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Resume 1
                          </label>
                          <DropZone
                            file={resume1}
                            onFile={setResume1}
                            disabled={isComparing}
                            error={error?.message ?? null}
                          />
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-gray-100" />
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">vs</span>
                          <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        {/* Resume 2 */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Resume 2
                          </label>
                          <DropZone
                            file={resume2}
                            onFile={setResume2}
                            disabled={isComparing}
                          />
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {resume1 && resume2 ? (
                            <>
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-emerald-700 truncate">Ready to compare</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Upload both resumes to compare</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {(resume1 || resume2) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setResume1(null); setResume2(null); }}
                              disabled={isComparing}
                            >
                              Clear
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="default"
                            onClick={handleCompare}
                            disabled={!resume1 || !resume2 || isComparing}
                          >
                            {isComparing ? 'Comparing...' : 'Compare Resumes →'}
                          </Button>
                        </div>
                      </div>

                      {/* Privacy & Security */}
                      <div className="border-t border-zinc-200/80 bg-zinc-50/60 px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                            <svg className="h-4 w-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium tracking-tight text-zinc-900">Your data stays private</p>
                              <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                                Secure
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              We process your resumes securely for analysis only.
                              Never shared, sold, or used for AI training.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ── What You Get ── */}
            <WhatYouGetSection
              title="What You Get"
              description="Comprehensive resume comparison powered by advanced AI in seconds"
              features={[
                {
                  icon: '⚡',
                  title: 'Lightning Fast Comparison',
                  desc: 'Get your full resume comparison in under 20 seconds. Instant results powered by advanced AI technology.',
                  highlight: 'Under 20s',
                },
                {
                  icon: '🏆',
                  title: 'Clear Winner Declared',
                  desc: 'No ambiguity — our AI declares a clear winner with a detailed verdict explaining the decision.',
                  highlight: 'Winner Verdict',
                },
                {
                  icon: '📊',
                  title: 'Side-by-Side Scores',
                  desc: 'Both resumes scored 0–100 with letter grades across multiple criteria. See exactly where each stands.',
                  highlight: 'Dual Scoring',
                },
                {
                  icon: '🔍',
                  title: 'Criteria Breakdown',
                  desc: 'Detailed analysis across key criteria: ATS compatibility, keywords, experience, formatting, and more.',
                  highlight: 'Multi-Criteria',
                },
                {
                  icon: '✅',
                  title: 'Strengths & Weaknesses',
                  desc: 'Both resumes get a full list of strengths and weaknesses so you know what to keep and what to fix.',
                  highlight: 'Full Analysis',
                },
                {
                  icon: '💡',
                  title: 'Actionable Recommendations',
                  desc: 'Get specific improvement tips for both resumes. Know exactly what to change to win the comparison.',
                  highlight: 'Actionable Tips',
                },
                {
                  icon: '📈',
                  title: 'Competitive Edge Insights',
                  desc: 'Understand what separates the winning resume — and apply those insights to make your resume the best.',
                  highlight: 'Edge Analysis',
                },
                {
                  icon: '🔄',
                  title: 'Compare Multiple Versions',
                  desc: 'Test different resume versions against each other to iterate and improve. Perfect for version control.',
                  highlight: 'Version Testing',
                },
                {
                  icon: '🔒',
                  title: '100% Private & Secure',
                  desc: 'Both resumes are encrypted and never shared. GDPR compliant with zero data retention.',
                  highlight: 'GDPR Safe',
                },
              ]}
              ctaTitle="Ready to Find the Better Resume?"
              ctaDescription="Upload two resumes and get a complete comparison instantly — completely free!"
              primaryAction={{ label: 'Compare Now', onClick: scrollToTop }}
            />

            {/* ── Benefits ── */}
            <BenefitSection
              title="Why Compare Resumes with AI?"
              description="Stop guessing which version is better — let the data decide"
              benefits={[
                {
                  icon: '🏆',
                  title: 'Know Which Resume Wins',
                  description: 'Get a clear winner with an AI verdict in under 20 seconds. No more guessing — let data drive your decision.',
                },
                {
                  icon: '📊',
                  title: 'Objective Scoring',
                  description: 'Both resumes scored on the same criteria: ATS compatibility, keywords, experience, formatting, and content quality.',
                },
                {
                  icon: '🔍',
                  title: 'Criteria Breakdown',
                  description: 'See exactly which criteria each resume wins and loses on. Understand the specific gaps between the two versions.',
                },
                {
                  icon: '✏️',
                  title: 'Targeted Improvements',
                  description: 'Get specific recommendations for each resume. Know exactly what to change to make your resume the clear winner.',
                },
                {
                  icon: '🚀',
                  title: 'Iterate Faster',
                  description: 'Test multiple resume versions quickly. Find what works and what doesn\'t — refine your resume with data, not guesses.',
                },
                {
                  icon: '🔒',
                  title: 'Private & Secure',
                  description: 'Both resumes are encrypted and never shared with third parties. GDPR compliant.',
                },
              ]}
            />

            {/* ── How It Works ── */}
            <HowItWorksSection
              title="Get Your Comparison in 3 Simple Steps"
              description="From upload to winner declaration in under 20 seconds"
              steps={[
                {
                  number: '1',
                  title: 'Upload Resume 1',
                  description: 'Drag and drop or click to browse your first PDF resume. Max 5 MB.',
                },
                {
                  number: '2',
                  title: 'Upload Resume 2',
                  description: 'Add the second resume you want to compare against — could be another version or a different candidate.',
                },
                {
                  number: '3',
                  title: 'Get Your Comparison',
                  description: 'Receive a full side-by-side report with scores, a winner verdict, criteria breakdown, and recommendations.',
                },
              ]}
            />

            {/* ── Feature Grid ── */}
            <FeatureGrid
              title="Comprehensive Comparison Features"
              description="Everything you need to find the stronger resume"
              features={[
                { icon: '🏆', title: 'Winner Declaration', description: 'Clear AI verdict on which resume is stronger with detailed reasoning.' },
                { icon: '📊', title: 'Dual Scoring (0-100)', description: 'Both resumes receive a score and grade across multiple weighted criteria.' },
                { icon: '📋', title: 'Criteria Breakdown', description: 'See which resume wins on ATS, keywords, experience, formatting, and more.' },
                { icon: '✅', title: 'Strengths Analysis', description: 'Know what each resume does well — and keep those elements in your final version.' },
                { icon: '⚠️', title: 'Weakness Detection', description: 'Find what\'s holding each resume back. Prioritized list of things to fix.' },
                { icon: '💡', title: 'Recommendations', description: 'Specific, actionable tips for improving each resume based on the comparison.' },
                { icon: '🔄', title: 'Version Testing', description: 'Perfect for testing v1 vs v2 of your resume or comparing two candidates.' },
                { icon: '⚡', title: 'Instant Results', description: 'Complete comparison in under 20 seconds — no waiting, no delays.' },
                { icon: '🔒', title: 'Fully Private', description: 'Both resumes encrypted and never shared. GDPR compliant.', badge: 'Secure' },
              ]}
              columns={3}
            />

            {/* ── FAQ ── */}
            <FAQSection
              title="Frequently Asked Questions"
              description="Everything you need to know about resume comparison"
              faqs={[
                {
                  question: 'How does the resume comparison work?',
                  answer: 'Our AI analyzes both resumes across multiple criteria including ATS compatibility, keyword density, experience presentation, formatting, and content quality. It scores each resume 0–100 and declares a winner with a detailed verdict explaining the decision.',
                },
                {
                  question: 'What should I compare — two versions of my resume or two different people?',
                  answer: 'Both! You can compare different versions of your own resume to see which performs better, or compare your resume against a competitor\'s (anonymized) resume to understand where you stand.',
                },
                {
                  question: 'Is my data safe when I upload two resumes?',
                  answer: 'Absolutely. Both resumes are encrypted during upload and analysis. We never store your files permanently or share your data with third parties. All processing is GDPR compliant.',
                },
                {
                  question: 'What if both resumes are very similar?',
                  answer: 'Our AI is designed to detect even subtle differences. It will still identify which resume has better keyword coverage, formatting, quantified achievements, and structure — even when the content is similar.',
                },
                {
                  question: 'Can I compare resumes from different industries?',
                  answer: 'Yes, you can compare any two PDF resumes regardless of industry. The comparison is based on universal resume quality factors that apply across all fields.',
                },
                {
                  question: 'How many comparisons can I run?',
                  answer: 'As many as you like — resume comparison is completely free with no limits. Run multiple comparisons to iterate and find the strongest version of your resume.',
                },
              ]}
            />

            {/* ── CTA ── */}
            <CTASection
              badge="🏆 Ready to find the better resume?"
              title="Find Out Which Resume Wins"
              description="Join thousands of job seekers who use our comparison tool to perfect their resumes. No signup, no credit card, instant results."
              primaryAction={{ label: 'Compare Resumes Now', onClick: scrollToTop }}
              features={['100% Free Forever', 'No Credit Card Required', 'Instant Results', 'Privacy Guaranteed']}
            />

          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
