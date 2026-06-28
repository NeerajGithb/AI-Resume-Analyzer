'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/upload/DropZone';
import { Button } from '@/components/ui/Button';
import { ExperienceSelect } from '@/components/common/ExperienceSelect';
import { RoleSelect } from '@/components/common/RoleSelect';
import {
  BenefitSection,
  HowItWorksSection,
  FeatureGrid,
  FAQSection,
  CTASection,
  WhatYouGetSection,
} from '@/components/landing';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { useAnalyzeMutation } from '@/hooks/useAnalysisMutation';
import AppShell from '@/components/layout/AppShell';

export default function AnalyzePage() {
  const router = useRouter();
  const {
    file,
    setFile,
    yearsOfExperience,
    setYearsOfExperience,
    targetRole,
    setTargetRole,
  } = useAnalysisStore();
  const { mutate: analyze, isPending: isAnalyzing, error, abort } = useAnalyzeMutation();

  const handleAnalyze = () => {
    if (!file || isAnalyzing) return;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const payload = btoa(`analyzing:${timestamp}:${random}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const tempToken = payload;

    router.push(`/analyze/report/${tempToken}`);

    analyze(
      {
        file,
        yearsOfExperience: yearsOfExperience || undefined,
        targetRole: targetRole || undefined,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) return;
          router.replace(`/analyze/report/${data.id}`);
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
        {!isAnalyzing && (
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
                      Outsmart ATS Filters with{' '}
                      <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        Free AI-Driven Precision
                      </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Unlock your resume's full potential with instant ATS scoring, keyword optimization, and actionable insights — all in under 30 seconds, completely free.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                      {[
                        { value: '50K+', label: 'Resumes Analyzed' },
                        { value: '94%', label: 'Score Improvement' },
                        { value: '30s', label: 'Average Time' },
                        { value: '4.9★', label: 'User Rating' },
                      ].map((stat, index) => (
                        <div key={stat.label} className="flex items-center gap-1">
                          <span className="font-bold text-violet-700">{stat.value}</span>
                          <span className="text-gray-600">{stat.label}</span>
                          {index < 3 && <span className="text-gray-300 ml-3">|</span>}
                        </div>
                      ))}
                    </div>

                    <div className="mb-8 rounded-sm overflow-hidden border-2 border-violet-200 shadow-2xl bg-white">
                      <Image
                        src="/home.png"
                        alt="Resume Analysis Dashboard Preview - ATS Score, Keywords, and AI Suggestions"
                        width={600}
                        height={400}
                        priority
                        className="w-full h-auto object-cover"
                        quality={90}
                      />
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
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">Analyze Your Resume</h2>
                            <p className="text-[11px] text-gray-500">Free · Instant · No signup needed</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-5 space-y-5">
                        {/* Drop Zone */}
                        <DropZone
                          file={file}
                          onFile={setFile}
                          disabled={isAnalyzing}
                          error={error?.message ?? null}
                        />

                        {/* Optional Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Optional</span>
                            <div className="h-px flex-1 bg-gray-100" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label htmlFor="years-experience" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Experience
                              </label>
                              <ExperienceSelect
                                id="years-experience"
                                value={yearsOfExperience}
                                onChange={setYearsOfExperience}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label htmlFor="target-role" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Target Role
                              </label>
                              <RoleSelect
                                id="target-role"
                                value={targetRole}
                                onChange={setTargetRole}
                                grouped={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {file ? (
                            <>
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-emerald-700 truncate">Ready to analyze</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Upload a PDF to begin</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file && (
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={isAnalyzing}>
                              Clear
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="default"
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                            id="analyze-button"
                          >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume →'}
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
                              We process your resume securely for analysis only.
                              Files are never sold, shared, or used for AI training.
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
              description="Comprehensive analysis powered by advanced AI in seconds"
              features={[
                {
                  icon: '⚡',
                  title: 'Lightning Fast Analysis',
                  desc: 'Get your complete resume analysis in under 30 seconds. No waiting, no delays — instant results powered by advanced AI technology.',
                  highlight: 'Under 30s',
                },
                {
                  icon: '🎯',
                  title: 'ATS Compatibility Score',
                  desc: 'Receive a precise 0-100 score showing how well your resume passes Applicant Tracking Systems used by 95% of companies. See exactly what needs fixing.',
                  highlight: '0-100 Score',
                },
                {
                  icon: '🔤',
                  title: 'Missing Keywords Detection',
                  desc: 'Discover technical skills, soft skills, and industry-specific keywords that recruiters actively search for. Never miss critical keywords again.',
                  highlight: 'Smart Detection',
                },
                {
                  icon: '✏️',
                  title: 'AI-Powered Improvements',
                  desc: 'Get specific before/after rewrite suggestions for weak sections. Our AI shows exactly how to strengthen your content with clear examples.',
                  highlight: 'Before/After',
                },
                {
                  icon: '📊',
                  title: 'Section-by-Section Breakdown',
                  desc: 'Receive detailed scores for Experience, Content Quality, Structure, Skills, Grammar, and more. Know exactly where to focus your efforts.',
                  highlight: '11+ Sections',
                },
                {
                  icon: '🎨',
                  title: 'Format & Structure Analysis',
                  desc: 'Check for ATS-friendly formatting, consistent styling, proper headings, and visual hierarchy. Ensure your resume is both readable and scannable.',
                  highlight: 'ATS-Friendly',
                },
                {
                  icon: '💡',
                  title: 'Priority Action Items',
                  desc: 'Get a ranked list of top 3 critical fixes to make immediately. Focus on what matters most and see the biggest impact on your score.',
                  highlight: 'Top 3 Fixes',
                },
                {
                  icon: '📄',
                  title: 'Downloadable PDF Report',
                  desc: 'Export your complete analysis as a professional PDF report. Keep it for reference, share with career coaches, or track improvements over time.',
                  highlight: 'PDF Export',
                },
                {
                  icon: '🚀',
                  title: 'Proven Success Rate',
                  desc: 'Join 50,000+ users who improved their resumes. Our analysis leads to 94% average score improvement and 3x more interview callbacks.',
                  highlight: '94% Better',
                },
                {
                  icon: '🔒',
                  title: '100% Private & Secure',
                  desc: 'Your resume data is encrypted and never shared with third parties. We respect your privacy and comply with GDPR standards. Delete anytime.',
                  highlight: 'GDPR Safe',
                },
              ]}
              ctaTitle="Ready to Get Started?"
              ctaDescription="Upload your resume and get instant analysis — completely free!"
              primaryAction={{
                label: 'Analyze Now',
                onClick: scrollToTop,
              }}
            />

            {/* ── Benefits ── */}
            <BenefitSection
              title="Why Use Resume Analysis?"
              description="Get professional insights that help your resume pass ATS filters and catch recruiters' attention"
              benefits={[
                {
                  icon: '🎯',
                  title: 'Beat ATS Systems',
                  description:
                    'Applicant Tracking Systems reject 75% of resumes. Our AI ensures yours gets through by analyzing ATS compatibility and suggesting keyword optimizations.',
                },
                {
                  icon: '📊',
                  title: 'Instant ATS Score',
                  description:
                    'Get a 0–100 compatibility score in 30 seconds. See exactly how your resume ranks against industry standards with detailed breakdown by section.',
                },
                {
                  icon: '🔍',
                  title: 'Keyword Gap Analysis',
                  description:
                    'Discover missing technical skills, soft skills, and industry keywords that recruiters actively search for. Never miss critical keywords again.',
                },
                {
                  icon: '✏️',
                  title: 'AI-Powered Improvements',
                  description:
                    'Get before/after rewrites for weak sections with clear explanations. Our AI provides specific, actionable suggestions to strengthen your content.',
                },
                {
                  icon: '🚀',
                  title: 'Land More Interviews',
                  description:
                    'Users see 94% average score improvement and 3x more interview callbacks. Transform your resume from rejected to shortlisted.',
                },
                {
                  icon: '🔒',
                  title: 'Private & Secure',
                  description:
                    'Your resume data is encrypted and never shared. We respect your privacy and comply with GDPR standards.',
                },
              ]}
            />

            {/* ── How It Works ── */}
            <HowItWorksSection
              title="Get Your Analysis in 3 Simple Steps"
              description="From upload to insights in under 30 seconds"
              steps={[
                {
                  number: '1',
                  title: 'Upload Your Resume',
                  description:
                    'Drag and drop your PDF resume or click to browse. Maximum file size 5 MB. Supports all standard resume formats.',
                },
                {
                  number: '2',
                  title: 'AI Analysis',
                  description:
                    'Our advanced AI powered by Llama 3.3 70B analyzes your resume for ATS compatibility, keywords, formatting, and content quality.',
                },
                {
                  number: '3',
                  title: 'Get Actionable Insights',
                  description:
                    'Receive your detailed analysis with ATS score, missing keywords, improvement suggestions, and a downloadable PDF report.',
                },
              ]}
            />

            {/* ── Feature Grid ── */}
            <FeatureGrid
              title="Comprehensive Analysis Features"
              description="Everything you need to optimize your resume for success"
              features={[
                {
                  icon: '📈',
                  title: 'ATS Compatibility Score',
                  description:
                    'Get a precise 0–100 score showing how well your resume works with ATS software used by 95% of Fortune 500 companies.',
                },
                {
                  icon: '🔤',
                  title: 'Keyword Optimization',
                  description:
                    'Identify missing technical skills, soft skills, action verbs, and industry-specific keywords that recruiters search for.',
                },
                {
                  icon: '📝',
                  title: 'Content Quality Review',
                  description:
                    'Analyze bullet points, achievements, and descriptions for impact, clarity, and professional tone.',
                },
                {
                  icon: '🎨',
                  title: 'Format & Structure',
                  description:
                    'Check section organization, consistency, white space usage, and overall visual hierarchy for maximum readability.',
                },
                {
                  icon: '💡',
                  title: 'Smart Suggestions',
                  description:
                    'Receive specific, actionable recommendations with before/after examples to strengthen weak sections.',
                },
                {
                  icon: '📄',
                  title: 'PDF Export',
                  description:
                    'Download your complete analysis report as a professional PDF for reference or sharing with career coaches.',
                },
                {
                  icon: '📊',
                  title: 'Section-by-Section Breakdown',
                  description:
                    'Get individual scores and feedback for Experience, Education, Skills, Summary, and other key sections.',
                },
                {
                  icon: '⚡',
                  title: 'Real-Time Processing',
                  description:
                    'Lightning-fast analysis powered by advanced AI. Get comprehensive results in under 30 seconds.',
                },
                {
                  icon: '🎯',
                  title: 'Role-Specific Insights',
                  description:
                    'Optional target role analysis provides customized feedback based on specific job requirements and industry standards.',
                  badge: 'Enhanced',
                },
              ]}
              columns={3}
            />

            {/* ── FAQ ── */}
            <FAQSection
              title="Frequently Asked Questions"
              description="Everything you need to know about resume analysis"
              faqs={[
                {
                  question: 'What is an ATS and why does it matter?',
                  answer:
                    "An Applicant Tracking System (ATS) is software used by 95% of Fortune 500 companies to filter resumes before they reach human recruiters. ATS systems scan resumes for keywords, formatting, and qualifications. If your resume isn't ATS-friendly, it gets automatically rejected—even if you're perfectly qualified. Our analysis ensures your resume passes these filters.",
                },
                {
                  question: 'How accurate is the ATS score?',
                  answer:
                    'Our AI is trained on millions of resumes and real ATS filtering criteria from major platforms like Workday, Greenhouse, and Lever. The score reflects how well your resume matches ATS requirements including keyword density, format compatibility, section structure, and content quality.',
                },
                {
                  question: 'Is my resume data safe and private?',
                  answer:
                    "Absolutely. Your resume is encrypted during upload and analysis. We never store your resume files permanently or share your data with third parties. All processing happens securely, and you can delete your analysis history at any time. We're fully GDPR compliant.",
                },
                {
                  question: 'What file formats are supported?',
                  answer:
                    'We currently support PDF format only, as it\'s the most widely accepted and ATS-compatible format. Maximum file size is 5 MB. We recommend using a clean, text-based PDF (not scanned images) for best results.',
                },
                {
                  question: 'How do I improve my ATS score?',
                  answer:
                    "After analysis, you'll receive specific recommendations including missing keywords to add, formatting issues to fix, and content improvements. Focus on the high-priority suggestions first. Most users see significant score improvements by adding relevant keywords, strengthening bullet points, and fixing formatting issues.",
                },
                {
                  question: 'Can I analyze multiple versions of my resume?',
                  answer:
                    'Yes! You can analyze unlimited resumes. We recommend creating role-specific versions and analyzing each one. Your analysis history is saved so you can track improvements over time.',
                },
                {
                  question: 'What makes this different from other resume checkers?',
                  answer:
                    'Our AI uses advanced language models (Llama 3.3 70B) trained specifically on resume analysis. Unlike basic keyword counters, we understand context, evaluate content quality, and provide specific improvement suggestions with before/after examples.',
                },
                {
                  question: 'Do I need to create an account?',
                  answer:
                    'No account is required to analyze your resume. However, creating a free account lets you save your analysis history, track improvements over time, and access premium features like custom cover letter generation and job matching.',
                },
              ]}
            />

            {/* ── CTA ── */}
            <CTASection
              badge="🚀 Ready to land your dream job?"
              title="Transform Your Resume in 30 Seconds"
              description="Join 50,000+ professionals who have already improved their resumes and landed more interviews. No signup, no credit card, no catch."
              primaryAction={{
                label: 'Start Free Analysis Now',
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