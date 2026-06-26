'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

const VALUES = [
  { icon: '🎯', title: 'Precision Over Fluff', desc: 'We give you specific, data-driven feedback — not generic advice. Every suggestion is grounded in how real ATS systems work.' },
  { icon: '🔒', title: 'Privacy First', desc: "Your resume is analyzed in memory and never stored. We don't read what we don't need, and we never sell your data." },
  { icon: '⚡', title: 'Speed Matters', desc: 'Results in under 30 seconds. Job searching is stressful enough — we make our tool instant.' },
  { icon: '🌍', title: 'Accessible to All', desc: 'The core tool is free forever. Everyone deserves a fair shot at the job market, regardless of budget.' },
];

const TEAM = [
  { name: 'Alex Chen', role: 'Founder & CEO', bio: 'Ex-Google engineer who got rejected 47 times before landing his dream job. Built ResuPulse to solve the ATS problem he lived through.', emoji: '👨‍💻', color: '#7c3aed' },
  { name: 'Maya Patel', role: 'Head of AI', bio: 'PhD in NLP from MIT. Previously built resume screening systems at LinkedIn — now using that knowledge to help candidates, not filter them out.', emoji: '🤖', color: '#ec4899' },
  { name: 'Jordan Rivera', role: 'Head of Product', bio: '10+ years in career coaching and HR. Brings the human perspective to make sure our AI advice is actually useful, not just technically correct.', emoji: '🎯', color: '#059669' },
];

const TECH_STACK = [
  { name: 'Next.js 15', role: 'Frontend Framework', color: '#000' },
  { name: 'TypeScript', role: 'Type Safety', color: '#3178c6' },
  { name: 'Express.js', role: 'Backend API', color: '#68a063' },
  { name: 'Groq Cloud', role: 'AI Inference', color: '#f55036' },
  { name: 'Llama 3.3 70B', role: 'Language Model', color: '#7c3aed' },
  { name: 'MongoDB', role: 'Database', color: '#00ed64' },
];

const TIMELINE = [
  { date: 'Jan 2024', title: 'The Idea', desc: 'Alex gets rejected from 47 jobs. Discovers his resume was being filtered by ATS before any human saw it.' },
  { date: 'Mar 2024', title: 'First Prototype', desc: 'Built a basic ATS scorer in a weekend. Shared it with friends — 200 signups in 48 hours.' },
  { date: 'Jun 2024', title: 'Public Launch', desc: 'Launched to the public with keyword analysis and AI suggestions. Hit 10,000 users in month 1.' },
  { date: 'Dec 2024', title: '50,000 Users', desc: 'Crossed 50,000 analyzed resumes. Added Resume Builder, Job Match, and LinkedIn Optimizer.' },
  { date: '2025', title: 'The Future', desc: 'Pro plan, API access, team workspaces, and even more AI tools coming soon.' },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: 'linear-gradient(150deg,#0b0614 0%,#16062a 60%,#0a0e1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 600, height: 600, background: 'radial-gradient(circle,rgba(124,58,237,0.5),transparent 70%)', top: -150, left: -100 }} />
          <div className="absolute rounded-full opacity-20" style={{ width: 400, height: 400, background: 'radial-gradient(circle,rgba(236,72,153,0.4),transparent 70%)', bottom: -80, right: -60 }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">🤝 Our Mission</div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Built to give everyone a <span className="gradient-text">fair shot</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              We believe talent shouldn't be filtered out by bad resume formatting. ResuPulse was built to democratize access to the kind of professional resume coaching that used to cost hundreds of dollars.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top,#f9fafb,transparent)' }} />
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ stat: '75%', label: 'Resumes rejected before a human sees them', color: '#dc2626' }, { stat: '50k+', label: 'Resumes analyzed on ResuPulse', color: '#7c3aed' }, { stat: '94%', label: 'Users who improved their ATS score', color: '#059669' }, { stat: '4.9★', label: 'Average user satisfaction rating', color: '#f59e0b' }].map(({ stat, label, color }, i) => (
            <FadeUp key={stat} delay={i * 0.08} className="text-center">
              <div className="text-4xl font-extrabold mb-2" style={{ color }}>{stat}</div>
              <div className="text-xs text-gray-500 leading-snug">{label}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-violet-100 text-violet-700 border border-violet-200">📖 The Problem</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-snug">
              75% of resumes never reach a human — they're rejected by <span className="gradient-text">Applicant Tracking Systems</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">ATS software filters out candidates based on keyword matching, formatting, and section structure — before any human ever sees the resume. The problem is, most people have no idea how these systems work.</p>
            <p className="text-gray-500 leading-relaxed">We built ResuPulse to expose exactly how ATS systems evaluate your resume, so you can make targeted improvements and stop being filtered out unfairly.</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="rounded-sm p-8 border border-violet-100 bg-gradient-to-br from-violet-50 to-pink-50">
              <div className="space-y-4">
                {[{ pct: 75, label: 'Resumes rejected by ATS', color: '#dc2626' }, { pct: 63, label: 'Jobs never see qualified candidates', color: '#f59e0b' }, { pct: 94, label: 'ResuPulse users who improved', color: '#7c3aed' }].map(({ pct, label, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-pink-100 text-pink-700 border border-pink-200">💡 Our Values</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What we stand for</h2>
            <p className="text-gray-500 leading-relaxed">These principles guide every decision we make about the product.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map(({ icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div className="feature-card bg-white rounded-sm p-6 border border-gray-100 flex gap-4 shadow-[0_4px_28px_rgba(0,0,0,0.07)]">
                  <div className="text-3xl flex-shrink-0">{icon}</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-emerald-100 text-emerald-700 border border-emerald-200">👥 The Team</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built by people who've been there</h2>
            <p className="text-gray-500 leading-relaxed">We're not just engineers — we're people who've felt the frustration of being qualified but filtered out.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(({ name, role, bio, emoji, color }, i) => (
              <FadeUp key={name} delay={i * 0.1}>
                <div className="bg-white rounded-sm p-6 border border-gray-100 text-center shadow-[0_4px_28px_rgba(0,0,0,0.07)]">
                  <div className="w-16 h-16 rounded-sm flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: `${color}15` }}>{emoji}</div>
                  <h3 className="text-base font-bold text-gray-900">{name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3 mt-1" style={{ color }}>{role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{bio}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-amber-100 text-amber-700 border border-amber-200">📅 Our Story</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">From rejected to 50k users</h2>
          </FadeUp>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 to-pink-200" />
            <div className="space-y-8">
              {TIMELINE.map(({ date, title, desc }, i) => (
                <FadeUp key={date} delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 border-violet-200 z-10">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                    </div>
                    <div className="pb-2 pt-1">
                      <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">{date}</p>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-blue-100 text-blue-700 border border-blue-200">🛠 Tech Stack</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built with modern tools</h2>
            <p className="text-gray-500 leading-relaxed">We use the best-in-class technologies to deliver fast, reliable, and accurate results.</p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECH_STACK.map(({ name, role, color }, i) => (
              <FadeUp key={name} delay={i * 0.06}>
                <div className="bg-white rounded-sm p-4 border border-gray-100 flex items-center gap-4 shadow-[0_4px_28px_rgba(0,0,0,0.07)]">
                  <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-400">{role}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to improve your resume?</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Try it free — no signup, no credit card needed.</p>
            <Link href="/analyze" className="inline-flex items-center gap-2 px-8 py-4 rounded-sm font-bold text-violet-700 bg-white hover:bg-gray-50 transition-all hover:scale-[1.02] text-[15px]">
              Analyze My Resume Free →
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

