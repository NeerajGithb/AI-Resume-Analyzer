'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  BenefitSection,
  HowItWorksSection,
  FeatureGrid,
  FAQSection,
  CTASection,
  WhatYouGetSection,
} from '@/components/landing';
import AppShell from '@/components/layout/AppShell';

export default function ResumeBuilderV2Page() {
  const router = useRouter();

  const handleCreateResume = () => {
    // Navigate to experience level page first
    router.push('/resume-builder-v2/experience-level');
  };

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── Hero + Image Split Layout ── */}
          <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                {/* Left: Hero Content */}
                <div className="lg:pr-8">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Build Your Professional Resume with{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      AI-Powered Precision
                    </span>
                  </h1>

                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Create a beautiful, ATS-friendly resume in minutes. Our step-by-step builder guides you through every section with AI-powered content suggestions — completely free.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                    {[
                      { value: '50K+', label: 'Resumes Built' },
                      { value: 'AI-Powered', label: 'Smart Builder' },
                      { value: '5min', label: 'Average Time' },
                      { value: 'Free', label: 'No Hidden Costs' },
                    ].map((stat, index) => (
                      <div key={stat.label} className="flex items-center gap-1">
                        <span className="font-bold text-blue-700">{stat.value}</span>
                        <span className="text-gray-600">{stat.label}</span>
                        {index < 3 && <span className="text-gray-300 ml-3">|</span>}
                      </div>
                    ))}
                  </div>

                  {/* Main CTA Button */}
                  <div className="mb-8">
                    <Button
                      onClick={handleCreateResume}
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold"
                    >
                      Create My Resume →
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">No signup required • 100% free</p>
                  </div>
                </div>

                {/* Right: Resume Example Image - Reduced Size */}
                <div className="lg:pl-4 flex items-center justify-center">
                  <div className="max-w-md w-full rounded-lg overflow-hidden shadow-2xl border-2 border-gray-200">
                    <Image
                      src="/resume.jpg"
                      alt="Professional Resume Example"
                      width={500}
                      height={700}
                      priority
                      className="w-full h-auto object-cover"
                      quality={95}
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── What You Get ── */}
          <WhatYouGetSection
            title="What You Get"
            description="Professional resume building with step-by-step guidance"
            features={[
              {
                icon: '⚡',
                title: 'Step-by-Step Builder',
                desc: 'Intuitive 7-step process guides you through creating your perfect resume. No confusion, just simple questions.',
                highlight: '7 Easy Steps',
              },
              {
                icon: '🎯',
                title: 'ATS-Optimized Format',
                desc: 'Resume format designed to pass Applicant Tracking Systems used by 95% of companies. Get past the bots.',
                highlight: 'ATS-Ready',
              },
              {
                icon: '✨',
                title: 'AI-Powered Content',
                desc: 'Get professionally written summaries and descriptions. Our AI helps you articulate your experience effectively.',
                highlight: 'Smart AI',
              },
              {
                icon: '📄',
                title: 'Professional Design',
                desc: 'Beautiful, modern layout with optimal spacing and typography. Print-ready PDF format that looks great.',
                highlight: 'Print-Ready',
              },
              {
                icon: '🔤',
                title: 'Skill Suggestions',
                desc: 'Choose from 200+ technical and soft skills. Popular suggestions help you identify relevant skills.',
                highlight: 'Smart Picks',
              },
              {
                icon: '💼',
                title: 'Multiple Sections',
                desc: 'Add work experience, education, projects, skills, and more. Everything recruiters want to see.',
                highlight: 'Complete',
              },
              {
                icon: '📊',
                title: 'Real-Time Preview',
                desc: 'See your progress with completion percentage. Know exactly what sections you still need to fill.',
                highlight: 'Live Preview',
              },
              {
                icon: '⬇️',
                title: 'Instant PDF Download',
                desc: 'Download your professional resume as a high-quality PDF immediately. Share with employers right away.',
                highlight: 'PDF Export',
              },
              {
                icon: '🎨',
                title: 'Customizable Fields',
                desc: 'Add your LinkedIn, GitHub, portfolio links, and more. Make your resume uniquely yours.',
                highlight: 'Flexible',
              },
              {
                icon: '🚀',
                title: '100% Free',
                desc: 'No hidden costs, no subscriptions, no credit card required. Build unlimited resumes completely free.',
                highlight: 'No Cost',
              },
            ]}
            ctaTitle="Ready to Get Started?"
            ctaDescription="Build your professional resume in just 5 minutes!"
            primaryAction={{
              label: 'Start Building',
              onClick: handleCreateResume,
            }}
          />

          {/* ── Benefits ── */}
          <BenefitSection
            title="Why Use Our Resume Builder?"
            description="Create professional resumes that get you interviews"
            benefits={[
              {
                icon: '⚡',
                title: 'Fast & Easy',
                description:
                  'Complete your resume in 5-10 minutes with our guided step-by-step process. No overwhelming blank pages.',
              },
              {
                icon: '✍️',
                title: 'AI-Assisted Writing',
                description:
                  'Get help writing compelling summaries and descriptions. Our AI provides suggestions based on your role.',
              },
              {
                icon: '📄',
                title: 'ATS-Friendly',
                description:
                  'Format optimized to pass Applicant Tracking Systems. Clean structure ensures your resume gets seen by humans.',
              },
              {
                icon: '🎯',
                title: 'Guided Process',
                description:
                  'Never wonder what to include. Our 7-step process covers all essential sections with helpful tips.',
              },
              {
                icon: '💼',
                title: 'Professional Quality',
                description:
                  'Get resume quality that matches professional services. Beautiful design and polished content.',
              },
              {
                icon: '🔒',
                title: 'Private & Secure',
                description:
                  'Your information is processed securely and never shared. We respect your privacy completely.',
              },
            ]}
          />

          {/* ── How It Works ── */}
          <HowItWorksSection
            title="Build Your Resume in 7 Simple Steps"
            description="From basic info to professional resume in minutes"
            steps={[
              {
                number: '1-2',
                title: 'Basic Information',
                description:
                  'Start with your contact details and career goals. Tell us what you\'re looking for.',
              },
              {
                number: '3-5',
                title: 'Add Your Background',
                description:
                  'Include your work experience, education, and skills. We guide you through each section.',
              },
              {
                number: '6-7',
                title: 'Review & Generate',
                description:
                  'Add a professional summary, review everything, and generate your resume with AI-powered content.',
              },
            ]}
          />

          {/* ── Feature Grid ── */}
          <FeatureGrid
            title="Comprehensive Resume Builder Features"
            description="Everything you need to create a winning resume"
            features={[
              {
                icon: '📝',
                title: 'Contact Information',
                description:
                  'Add your name, email, phone, location, and professional links like LinkedIn and GitHub.',
              },
              {
                icon: '🎯',
                title: 'Career Purpose',
                description:
                  'Define your career goals and target role to tailor your resume content effectively.',
              },
              {
                icon: '💼',
                title: 'Work Experience',
                description:
                  'Add multiple positions with dates, descriptions, and achievements. Include internships and volunteer work.',
              },
              {
                icon: '🎓',
                title: 'Education',
                description:
                  'List your degrees, institutions, graduation dates, and GPA. Support for multiple degrees.',
              },
              {
                icon: '⚡',
                title: 'Skills Section',
                description:
                  'Choose from 200+ technical and soft skills. Add languages you speak. Smart suggestions included.',
              },
              {
                icon: '📋',
                title: 'Professional Summary',
                description:
                  'Write your career objective and key highlights. AI suggestions help you write compelling content.',
              },
              {
                icon: '✅',
                title: 'Review Dashboard',
                description:
                  'See completion status for each section. Review all your information before generating.',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description:
                  'Real-time completeness percentage shows your progress. Know exactly what\'s left to fill.',
              },
              {
                icon: '⬇️',
                title: 'PDF Export',
                description:
                  'Download high-quality PDF with professional formatting. Print-ready and email-friendly.',
                badge: 'Popular',
              },
            ]}
            columns={3}
          />

          {/* ── FAQ ── */}
          <FAQSection
            title="Frequently Asked Questions"
            description="Everything you need to know about resume building"
            faqs={[
              {
                question: 'Is this really free? Are there hidden costs?',
                answer:
                  'Yes, 100% free forever! No hidden costs, no subscriptions, no credit card required. Build unlimited resumes completely free.',
              },
              {
                question: 'How does the AI help with content?',
                answer:
                  'Our AI provides suggestions for professional summaries and descriptions based on your role and experience. It helps you articulate your skills and achievements effectively.',
              },
              {
                question: 'Can I edit my resume after generating?',
                answer:
                  'You can go back through the steps and make changes before generating. The final PDF can be edited in your own word processor if needed.',
              },
              {
                question: 'What format is the resume in?',
                answer:
                  'The resume is generated as a professional PDF with clean formatting, optimal spacing, and ATS-friendly structure. It includes clickable links for your profiles.',
              },
              {
                question: 'Is my information safe?',
                answer:
                  'Absolutely. Your information is encrypted and processed securely. We never store your data permanently or share it with third parties.',
              },
              {
                question: 'How long does it take to build a resume?',
                answer:
                  'Most users complete the entire process in 5-10 minutes. The 7-step guided process makes it quick and easy.',
              },
              {
                question: 'Can I build multiple resumes?',
                answer:
                  'Yes! You can create unlimited resumes. We recommend creating different versions tailored to specific job applications.',
              },
              {
                question: 'What if I make a mistake?',
                answer:
                  'You can go back to previous steps at any time to edit your information before generating the final resume.',
              },
            ]}
          />

          {/* ── CTA ── */}
          <CTASection
            badge="🚀 Ready to land your dream job?"
            title="Build Your Professional Resume in 5 Minutes"
            description="Join thousands of job seekers who have created impressive resumes with our guided builder. No signup, no cost, no catch."
            primaryAction={{
              label: 'Start Building Now',
              onClick: handleCreateResume,
            }}
            features={[
              '100% Free Forever',
              '7-Step Guided Process',
              'AI-Powered Content',
              'Instant PDF Download',
            ]}
          />
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
