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

const FEATURES = [
  {
    icon: '📊',
    title: 'ATS Score & Analysis',
    slug: 'ats-score',
    tagline: 'Know exactly how ATS systems rate your resume',
    description: 'Get an instant 0–100 ATS compatibility score with a letter grade (A–F). Our AI evaluates your resume using the same criteria as Fortune 500 Applicant Tracking Systems: keyword density, formatting, section completeness, and quantified achievements.',
    benefits: [
      'Instant score in under 30 seconds',
      'Letter grade (A–F) for quick understanding',
      'Top percentile ranking (e.g., "Top 15% of resumes")',
      'Section-by-section breakdown (Experience, Skills, Education, etc.)',
      'Pass/fail indicator for common ATS filters',
    ],
    useCases: [
      'Before applying to jobs at large companies (Google, Amazon, Microsoft)',
      'After making resume revisions to track improvement',
      'To understand why you are not getting interview callbacks',
    ],
    color: '#7c3aed',
    link: '/analyze',
  },
  {
    icon: '🔍',
    title: 'Keyword Gap Detection',
    slug: 'keyword-gap',
    tagline: 'Discover the missing keywords holding you back',
    description: 'Our AI scans your resume for technical skills, soft skills, industry buzzwords, and action verbs that ATS systems look for. See exactly which high-value keywords you are missing and which ones you already have.',
    benefits: [
      'Found vs. missing keyword breakdown',
      'Categorized by type (technical, soft skills, tools, certifications)',
      'Priority ranking (high-impact keywords highlighted)',
      'Industry-specific keyword suggestions',
      'Competitive keyword density analysis',
    ],
    useCases: [
      'Tailoring your resume for specific industries (tech, finance, healthcare)',
      'Optimizing for job descriptions that list specific tools or skills',
      'Ensuring you mention all relevant certifications and qualifications',
    ],
    color: '#ec4899',
    link: '/analyze',
  },
  {
    icon: '✏️',
    title: 'AI Improvement Suggestions',
    slug: 'ai-suggestions',
    tagline: 'Get before/after rewrites for weak sections',
    description: 'Powered by Llama 3.3 70B, our AI provides specific, actionable rewrites for every weak section of your resume. No generic advice — real before/after examples you can copy/paste immediately.',
    benefits: [
      'Before/after examples for every weak bullet point',
      'Quantified achievement suggestions (e.g., "increased X by Y%")',
      'Strong action verb replacements',
      'Impact-focused phrasing (results over responsibilities)',
      'Tailored to your experience level (entry-level vs. senior)',
    ],
    useCases: [
      'Rewriting vague bullet points like "helped with projects"',
      'Adding quantified metrics to strengthen achievements',
      'Improving weak summaries or objective statements',
    ],
    color: '#2563eb',
    link: '/analyze',
  },
  {
    icon: '🎯',
    title: 'Job Description Matcher',
    slug: 'job-match',
    tagline: 'See how well your resume matches a specific job',
    description: 'Paste a job description and get a detailed match score. Our AI compares your resume against the job requirements and highlights exactly what you are missing.',
    benefits: [
      'Job-specific match score (0–100%)',
      'Required vs. optional skill gap analysis',
      'Keyword overlap visualization',
      'Suggested resume tweaks to improve match',
      'Qualifications you already meet (confidence booster)',
    ],
    useCases: [
      'Tailoring your resume for a specific job posting',
      'Deciding whether you are qualified enough to apply',
      'Prioritizing which skills to emphasize in your resume',
    ],
    color: '#059669',
    link: '/job-match',
  },
  {
    icon: '📋',
    title: 'Resume Comparison',
    slug: 'compare',
    tagline: 'Compare two versions of your resume side-by-side',
    description: 'Upload two resume versions and see a detailed comparison: scores, keywords, strengths, and weaknesses. Perfect for tracking progress or deciding between resume styles.',
    benefits: [
      'Side-by-side score comparison',
      'Keyword diff (added/removed)',
      'Section-level score changes',
      'Visual highlighting of improvements',
      'Recommendation on which version is stronger',
    ],
    useCases: [
      'Deciding between a one-page vs. two-page resume',
      'Testing different resume formats (chronological vs. functional)',
      'Tracking improvement after implementing AI suggestions',
    ],
    color: '#f59e0b',
    link: '/compare',
  },
  {
    icon: '🛠',
    title: 'Resume Builder',
    slug: 'builder',
    tagline: 'Build an ATS-friendly resume from scratch',
    description: 'Fill out a simple form with your experience, skills, and education. Our AI generates a clean, ATS-optimized resume in seconds — formatted, keyword-rich, and ready to download.',
    benefits: [
      'Pre-built ATS-friendly templates',
      'AI-generated bullet points based on your input',
      'Real-time ATS score as you build',
      'One-click PDF export',
      'Mobile-responsive builder interface',
    ],
    useCases: [
      'Creating your first resume from scratch',
      'Quickly building a resume for a career change',
      'Generating a clean resume when your current one is outdated',
    ],
    color: '#8b5cf6',
    link: '/builder',
  },
  {
    icon: '💌',
    title: 'Cover Letter Generator',
    slug: 'cover-letter',
    tagline: 'AI-powered cover letters in 60 seconds',
    description: 'Upload your resume and paste a job description. Our AI writes a personalized, compelling cover letter that matches your experience to the role.',
    benefits: [
      'Personalized to your background and the job',
      'Professional tone and structure',
      'Highlights relevant achievements from your resume',
      'Editable and downloadable',
      'Multiple style options (formal, conversational, bold)',
    ],
    useCases: [
      'Applying to jobs that require a cover letter',
      'Saving time when applying to multiple roles',
      'Getting past writer block for cover letters',
    ],
    color: '#ec4899',
    link: '/cover-letter',
  },
  {
    icon: '💼',
    title: 'LinkedIn Profile Optimizer',
    slug: 'linkedin',
    tagline: 'Optimize your LinkedIn profile for recruiters',
    description: 'Upload your LinkedIn profile or resume. Our AI suggests improvements to your headline, summary, and experience section to increase recruiter visibility and engagement.',
    benefits: [
      'Keyword-optimized headline suggestions',
      'Compelling "About" section rewrite',
      'Experience bullet improvements',
      'Skills section recommendations',
      'SEO tips for LinkedIn search ranking',
    ],
    useCases: [
      'Improving your LinkedIn profile to attract recruiters',
      'Increasing profile views and connection requests',
      'Aligning your LinkedIn with your resume',
    ],
    color: '#0077b5',
    link: '/linkedin',
  },
];

