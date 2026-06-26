'use client';

import { motion } from 'framer-motion';

interface WhatYouGetFeature {
  icon: string;
  title: string;
  desc: string;
  highlight: string;
}

interface WhatYouGetProps {
  title?: string;
  description?: string;
  features?: WhatYouGetFeature[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  ctaTitle?: string;
  ctaDescription?: string;
}

const defaultFeatures: WhatYouGetFeature[] = [
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
];

export function WhatYouGetSection({
  title = 'What You Get',
  description = 'Comprehensive analysis powered by advanced AI in seconds',
  features = defaultFeatures,
  primaryAction,
  ctaTitle = 'Ready to Get Started?',
  ctaDescription = 'Upload your resume and get instant analysis — completely free!',
}: WhatYouGetProps) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-white via-violet-50/30 to-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-white border-2 border-gray-200 hover:border-violet-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex gap-5 items-start">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200 text-violet-600 flex items-center justify-center text-3xl transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                      {item.title}
                    </h4>
                    <span className="shrink-0 text-xs font-bold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                      {item.highlight}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        {primaryAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold mb-2">{ctaTitle}</p>
                <p className="text-base text-violet-100">{ctaDescription}</p>
              </div>
              <button
                onClick={primaryAction.onClick}
                className="shrink-0 px-8 py-4 bg-white text-violet-600 font-bold text-lg rounded-xl hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                {primaryAction.label} →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}