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
import { useJobMatchStore } from '@/store/jobMatchUIStore';
import { useJobMatchMutation } from '@/hooks/useJobMatchMutation';
import AppShell from '@/components/layout/AppShell';

export default function JobMatchPage() {
  const router = useRouter();
  const { resume, jobDescription, setResume, setJobDescription } = useJobMatchStore();
  const { mutate: matchJob, isPending: isMatching, error } = useJobMatchMutation();

  const handleMatch = () => {
    if (!resume || !jobDescription.trim() || isMatching) return;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const payload = btoa(`matching:${timestamp}:${random}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const tempToken = payload;

    router.push(`/job-match/report/${tempToken}`);

    matchJob(
      { resume, jobDescription },
      {
        onSuccess: (data) => {
          if (!data?.id) return;
          router.replace(`/job-match/report/${data.id}`);
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
        {!isMatching && (
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
                      Match Your Resume to{' '}
                      <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        Any Job Description
                      </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Get instant match scores, see exactly which keywords and requirements you meet, and discover what's missing — all powered by AI in seconds.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                      {[
                        { value: '30K+', label: 'Jobs Matched' },
                        { value: '92%', label: 'Match Accuracy' },
                        { value: '15s', label: 'Average Time' },
                        { value: '4.8★', label: 'User Rating' },
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
                          'Match Score (0-100) with letter grade',
                          'Matched vs Missing keywords analysis',
                          'Requirements coverage breakdown',
                          'Prioritized recommendations',
                          'AI-powered improvement tips',
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
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">Match Your Resume</h2>
                            <p className="text-[11px] text-gray-500">Free · Instant · No signup needed</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-5 space-y-5">
                        {/* Drop Zone */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Upload Resume
                          </label>
                          <DropZone
                            file={resume}
                            onFile={setResume}
                            disabled={isMatching}
                            error={error?.message ?? null}
                          />
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-gray-100" />
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Job Description</span>
                          <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        {/* Job Description */}
                        <div>
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            disabled={isMatching}
                            className="w-full h-48 px-4 py-3 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {resume && jobDescription.trim() ? (
                            <>
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-emerald-700 truncate">Ready to match</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Upload resume and paste job description</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {(resume || jobDescription) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setResume(null);
                                setJobDescription('');
                              }}
                              disabled={isMatching}
                            >
                              Clear
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="default"
                            onClick={handleMatch}
                            disabled={!resume || !jobDescription.trim() || isMatching}
                          >
                            {isMatching ? 'Matching...' : 'Analyze Match →'}
                          </Button>
                        </div>
                      </div>

                      {/* Privacy & Security */}
                      <div className="border-t border-zinc-200/80 bg-zinc-50/60 px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                            <svg
                              className="h-4 w-4 text-zinc-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium tracking-tight text-zinc-900">
                                Your data stays private
                              </p>
                              <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                                Secure
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              We process your data securely for analysis only.
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
              description="Comprehensive job match analysis powered by advanced AI in seconds"
              features={[
                {
                  icon: '⚡',
                  title: 'Lightning Fast Matching',
                  desc: 'Get your complete job match analysis in under 15 seconds. No waiting, no delays — instant results powered by advanced AI technology.',
                  highlight: 'Under 15s',
                },
                {
                  icon: '🎯',
                  title: 'Precise Match Score',
                  desc: 'Receive a precise 0-100 match score with a letter grade showing exactly how well your resume aligns with the job description requirements.',
                  highlight: '0-100 Score',
                },
                {
                  icon: '🔤',
                  title: 'Keyword Gap Analysis',
                  desc: 'See exactly which keywords from the job description your resume has and which are missing. Prioritized by importance so you know what to add first.',
                  highlight: 'Gap Detection',
                },
                {
                  icon: '📋',
                  title: 'Requirements Coverage',
                  desc: 'Get a breakdown of how well you meet each requirement — must-haves, nice-to-haves, and qualifications. Know exactly where you stand before applying.',
                  highlight: 'Full Breakdown',
                },
                {
                  icon: '✏️',
                  title: 'Tailoring Suggestions',
                  desc: 'Get specific recommendations on how to tailor your resume for this exact role. Before/after examples show exactly how to rewrite sections for maximum impact.',
                  highlight: 'Before/After',
                },
                {
                  icon: '💡',
                  title: 'Priority Action Items',
                  desc: 'A ranked list of the top changes to make to your resume for this specific job. Focus on what moves the needle most and improve your match score fast.',
                  highlight: 'Top Fixes',
                },
                {
                  icon: '📊',
                  title: 'Skill Match Breakdown',
                  desc: 'Detailed analysis of technical skills, soft skills, certifications, and experience requirements. Understand exactly how your profile compares to what is needed.',
                  highlight: 'Skill Mapping',
                },
                {
                  icon: '🚀',
                  title: 'Interview Readiness',
                  desc: 'Know if you should apply before submitting. Our match score and insights help you decide whether to tailor, skip, or apply immediately with confidence.',
                  highlight: 'Apply Smarter',
                },
                {
                  icon: '🔒',
                  title: '100% Private & Secure',
                  desc: 'Your resume and job description are encrypted and never shared with third parties. We respect your privacy and comply with GDPR standards.',
                  highlight: 'GDPR Safe',
                },
              ]}
              ctaTitle="Ready to Find Your Perfect Match?"
              ctaDescription="Paste any job description and get your match score instantly — completely free!"
              primaryAction={{
                label: 'Match Now',
                onClick: scrollToTop,
              }}
            />

            {/* ── Benefits ── */}
            <BenefitSection
              title="Why Use Job Match Analysis?"
              description="Stop guessing whether to apply — know your match score before you submit"
              benefits={[
                {
                  icon: '🎯',
                  title: 'Know Before You Apply',
                  description:
                    'See your match score instantly and decide whether to tailor your resume or move on. Stop wasting time on applications where you are under-qualified.',
                },
                {
                  icon: '📊',
                  title: 'Instant Match Score',
                  description:
                    'Get a 0–100 compatibility score in 15 seconds. See how your resume ranks against the specific job description with a detailed requirements breakdown.',
                },
                {
                  icon: '🔍',
                  title: 'Keyword Gap Analysis',
                  description:
                    'Discover exactly which keywords and skills from the job posting your resume is missing. Add the right terms to pass ATS filters for that specific role.',
                },
                {
                  icon: '✏️',
                  title: 'Role-Specific Tailoring',
                  description:
                    'Get tailoring suggestions specific to this job description with before/after rewrites. Every recommendation is targeted to the exact role you are applying for.',
                },
                {
                  icon: '🚀',
                  title: 'Land More Interviews',
                  description:
                    'Users who tailor resumes using our match analysis report 3x more callbacks. Know exactly what to change and make every application count.',
                },
                {
                  icon: '🔒',
                  title: 'Private & Secure',
                  description:
                    'Your resume and job description data is encrypted and never shared. We respect your privacy and comply with GDPR standards.',
                },
              ]}
            />

            {/* ── How It Works ── */}
            <HowItWorksSection
              title="Get Your Match Score in 3 Simple Steps"
              description="From upload to insights in under 15 seconds"
              steps={[
                {
                  number: '1',
                  title: 'Upload Your Resume',
                  description:
                    'Drag and drop your PDF resume or click to browse. Maximum file size 5 MB. Supports all standard resume formats.',
                },
                {
                  number: '2',
                  title: 'Paste the Job Description',
                  description:
                    'Copy and paste the full job description — requirements, responsibilities, and qualifications. The more detail, the more accurate your match score.',
                },
                {
                  number: '3',
                  title: 'Get Your Match Report',
                  description:
                    'Receive your match score, keyword gaps, requirements coverage, and tailored recommendations. Know exactly how to improve before you apply.',
                },
              ]}
            />

            {/* ── Feature Grid ── */}
            <FeatureGrid
              title="Comprehensive Match Analysis Features"
              description="Everything you need to tailor your resume for any job"
              features={[
                {
                  icon: '📈',
                  title: 'Match Score (0-100)',
                  description:
                    'Get a precise compatibility score showing how well your resume aligns with the specific job description requirements and preferred qualifications.',
                },
                {
                  icon: '🔤',
                  title: 'Keyword Matching',
                  description:
                    'See which keywords from the job description you already have and which are missing — prioritized by how frequently they appear in the posting.',
                },
                {
                  icon: '📋',
                  title: 'Requirements Coverage',
                  description:
                    'Detailed breakdown of must-have vs nice-to-have requirements and how many you currently meet. Know your strengths and gaps at a glance.',
                },
                {
                  icon: '✏️',
                  title: 'Tailoring Suggestions',
                  description:
                    'Role-specific recommendations with before/after rewrites showing exactly how to align your experience with what this employer is looking for.',
                },
                {
                  icon: '💡',
                  title: 'Priority Action Items',
                  description:
                    'Ranked list of the top changes to make for this specific job. Focus on high-impact edits that will move your match score the most.',
                },
                {
                  icon: '🎯',
                  title: 'Skill Gap Report',
                  description:
                    'Identify technical skills, certifications, and soft skills required by the role that are absent from your resume — with suggestions on how to address them.',
                },
                {
                  icon: '📊',
                  title: 'Experience Alignment',
                  description:
                    'See how your work history maps to the role requirements. Understand which achievements to highlight and how to frame your experience for this job.',
                },
                {
                  icon: '⚡',
                  title: 'Real-Time Processing',
                  description:
                    'Lightning-fast analysis powered by advanced AI. Get comprehensive match results in under 15 seconds — no waiting.',
                },
                {
                  icon: '🔒',
                  title: 'Fully Private',
                  description:
                    'Your resume and job description are encrypted and never shared or stored beyond your session. GDPR compliant.',
                  badge: 'Secure',
                },
              ]}
              columns={3}
            />

            {/* ── FAQ ── */}
            <FAQSection
              title="Frequently Asked Questions"
              description="Everything you need to know about job match analysis"
              faqs={[
                {
                  question: 'How does the job match score work?',
                  answer:
                    'Our AI compares your resume against the job description across multiple dimensions: keyword alignment, skills coverage, experience requirements, and qualifications match. The 0-100 score reflects how closely your resume matches what the employer is looking for. A score above 70 generally means you are a strong candidate worth applying.',
                },
                {
                  question: 'Should I paste the entire job description?',
                  answer:
                    'Yes — paste the full job description including responsibilities, requirements, and preferred qualifications. The more context our AI has, the more accurate and useful your match analysis will be. Partial descriptions lead to less precise keyword and requirements matching.',
                },
                {
                  question: 'Is my resume and job description data safe?',
                  answer:
                    'Absolutely. Both your resume and the job description are encrypted during upload and analysis. We never store your files permanently or share your data with third parties. All processing happens securely and is fully GDPR compliant.',
                },
                {
                  question: 'What file formats are supported for the resume?',
                  answer:
                    'We currently support PDF format only, as it is the most widely accepted and ATS-compatible format. Maximum file size is 5 MB. We recommend using a clean, text-based PDF for best results.',
                },
                {
                  question: 'What match score should I aim for before applying?',
                  answer:
                    'We generally recommend aiming for a match score of 70 or above before applying. Scores between 50-70 suggest meaningful gaps worth addressing through tailoring. Below 50 may indicate a significant skills mismatch. That said, use the score as a guide — not a hard rule.',
                },
                {
                  question: 'Can I match the same resume to multiple jobs?',
                  answer:
                    'Yes — you can run as many job match analyses as you like. We recommend analyzing each target job separately since every job description is different. This helps you tailor your resume specifically for each application rather than using one generic version.',
                },
                {
                  question: 'How is this different from just searching for keywords myself?',
                  answer:
                    'Manual keyword searching misses context, synonyms, and implied requirements. Our AI understands semantic meaning — it recognizes that "led a team" and "people management" describe the same skill. It also weights keywords by importance and surfaces requirements you might not think to look for.',
                },
                {
                  question: 'Do I need to create an account?',
                  answer:
                    'No account is required to run a job match analysis. However, creating a free account lets you save your match history, compare results across multiple jobs, and access additional features.',
                },
              ]}
            />

            {/* ── CTA ── */}
            <CTASection
              badge="🎯 Ready to find your perfect match?"
              title="Know Your Match Score Before You Apply"
              description="Join 30,000+ job seekers who use our match analysis to tailor their resumes and land more interviews. No signup, no credit card, no catch."
              primaryAction={{
                label: 'Match My Resume Now',
                onClick: scrollToTop,
              }}
              features={[
                '100% Free Forever',
                'No Credit Card Required',
                'Instant Results',
                'Privacy Guaranteed',
              ]}
            />

          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}