const INTEGRATIONS = [
  { name: 'PDF Export', desc: 'Download analysis reports as PDF', available: true },
  { name: 'JSON Export', desc: 'Export data for custom workflows', available: true },
  { name: 'REST API', desc: 'Integrate into your tools', available: false, tag: 'Pro' },
  { name: 'Chrome Extension', desc: 'Analyze resumes from job boards', available: false, tag: 'Soon' },
  { name: 'Slack Bot', desc: 'Get resume feedback in Slack', available: false, tag: 'Soon' },
  { name: 'Zapier', desc: 'Connect to 5000+ apps', available: false, tag: 'Soon' },
];

export default function FeaturesPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0b0614 0%, #16062a 60%, #0a0e1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)', top: -200, left: -100 }} />
          <div className="absolute rounded-full opacity-20" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.4), transparent 70%)', bottom: -100, right: -80 }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              ⚡ All Features
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Everything you need to <span className="gradient-text">beat the ATS</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              From ATS scoring to AI-powered rewrites, job matching, and LinkedIn optimization — all the tools you need to land your dream job.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, #f9fafb, transparent)' }} />
      </section>

      {/* Features grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {FEATURES.map(({ icon, title, tagline, description, benefits, useCases, color, link, slug }, i) => (
            <FadeUp key={slug} delay={i * 0.05}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4" style={{ background: `${color}15`, color }}>
                    {icon} Feature
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
                  <p className="text-lg text-gray-500 font-medium mb-6">{tagline}</p>
                  <p className="text-gray-600 leading-relaxed mb-8">{description}</p>

                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-3">What you get:</h3>
                    <ul className="space-y-2">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5" style={{ color }}>
                            <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Perfect for:</h3>
                    <ul className="space-y-2">
                      {useCases.map((useCase) => (
                        <li key={useCase} className="flex items-start gap-2.5">
                          <span className="text-lg shrink-0">💡</span>
                          <span className="text-sm text-gray-600 italic">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={link}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                  >
                    Try {title} Free →
                  </Link>
                </div>

                {/* Visual */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="glass rounded-2xl p-8 border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.12)]" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(249,250,251,0.9))' }}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-6 mx-auto" style={{ background: `${color}15` }}>
                      {icon}
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg text-sm font-semibold mb-4" style={{ background: `${color}10`, color }}>
                        Live Demo Available
                      </div>
                      <p className="text-xs text-gray-500">Click "Try Free" to see this feature in action</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-blue-100 text-blue-700 border border-blue-200">
              🔌 Integrations & API
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connect ResuPulse to your workflow</h2>
            <p className="text-gray-500 leading-relaxed">Export your data, integrate with other tools, or build custom solutions with our API.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTEGRATIONS.map(({ name, desc, available, tag }, i) => (
              <FadeUp key={name} delay={i * 0.08}>
                <div className={`rounded-xl p-5 border ${available ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200'} shadow-[0_4px_28px_rgba(0,0,0,0.07)]`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                    {tag && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tag === 'Pro' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}`}>
                        {tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3} className="text-center mt-10">
            <p className="text-sm text-gray-400 mb-4">Need a custom integration or enterprise plan?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-violet-700 border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors">
              Contact Us →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to level up your resume?</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              All features are free. No signup required. Get started in 30 seconds.
            </p>
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

