'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BuilderForm } from '@/components/builder/BuilderForm';
import {
  BenefitSection,
  HowItWorksSection,
  FeatureGrid,
  FAQSection,
  CTASection,
  WhatYouGetSection,
} from '@/components/landing';
import { useBuilderMutation } from '@/hooks/useBuilderMutation';
import { useBuilderStore } from '@/store/builderUIStore';
import AppShell from '@/components/layout/AppShell';

interface FormData {
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  targetRole: string;
  projectsExperience?: string;
  skills: string[];
}

export default function BuilderPage() {
  const router = useRouter();
  const skillsDropdownRef = useRef<HTMLDivElement>(null);
  const { formData: storeFormData, setFormData: setStoreFormData } = useBuilderStore();
  const { mutate, isPending } = useBuilderMutation();
  
  const [localFormData, setLocalFormData] = useState<FormData>(storeFormData as FormData);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  // Sync localFormData changes to store for persistence
  useEffect(() => {
    setStoreFormData(localFormData);
  }, [localFormData, setStoreFormData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!localFormData.name || !localFormData.phone || !localFormData.email || !localFormData.degree || !localFormData.institution || !localFormData.targetRole) {
      alert('Please fill in all required fields');
      return;
    }

    if (localFormData.skills.length === 0) {
      alert('Please select at least a few skills');
      return;
    }

    if (isPending) return;

    // Store form data in Zustand store
    setStoreFormData(localFormData);

    // Generate temp ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const payload = btoa(`processing:${timestamp}:${random}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const tempToken = payload;

    router.push(`/builder/report/${tempToken}`);

    // Convert skills array to comma-separated string for backend
    const dataToSend = {
      ...localFormData,
      projectsExperience: localFormData.projectsExperience || undefined,
      skills: localFormData.skills.join(', ')
    };

    mutate(
      dataToSend as any,
      {
        onSuccess: (data) => {
          if (!data?.id) {
            console.error('[Builder] Invalid response: missing ID', data);
            return;
          }
          console.log('[Builder] Resume generated, replacing URL with ID:', data.id);
          router.replace(`/builder/report/${data.id}`);
        },
        onError: (error) => {
          console.error('[Builder] Resume generation failed:', error);
          alert('Failed to generate resume. Please try again.');
          router.back();
        }
      }
    );
  };

  const handleClear = () => {
    const emptyFormData: FormData = {
      name: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
      leetcode: '',
      degree: '',
      institution: '',
      location: '',
      graduationYear: '',
      targetRole: '',
      projectsExperience: '',
      skills: [],
    };
    setLocalFormData(emptyFormData);
    setStoreFormData(emptyFormData);
    setSkillSearch('');
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {!isPending && (
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
                      Build a Professional Resume with{' '}
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        AI-Powered Precision
                      </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Generate a beautiful, ATS-friendly resume in minutes. Our AI creates professional content tailored to your experience and skills — completely free.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                      {[
                        { value: '30K+', label: 'Resumes Generated' },
                        { value: 'AI-Powered', label: 'Content Creation' },
                        { value: '2min', label: 'Average Time' },
                        { value: 'Free', label: 'No Hidden Costs' },
                      ].map((stat, index) => (
                        <div key={stat.label} className="flex items-center gap-1">
                          <span className="font-bold text-blue-700">{stat.value}</span>
                          <span className="text-gray-600">{stat.label}</span>
                          {index < 3 && <span className="text-gray-300 ml-3">|</span>}
                        </div>
                      ))}
                    </div>

                    <div className="mb-8 rounded-sm overflow-hidden border-2 border-blue-200 shadow-2xl bg-white">
                      <Image
                        src="/home.png"
                        alt="Professional Resume Builder Preview - AI-Generated Content"
                        width={600}
                        height={400}
                        priority
                        className="w-full h-auto object-cover"
                        quality={90}
                      />
                    </div>
                  </div>

                  {/* Right: Builder Form */}
                  <div className="lg:pl-4">
                    <form onSubmit={handleSubmit}>
                      <div className="bg-white border border-gray-200 rounded-sm shadow-xl overflow-hidden sticky top-20">

                        {/* Card header */}
                        <div className="px-6 pt-6 pb-0">
                          <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                            <div>
                              <h2 className="text-sm font-bold text-gray-900 leading-tight">Build Your Resume</h2>
                              <p className="text-[11px] text-gray-500">Free · AI-Powered · Professional Format</p>
                            </div>
                          </div>
                        </div>

                        <div className="px-6 pb-5 max-h-[70vh] overflow-y-auto">
                          <BuilderForm
                            formData={localFormData}
                            onFormDataChange={setLocalFormData}
                            skillSearch={skillSearch}
                            onSkillSearchChange={setSkillSearch}
                            showSkillDropdown={showSkillDropdown}
                            onShowSkillDropdownChange={setShowSkillDropdown}
                            skillsDropdownRef={skillsDropdownRef}
                          />
                        </div>

                        {/* Action footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {localFormData.name && localFormData.email && localFormData.targetRole ? (
                              <>
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-emerald-700 truncate">Ready to generate</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">Fill required fields to begin</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {(localFormData.name || localFormData.email) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                disabled={isPending}
                                type="button"
                              >
                                Clear
                              </Button>
                            )}
                            <Button
                              variant="default"
                              size="default"
                              type="submit"
                              disabled={!localFormData.name || !localFormData.email || !localFormData.targetRole || isPending}
                            >
                              {isPending ? 'Generating...' : 'Generate Resume →'}
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
                                We process your information securely. Your data is never sold, shared, or used for AI training.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </section>

            {/* ── What You Get ── */}
            <WhatYouGetSection
              title="What You Get"
              description="Professional resume generation powered by advanced AI"
              features={[
                {
                  icon: '⚡',
                  title: 'Lightning Fast Generation',
                  desc: 'Create your complete professional resume in under 2 minutes. Our AI generates tailored content instantly based on your information.',
                  highlight: 'Under 2min',
                },
                {
                  icon: '🎯',
                  title: 'AI-Powered Content',
                  desc: 'Get professionally written summaries, project descriptions, and achievements. Our AI creates realistic, compelling content that stands out.',
                  highlight: 'Smart AI',
                },
                {
                  icon: '📄',
                  title: 'ATS-Friendly Format',
                  desc: 'Resume is formatted to pass Applicant Tracking Systems used by 95% of companies. Clean structure with proper headings and formatting.',
                  highlight: 'ATS-Ready',
                },
                {
                  icon: '✨',
                  title: 'Professional Design',
                  desc: 'Beautiful, modern layout with optimal spacing and typography. Print-ready PDF format that looks great on screen and paper.',
                  highlight: 'Print-Ready',
                },
                {
                  icon: '🔤',
                  title: 'Keyword Optimization',
                  desc: 'Content includes relevant technical skills and industry keywords that recruiters search for. Improve your chances of being discovered.',
                  highlight: 'Optimized',
                },
                {
                  icon: '💼',
                  title: 'Role-Specific Content',
                  desc: 'Tailor your resume to specific job roles. AI adjusts content tone and focus based on your target position and industry.',
                  highlight: 'Customized',
                },
                {
                  icon: '📊',
                  title: 'Complete Sections',
                  desc: 'Includes all essential sections: Professional Summary, Education, Projects, Technical Skills, and Achievements. Nothing missing.',
                  highlight: 'Complete',
                },
                {
                  icon: '⬇️',
                  title: 'Instant PDF Download',
                  desc: 'Download your professional resume as a high-quality PDF immediately. Share with employers or print for job fairs.',
                  highlight: 'PDF Export',
                },
                {
                  icon: '🎨',
                  title: 'Customizable',
                  desc: 'Add your own projects, links (LinkedIn, GitHub, LeetCode), and optional experiences. Make it uniquely yours.',
                  highlight: 'Flexible',
                },
                {
                  icon: '🚀',
                  title: '100% Free',
                  desc: 'No hidden costs, no subscriptions, no credit card required. Generate unlimited resumes for different roles completely free.',
                  highlight: 'No Cost',
                },
              ]}
              ctaTitle="Ready to Get Started?"
              ctaDescription="Fill in your details and let AI create your professional resume!"
              primaryAction={{
                label: 'Build Now',
                onClick: scrollToTop,
              }}
            />

            {/* ── Benefits ── */}
            <BenefitSection
              title="Why Use Resume Builder?"
              description="Save hours of work and create professional resumes that get results"
              benefits={[
                {
                  icon: '⚡',
                  title: 'Save Time',
                  description:
                    'Stop spending hours writing and formatting. Our AI generates professional content in minutes, letting you focus on your job search.',
                },
                {
                  icon: '✍️',
                  title: 'AI-Generated Content',
                  description:
                    'Get compelling professional summaries, detailed project descriptions, and impactful achievements written by advanced AI trained on thousands of resumes.',
                },
                {
                  icon: '📄',
                  title: 'ATS-Optimized',
                  description:
                    'Resume format is designed to pass Applicant Tracking Systems. Clean structure, proper headings, and keyword optimization ensure your resume gets seen.',
                },
                {
                  icon: '🎯',
                  title: 'Role-Specific',
                  description:
                    'Tailor content to your target role. Whether you\'re a Software Engineer, Designer, or Data Scientist, get relevant content for your field.',
                },
                {
                  icon: '💼',
                  title: 'Professional Quality',
                  description:
                    'Get resume quality that matches what professional resume writers charge $100+ for. Beautiful design, clear hierarchy, and polished content.',
                },
                {
                  icon: '🔒',
                  title: 'Private & Secure',
                  description:
                    'Your information is processed securely and never shared. We respect your privacy and comply with data protection standards.',
                },
              ]}
            />

            {/* ── How It Works ── */}
            <HowItWorksSection
              title="Create Your Resume in 3 Simple Steps"
              description="From information to professional resume in minutes"
              steps={[
                {
                  number: '1',
                  title: 'Fill Your Information',
                  description:
                    'Enter your personal details, education, target role, and skills. Optionally add your real projects for better content generation.',
                },
                {
                  number: '2',
                  title: 'AI Generates Content',
                  description:
                    'Our advanced AI powered by Groq creates professional summaries, project descriptions, and achievements tailored to your profile.',
                },
                {
                  number: '3',
                  title: 'Download PDF',
                  description:
                    'Preview your resume and download it as a high-quality, print-ready PDF. Share with employers or customize further.',
                },
              ]}
            />

            {/* ── Feature Grid ── */}
            <FeatureGrid
              title="Comprehensive Resume Features"
              description="Everything you need for a professional resume"
              features={[
                {
                  icon: '📝',
                  title: 'Professional Summary',
                  description:
                    'AI-generated compelling 2-sentence summary highlighting your strengths and career goals. Tailored to your target role.',
                },
                {
                  icon: '🎓',
                  title: 'Education Section',
                  description:
                    'Clean display of your degree, institution, graduation year, and location. Properly formatted for ATS systems.',
                },
                {
                  icon: '💻',
                  title: 'Projects Showcase',
                  description:
                    'Detailed project descriptions with technologies used and bullet points highlighting your contributions and impact.',
                },
                {
                  icon: '🔧',
                  title: 'Technical Skills',
                  description:
                    'Comprehensive skills section with 200+ options covering languages, frameworks, databases, cloud, DevOps, and more.',
                },
                {
                  icon: '🏆',
                  title: 'Achievements',
                  description:
                    'AI-generated achievements that demonstrate your capabilities and value. Realistic and compelling.',
                },
                {
                  icon: '🔗',
                  title: 'Social Links',
                  description:
                    'Include LinkedIn, GitHub, LeetCode, and portfolio links. Clickable in PDF for easy access by recruiters.',
                },
                {
                  icon: '📱',
                  title: 'Contact Information',
                  description:
                    'Professional display of your name, email, phone, and location. Clear and easy to find.',
                },
                {
                  icon: '🎨',
                  title: 'Clean Design',
                  description:
                    'Modern, professional layout with blue accent colors, optimal spacing, and clear section hierarchy.',
                },
                {
                  icon: '⬇️',
                  title: 'PDF Export',
                  description:
                    'Download high-quality PDF with embedded fonts and links. Print-ready and email-friendly format.',
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
                    'Yes, 100% free forever! No hidden costs, no subscriptions, no credit card required. Generate unlimited resumes for different roles completely free. We believe everyone deserves access to professional resume tools.',
                },
                {
                  question: 'How does the AI generate content?',
                  answer:
                    'Our AI (powered by Groq Llama 3.3 70B) analyzes your information including education, skills, and target role. It then generates realistic professional summaries, project descriptions, and achievements based on industry standards and best practices.',
                },
                {
                  question: 'Will the AI content sound generic?',
                  answer:
                    'No! The AI creates unique content for each user based on their specific information. If you provide real project details, the AI bases content on those. Otherwise, it creates realistic examples using your actual skills and target role.',
                },
                {
                  question: 'Is my information safe and private?',
                  answer:
                    'Absolutely. Your information is encrypted and processed securely. We never store your data permanently or share it with third parties. You can generate your resume with complete privacy.',
                },
                {
                  question: 'Can I customize the content after generation?',
                  answer:
                    'Currently, the resume is generated as a final PDF. However, you can generate multiple versions with different information and choose the best one. We recommend reviewing and editing the content in your own editor if needed.',
                },
                {
                  question: 'What format is the resume in?',
                  answer:
                    'The resume is generated as a professional PDF with clean formatting, blue accent colors, and optimal spacing. It\'s ATS-friendly, print-ready, and includes clickable links for your social profiles.',
                },
                {
                  question: 'Can I generate resumes for different roles?',
                  answer:
                    'Yes! You can generate unlimited resumes. We recommend creating role-specific versions by changing your target role and emphasizing different skills for each position you apply to.',
                },
                {
                  question: 'How long does it take to generate?',
                  answer:
                    'The entire process takes about 2 minutes: 1 minute to fill in your information and 30-60 seconds for AI generation and PDF creation. Results are displayed instantly after processing.',
                },
              ]}
            />

            {/* ── CTA ── */}
            <CTASection
              badge="🚀 Ready to land your dream job?"
              title="Create Your Professional Resume Now"
              description="Join thousands of job seekers who have built impressive resumes with AI. No signup, no cost, no catch."
              primaryAction={{
                label: 'Start Building Free',
                onClick: scrollToTop,
              }}
              features={[
                '100% Free Forever',
                'AI-Powered Content',
                'Instant PDF Download',
                'Privacy Guaranteed',
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
