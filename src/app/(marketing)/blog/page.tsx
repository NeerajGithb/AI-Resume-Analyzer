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

const BLOG_POSTS = [
  {
    slug: 'beat-ats-2026',
    title: 'How to Beat ATS Filters in 2026: The Complete Guide',
    excerpt: '75% of resumes never reach a human. Learn the exact strategies top candidates use to get past Applicant Tracking Systems and land more interviews.',
    category: 'ATS Tips',
    readTime: '12 min',
    date: 'Jun 20, 2026',
    featured: true,
  },
  {
    slug: 'top-10-resume-mistakes',
    title: '10 Resume Mistakes That Will Get You Rejected (And How to Fix Them)',
    excerpt: 'From vague bullet points to bad formatting, these common mistakes are costing you interviews. Here is how to fix each one.',
    category: 'Resume Writing',
    readTime: '8 min',
    date: 'Jun 15, 2026',
    featured: true,
  },
  {
    slug: 'keywords-that-get-interviews',
    title: 'The 50 Resume Keywords That Actually Get You Interviews',
    excerpt: 'Not all keywords are created equal. These 50 high-impact terms are what recruiters and ATS systems actively search for.',
    category: 'Keywords',
    readTime: '10 min',
    date: 'Jun 10, 2026',
    featured: false,
  },
  {
    slug: 'remote-work-resume-tips',
    title: 'How to Write a Resume for Remote Jobs in 2026',
    excerpt: 'Remote work requires a different resume approach. Learn how to highlight async communication, self-management, and virtual collaboration skills.',
    category: 'Remote Work',
    readTime: '9 min',
    date: 'Jun 5, 2026',
    featured: false,
  },
  {
    slug: 'career-change-resume-guide',
    title: 'Career Change Resume Guide: How to Pivot Without Starting Over',
    excerpt: 'Switching careers? Your resume needs to emphasize transferable skills, not just job titles. Here is how to position yourself for a new industry.',
    category: 'Career Change',
    readTime: '11 min',
    date: 'May 30, 2026',
    featured: false,
  },
  {
    slug: 'quantify-achievements',
    title: 'How to Quantify Your Achievements (Even Without Hard Numbers)',
    excerpt: 'The most powerful resumes use metrics. But what if you do not have revenue numbers or percentages? Here is how to add impact anyway.',
    category: 'Resume Writing',
    readTime: '7 min',
    date: 'May 25, 2026',
    featured: false,
  },
  {
    slug: 'linkedin-ats-optimization',
    title: 'LinkedIn SEO: How to Rank Higher in Recruiter Searches',
    excerpt: 'Your LinkedIn profile has its own search algorithm. Optimize your headline, summary, and skills to show up when recruiters are hiring.',
    category: 'LinkedIn',
    readTime: '8 min',
    date: 'May 20, 2026',
    featured: false,
  },
  {
    slug: 'cover-letter-templates',
    title: '5 Cover Letter Templates That Actually Work (With Examples)',
    excerpt: 'Most cover letters are ignored. These 5 templates get read because they tell a story, show enthusiasm, and match the job requirements.',
    category: 'Cover Letters',
    readTime: '10 min',
    date: 'May 15, 2026',
    featured: false,
  },
];

const CATEGORIES = ['All', 'ATS Tips', 'Resume Writing', 'Keywords', 'Remote Work', 'Career Change', 'LinkedIn', 'Cover Letters'];

export default function BlogPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0b0614 0%, #16062a 60%, #0a0e1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)', top: -150, left: '50%', transform: 'translateX(-50%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              📚 Blog & Resources
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Resume tips from <span className="gradient-text">the experts</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Actionable advice on ATS optimization, resume writing, keywords, and career strategy.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, #f9fafb, transparent)' }} />
      </section>

      {/* Categories filter */}
      <section className="py-8 bg-gray-50 border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-gray-50/90">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="flex flex-wrap gap-3 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    cat === 'All'
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Featured posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-violet-500 to-pink-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            <p className="text-sm text-gray-500 ml-7">Must-read guides for job seekers</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.filter((p) => p.featured).map((post, i) => (
              <FadeUp key={post.slug} delay={i * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-2xl p-8 border border-gray-100 hover:border-violet-200 transition-all group shadow-[0_4px_28px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.15)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.readTime} read</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 group-hover:gap-3 transition-all">
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* All posts */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
            </div>
            <p className="text-sm text-gray-500 ml-7">Browse our complete library</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.filter((p) => !p.featured).map((post, i) => (
              <FadeUp key={post.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-violet-200 transition-all group h-full shadow-[0_4px_28px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.1)]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span>{post.date}</span>
                    <span className="text-violet-600 font-semibold group-hover:underline">Read →</span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <FadeUp className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              📬 Stay Updated
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get resume tips in your inbox</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Weekly insights on ATS optimization, job search strategies, and career growth. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to optimize your resume?</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Put these tips into action. Analyze your resume and get personalized AI suggestions in 30 seconds.
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

