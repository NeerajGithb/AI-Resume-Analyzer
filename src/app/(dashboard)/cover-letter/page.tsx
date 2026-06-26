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
import { useCoverLetterStore } from '@/store/coverLetterUIStore';
import { useCoverLetterMutation } from '@/hooks/useCoverLetterMutation';
import AppShell from '@/components/layout/AppShell';

export default function CoverLetterPage() {
  const router = useRouter();
  const { 
    resume, 
    setResume, 
    jobDescription, 
    setJobDescription, 
    companyName, 
    setCompanyName, 
    tone, 
    setTone 
  } = useCoverLetterStore();
  const { mutate: generate, isPending: isGenerating, error } = useCoverLetterMutation();

  const handleGenerate = () => {
    if (!resume || !jobDescription.trim() || !companyName.trim() || isGenerating) return;

    // Create temp token matching analyze pattern
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const payload = btoa(`generating:${timestamp}:${random}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const tempToken = payload;

    router.push(`/cover-letter/report/${tempToken}`);

    generate(
      { resume, jobDescription, companyName, tone },
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
        {!isGenerating && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Hero + Form Split Layout ── */}
            <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                  {/* Left: Hero Content */}
                  <div className="lg:pr-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                      Generate Your Perfect{' '}
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Cover Letter
                      </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Create a personalized, ATS-friendly cover letter in seconds. Our AI analyzes your resume and the job description to craft a compelling narrative that stands out.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                      {[
                        { value: '30s', label: 'Generation Time' },
                        { value: '95%', label: 'Success Rate' },
                        { value: 'Free', label: 'Forever' },
                      ].map((stat, index) => (
                        <div key={stat.label} className="flex items-center gap-1">
                          <span className="font-bold text-blue-700">{stat.value}</span>
                          <span className="text-gray-600">{stat.label}</span>
                          {index < 2 && <span className="text-gray-300 ml-3">|</span>}
                        </div>
                      ))}
                    </div>

                    {/* Feature highlights */}
                    <div className="space-y-4 mb-8">
                      {[
                        {
                          icon: '✨',
                          title: 'AI-Powered Personalization',
                          desc: 'Tailored content that matches your experience with job requirements',
                        },
                        {
                          icon: '🎯',
                          title: 'ATS-Optimized',
                          desc: 'Formatted to pass applicant tracking systems and catch recruiters\' attention',
                        },
                        {
                          icon: '⚡',
                          title: 'Multiple Tone Options',
                          desc: 'Choose from professional, enthusiastic, formal, or conversational styles',
                        },
                        {
                          icon: '📝',
                          title: 'Instant Export',
                          desc: 'Download as text file or copy directly to your application',
                        },
                      ].map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-lg">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-xs text-gray-600 mt-0.5">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Form */}
                  <div className="lg:pl-4">
                    <div className="bg-white border border-gray-200 rounded-sm shadow-xl overflow-hidden sticky top-20">

                      {/* Card header */}
                      <div className="px-6 pt-6 pb-0">
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
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
                        {/* Resume Upload */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Your Resume
                          </label>
                          <DropZone
                            file={resume}
                            onFile={setResume}
                            disabled={isGenerating}
                            error={error?.message ?? null}
                          />
                        </div>

                        {/* Company Name */}
                        <div>
                          <label htmlFor="company-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Company Name
                          </label>
                          <input
                            id="company-name"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g., Google, Microsoft, Amazon"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isGenerating}
                          />
                        </div>

                        {/* Job Description */}
                        <div>
                          <label htmlFor="job-description" className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Job Description
                          </label>
                          <textarea
                            id="job-description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the complete job description here..."
                            className="w-full h-32 px-3 py-2 rounded-md border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isGenerating}
                          />
                        </div>

                        {/* Tone Selection */}
                        <div>
                          <label htmlFor="tone-select" className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                            Writing Tone
                          </label>
                          <select
                            id="tone-select"
                            value={tone}
                            onChange={(e) => setTone(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isGenerating}
                          >
                            <option value="professional">Professional - Balanced and polished</option>
                            <option value="enthusiastic">Enthusiastic - Energetic and passionate</option>
                            <option value="formal">Formal - Traditional and conservative</option>
                            <option value="conversational">Conversational - Friendly and approachable</option>
                          </select>
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {resume && jobDescription && companyName ? (
                            <>
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-emerald-700 truncate">Ready to generate</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Fill all fields to continue</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {resume && (
                            <Button variant="ghost" size="sm" onClick={() => setResume(null)} disabled={isGenerating}>
                              Clear
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="default"
                            onClick={handleGenerate}
                            disabled={!resume || !jobDescription.trim() || !companyName.trim() || isGenerating}
                          >
                            {isGenerating ? 'Generating...' : 'Generate Letter →'}
                          </Button>
                        </div>
                      </div>

                      {/* Privacy notice */}
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
                              We process your resume securely for generation only. Files are never sold, shared, or used for AI training.
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
              description="Professional cover letters powered by AI in seconds"
              features={[
                {
                  icon: '⚡',
                  title: 'Lightning Fast Generation',
                  desc: 'Get your personalized cover letter in under 30 seconds. No waiting, no templates — instant professional content tailored to your job.',
                  highlight: 'Under 30s',
                },
                {
                  icon: '🎯',
                  title: 'Job-Specific Tailoring',
                  desc: 'AI analyzes both your resume and job description to highlight the most relevant skills and experiences that match the role.',
                  highlight: 'Smart Match',
                },
                {
                  icon: '✨',
                  title: 'Multiple Writing Tones',
                  desc: 'Choose from professional, enthusiastic, formal, or conversational styles to match the company culture and industry.',
                  highlight: '4 Tones',
                },
                {
                  icon: '📝',
                  title: 'ATS-Optimized Format',
                  desc: 'Cover letters formatted to pass applicant tracking systems while maintaining a natural, engaging narrative flow.',
                  highlight: 'ATS-Friendly',
                },
                {
                  icon: '🔤',
                  title: 'Keyword Integration',
                  desc: 'Automatically incorporates relevant keywords from the job description to increase your chances of getting noticed by recruiters.',
                  highlight: 'Auto Keywords',
                },
                {
                  icon: '💼',
                  title: 'Professional Structure',
                  desc: 'Follows industry-standard cover letter format with proper introduction, body paragraphs, and strong closing statement.',
                  highlight: 'Perfect Structure',
                },
                {
                  icon: '🎨',
                  title: 'Highlight Key Achievements',
                  desc: 'Intelligently selects and emphasizes your most relevant accomplishments and skills for the specific role you are applying for.',
                  highlight: 'Smart Selection',
                },
                {
                  icon: '📄',
                  title: 'Easy Export & Editing',
                  desc: 'Download as text file or copy directly to your clipboard. Edit and customize further before submitting your application.',
                  highlight: 'Instant Export',
                },
                {
                  icon: '🚀',
                  title: 'Proven Success Rate',
                  desc: 'Join thousands of users who have successfully landed interviews using our AI-generated cover letters. 95% user satisfaction rate.',
                  highlight: '95% Success',
                },
                {
                  icon: '🔒',
                  title: '100% Private & Secure',
                  desc: 'Your resume and job details are encrypted and never shared. We respect your privacy and comply with GDPR standards. Delete anytime.',
                  highlight: 'GDPR Safe',
                },
              ]}
              ctaTitle="Ready to Get Started?"
              ctaDescription="Upload your resume and generate your perfect cover letter — completely free!"
              primaryAction={{
                label: 'Generate Now',
                onClick: scrollToTop,
              }}
            />

            {/* ── Benefits ── */}
            <BenefitSection
              title="Why Use AI Cover Letter Generator?"
              description="Stand out from other applicants with personalized, compelling cover letters"
              benefits={[
                {
                  icon: '🎯',
                  title: 'Perfect Job Match',
                  description:
                    'Our AI analyzes the job description and your resume to create a cover letter that highlights your most relevant qualifications and experiences.',
                },
                {
                  icon: '⚡',
                  title: 'Save Hours of Writing',
                  description:
                    'Stop staring at a blank page. Get a professional cover letter in 30 seconds instead of spending hours trying to write one yourself.',
                },
                {
                  icon: '✨',
                  title: 'Professional Quality',
                  description:
                    'AI-powered writing that matches or exceeds professional writing services. Perfect grammar, compelling narrative, and persuasive language.',
                },
                {
                  icon: '📝',
                  title: 'Customizable Tone',
                  description:
                    'Choose from multiple writing styles to match company culture — from formal corporate to friendly startup. Your authentic voice, professionally polished.',
                },
                {
                  icon: '🚀',
                  title: 'Land More Interviews',
                  description:
                    'Users with personalized cover letters get 2-3x more interview callbacks. Stand out from applicants who skip this crucial step.',
                },
                {
                  icon: '🔒',
                  title: 'Private & Secure',
                  description:
                    'Your resume and personal information are encrypted and never shared. We respect your privacy and comply with GDPR standards.',
                },
              ]}
            />

            {/* ── How It Works ── */}
            <HowItWorksSection
              title="Generate Your Cover Letter in 3 Simple Steps"
              description="From upload to download in under 30 seconds"
              steps={[
                {
                  number: '1',
                  title: 'Upload Your Resume',
                  description:
                    'Drag and drop your PDF resume. Our AI will analyze your experience, skills, and achievements to create personalized content.',
                },
                {
                  number: '2',
                  title: 'Add Job Details',
                  description:
                    'Paste the job description and company name. Choose your preferred writing tone (professional, enthusiastic, formal, or conversational).',
                },
                {
                  number: '3',
                  title: 'Get Your Cover Letter',
                  description:
                    'Receive a professionally written, ATS-optimized cover letter tailored to the job. Download as text or copy directly to your application.',
                },
              ]}
            />

            {/* ── Feature Grid ── */}
            <FeatureGrid
              title="Comprehensive Cover Letter Features"
              description="Everything you need to create compelling application letters"
              features={[
                {
                  icon: '🎯',
                  title: 'Job-Specific Content',
                  description:
                    'AI analyzes the job description to highlight your most relevant skills and experiences that match what the employer is looking for.',
                },
                {
                  icon: '✨',
                  title: 'Multiple Tone Options',
                  description:
                    'Choose from professional, enthusiastic, formal, or conversational writing styles to match the company culture and industry.',
                },
                {
                  icon: '📝',
                  title: 'Perfect Structure',
                  description:
                    'Industry-standard format with engaging introduction, compelling body paragraphs, and strong closing statement with call-to-action.',
                },
                {
                  icon: '🔤',
                  title: 'Keyword Optimization',
                  description:
                    'Automatically incorporates relevant keywords from the job posting to help your application pass ATS filters and catch recruiter attention.',
                },
                {
                  icon: '💼',
                  title: 'Achievement Highlighting',
                  description:
                    'Intelligently selects and emphasizes your most impressive accomplishments that align with the job requirements.',
                },
                {
                  icon: '📄',
                  title: 'Easy Export',
                  description:
                    'Download as plain text file or copy directly to clipboard. Edit and customize further before submitting.',
                },
                {
                  icon: '⚡',
                  title: 'Instant Generation',
                  description:
                    'Professional cover letter in under 30 seconds. No more writer\'s block or hours of editing.',
                },
                {
                  icon: '🎨',
                  title: 'Natural Language',
                  description:
                    'AI-generated content that reads naturally and authentically, not robotic or template-based.',
                },
                {
                  icon: '🔒',
                  title: 'Private & Secure',
                  description:
                    'Your resume and personal data are encrypted and never shared with third parties. GDPR compliant.',
                  badge: 'Secure',
                },
              ]}
              columns={3}
            />

            {/* ── FAQ ── */}
            <FAQSection
              title="Frequently Asked Questions"
              description="Everything you need to know about AI cover letter generation"
              faqs={[
                {
                  question: 'How does the AI generate cover letters?',
                  answer:
                    'Our AI analyzes your resume to understand your experience and skills, then reads the job description to identify key requirements. It creates a personalized cover letter that highlights how your qualifications match what the employer is looking for, using natural, professional language.',
                },
                {
                  question: 'Will my cover letter sound generic or robotic?',
                  answer:
                    'No! Our AI uses advanced language models (Llama 3.3 70B) trained on professional writing. Each cover letter is unique and tailored to your specific background and the job you\'re applying for. You can choose different tones to match your personal style.',
                },
                {
                  question: 'Can I edit the generated cover letter?',
                  answer:
                    'Absolutely! The generated cover letter is a starting point. You can copy the text and edit it in any word processor to add personal touches, adjust specific details, or modify the tone. We recommend reviewing and customizing before sending.',
                },
                {
                  question: 'What tone options are available?',
                  answer:
                    'We offer four writing tones: Professional (balanced and polished), Enthusiastic (energetic and passionate), Formal (traditional and conservative), and Conversational (friendly and approachable). Choose the tone that best matches the company culture.',
                },
                {
                  question: 'Is my resume data safe and private?',
                  answer:
                    'Yes! Your resume is encrypted during upload and processing. We never store your files permanently or share your data with third parties. All processing happens securely, and you can delete your analysis history at any time. We\'re fully GDPR compliant.',
                },
                {
                  question: 'How long should a cover letter be?',
                  answer:
                    'Our AI generates cover letters that are typically 250-400 words (3-4 paragraphs), which is the ideal length. This is long enough to showcase your qualifications while being concise enough to keep the recruiter\'s attention.',
                },
                {
                  question: 'Can I generate multiple cover letters?',
                  answer:
                    'Yes! You can generate unlimited cover letters for different jobs. We recommend creating a unique cover letter for each application, as job-specific content dramatically increases your chances of getting an interview.',
                },
                {
                  question: 'Does this work for all industries?',
                  answer:
                    'Yes! Our AI understands context across all industries including tech, finance, healthcare, education, sales, marketing, and more. It adapts the language and emphasis based on the job description you provide.',
                },
              ]}
            />

            {/* ── CTA ── */}
            <CTASection
              badge="🚀 Ready to land your dream job?"
              title="Generate Your Perfect Cover Letter in 30 Seconds"
              description="Join thousands of professionals who have improved their job applications and landed more interviews. No signup, no credit card, completely free."
              primaryAction={{
                label: 'Generate Cover Letter Now',
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
