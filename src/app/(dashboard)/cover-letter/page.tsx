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
import { useCoverLetterStore, CoverLetterTone } from '@/store/coverLetterUIStore';
import { useCoverLetterMutation } from '@/hooks/useCoverLetterMutation';
import { RoleSelect } from '@/components/common/RoleSelect';
import AppShell from '@/components/layout/AppShell';

const TONES: { value: CoverLetterTone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Balanced and polished' },
  { value: 'formal',       label: 'Formal',       desc: 'Traditional and conservative' },
  { value: 'friendly',     label: 'Friendly',     desc: 'Approachable and warm' },
];

export default function CoverLetterPage() {
  const router = useRouter();
  const {
    resume, setResume,
    jobTitle, setJobTitle,
    companyName, setCompanyName,
    jobDescription, setJobDescription,
    hiringManagerName, setHiringManagerName,
    tone, setTone,
  } = useCoverLetterStore();

  const { mutate: generate, isPending: isGenerating, error } = useCoverLetterMutation();

  const canGenerate = !!resume && !!jobTitle.trim() && !!companyName.trim() && !!jobDescription.trim() && !isGenerating;

  const handleGenerate = () => {
    if (!canGenerate || !resume) return;

    const payload = btoa(`generating:${Date.now()}:${Math.random().toString(36).slice(2)}`)
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    router.push(`/cover-letter/report/${payload}`);

    generate(
      { resume, jobTitle, companyName, jobDescription, hiringManagerName, tone },
      {
        onSuccess: (data) => {
          if (data?.id) router.replace(`/cover-letter/report/${data.id}`);
        },
      },
    );
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {!isGenerating && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                  {/* Hero */}
                  <div className="lg:pr-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                      Generate Your Perfect{' '}
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Cover Letter
                      </span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      AI-powered, ATS-friendly cover letters tailored to your resume and the job description — in under 30 seconds.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                      {[
                        { value: '30s', label: 'Generation Time' },
                        { value: '95%', label: 'Success Rate' },
                        { value: 'Free', label: 'Forever' },
                      ].map((stat, i) => (
                        <div key={stat.label} className="flex items-center gap-1">
                          <span className="font-bold text-blue-700">{stat.value}</span>
                          <span className="text-gray-600">{stat.label}</span>
                          {i < 2 && <span className="text-gray-300 ml-3">|</span>}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        { icon: '✨', title: 'AI-Powered Personalization', desc: 'Tailored to your experience and the exact role' },
                        { icon: '🎯', title: 'ATS-Optimized',              desc: 'Passes tracking systems and catches recruiter attention' },
                        { icon: '⚡', title: 'One-Click Variations',       desc: 'Shorten, make confident, or optimize for ATS instantly' },
                        { icon: '📄', title: 'Download as PDF',             desc: 'Ready-to-send PDF in one click' },
                      ].map((f) => (
                        <div key={f.title} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-lg">{f.icon}</div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                            <p className="text-xs text-gray-600 mt-0.5">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <div className="lg:pl-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden sticky top-20">

                      <div className="px-6 pt-6 pb-0">
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight">Generate Cover Letter</h2>
                            <p className="text-[11px] text-gray-500">Free · AI-powered · Instant results</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-5 space-y-4">

                        {/* Resume */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Resume <span className="text-red-500">*</span>
                          </label>
                          <DropZone file={resume} onFile={setResume} disabled={isGenerating} error={error?.message ?? null} />
                        </div>

                        {/* Job Title (RoleSelect) + Company Name — row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="job-title" className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <RoleSelect
                              id="job-title"
                              name="jobTitle"
                              value={jobTitle}
                              onChange={setJobTitle}
                              grouped={true}
                              placeholder="Select target role"
                              disabled={isGenerating}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g., Google"
                              disabled={isGenerating}
                              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Job Description */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Job Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here…"
                            rows={5}
                            disabled={isGenerating}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Hiring Manager (optional) */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Hiring Manager Name <span className="text-gray-400 font-normal normal-case">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={hiringManagerName}
                            onChange={(e) => setHiringManagerName(e.target.value)}
                            placeholder="e.g., Sarah Johnson"
                            disabled={isGenerating}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Tone */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Tone <span className="text-gray-400 font-normal normal-case">(optional)</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {TONES.map((t) => (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => setTone(t.value)}
                                disabled={isGenerating}
                                className={`px-3 py-2 rounded-md border text-left transition-all ${
                                  tone === t.value
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-xs font-semibold">{t.label}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {canGenerate ? (
                            <>
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-emerald-700">Ready to generate</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Fill required fields to continue</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {resume && (
                            <Button variant="ghost" size="sm" onClick={() => setResume(null)} disabled={isGenerating}>Clear</Button>
                          )}
                          <Button variant="default" size="default" onClick={handleGenerate} disabled={!canGenerate}>
                            {isGenerating ? 'Generating…' : 'Generate →'}
                          </Button>
                        </div>
                      </div>

                      {/* Privacy notice */}
                      <div className="border-t border-zinc-200/80 bg-zinc-50/60 px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                            <svg className="h-4 w-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium tracking-tight text-zinc-900">Your data stays private</p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              Resume processed securely for generation only. Never sold, shared, or used for AI training.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <WhatYouGetSection
              title="What You Get"
              description="Professional cover letters powered by AI in seconds"
              features={[
                { icon: '⚡', title: 'Lightning Fast', desc: 'Ready in under 30 seconds.', highlight: 'Under 30s' },
                { icon: '🎯', title: 'Job-Specific', desc: 'Matched to your resume and the JD.', highlight: 'Smart Match' },
                { icon: '✨', title: 'One-Click Variations', desc: 'Shorten, boost confidence, ATS-optimize instantly.', highlight: '5 Actions' },
                { icon: '📄', title: 'PDF Download', desc: 'Send-ready PDF in one click.', highlight: 'Instant PDF' },
              ]}
              ctaTitle="Ready to Get Started?"
              ctaDescription="Upload your resume and generate your perfect cover letter — completely free."
              primaryAction={{ label: 'Generate Now', onClick: scrollToTop }}
            />

            <BenefitSection
              title="Why Use AI Cover Letter Generator?"
              description="Stand out with personalized, compelling cover letters"
              benefits={[
                { icon: '🎯', title: 'Perfect Job Match', description: 'AI analyzes the JD and your resume to surface your most relevant experience.' },
                { icon: '⚡', title: 'Save Hours of Writing', description: 'Professional cover letter in 30 seconds instead of starting from scratch.' },
                { icon: '✨', title: 'Professional Quality', description: 'Grammar, narrative, and persuasion — all handled.' },
                { icon: '📝', title: 'Customizable Tone', description: 'Professional, formal, or friendly — pick what fits the company culture.' },
                { icon: '🚀', title: 'Land More Interviews', description: 'Personalized cover letters get significantly more callbacks.' },
                { icon: '🔒', title: 'Private & Secure', description: 'Your data is encrypted and never shared. GDPR compliant.' },
              ]}
            />

            <HowItWorksSection
              title="Three Steps to Your Cover Letter"
              description="From upload to download in under 30 seconds"
              steps={[
                { number: '1', title: 'Upload Your Resume', description: 'Drop your PDF. AI analyzes your experience and achievements.' },
                { number: '2', title: 'Add Job Details', description: 'Job title, company, description, and optional hiring manager name.' },
                { number: '3', title: 'Generate & Refine', description: 'Get a tailored letter, then shorten, adjust tone, or download as PDF.' },
              ]}
            />

            <FAQSection
              title="Frequently Asked Questions"
              description="Everything you need to know"
              faqs={[
                { question: 'How does the AI generate cover letters?', answer: 'It analyzes your resume and the job description to highlight the most relevant experience, using natural professional language.' },
                { question: 'Will it sound generic or robotic?', answer: 'No. Each letter is unique to your background and the specific role. You can also adjust the tone.' },
                { question: 'Can I edit the result?', answer: 'Yes. Copy the text, download as PDF, or use the one-click actions to shorten, boost confidence, or optimize for ATS.' },
                { question: 'Is my data safe?', answer: 'Your resume is processed securely and never stored permanently or shared with third parties. GDPR compliant.' },
              ]}
            />

            <CTASection
              badge="🚀 Ready to land your dream job?"
              title="Generate Your Perfect Cover Letter in 30 Seconds"
              description="No signup, no credit card, completely free."
              primaryAction={{ label: 'Generate Cover Letter Now', onClick: scrollToTop }}
              features={['100% Free Forever', 'No Credit Card Required', 'Instant Results', 'Privacy Guaranteed']}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}