'use client';

import { useState, useRef } from 'react';
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

const CONTACT_METHODS = [
  {
    icon: '📧',
    title: 'Email Support',
    desc: 'Get help from our support team',
    link: 'mailto:support@resupulse.app',
    label: 'support@resupulse.app',
    color: '#7c3aed',
  },
  {
    icon: '🐛',
    title: 'Report a Bug',
    desc: 'Found an issue? Let us know',
    link: 'mailto:bugs@resupulse.app',
    label: 'bugs@resupulse.app',
    color: '#ec4899',
  },
  {
    icon: '💡',
    title: 'Feature Requests',
    desc: 'Suggest new features',
    link: 'mailto:feedback@resupulse.app',
    label: 'feedback@resupulse.app',
    color: '#059669',
  },
];

const FAQ_QUICK_LINKS = [
  { q: 'How does the ATS score work?', link: '/faq#ats-score' },
  { q: 'Is my resume data private?', link: '/privacy' },
  { q: 'Can I download my analysis?', link: '/faq#export' },
  { q: 'What file formats are supported?', link: '/faq#formats' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In production, you'd send this to your backend API
    console.log('Form submitted:', formData);
    
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
              💬 Get in Touch
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              We're here to <span className="gradient-text">help</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Have a question, feedback, or need support? Reach out and we'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, #f9fafb, transparent)' }} />
      </section>

      {/* Contact methods */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose your preferred contact method</h2>
            <p className="text-gray-500">We're available via email and respond within 24 hours.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_METHODS.map(({ icon, title, desc, link, label, color }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <a
                  href={link}
                  className="block bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 transition-all group shadow-[0_4px_28px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.15)]"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}15` }}>
                    {icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{desc}</p>
                  <span className="text-xs font-semibold" style={{ color }}>{label} →</span>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a message</h2>
            <p className="text-gray-500">Fill out the form and we'll respond within 24 hours.</p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="support">General Support</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-sm text-emerald-700 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Message sent!</strong> We'll get back to you within 24 hours.</span>
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> Something went wrong. Please try again or email us directly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message →'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By submitting this form, you agree to our{' '}
                <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </FadeUp>
        </div>
      </section>

      {/* FAQ quick links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Before you reach out...</h2>
            <p className="text-gray-500">Check if your question is answered in our FAQ</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQ_QUICK_LINKS.map(({ q, link }) => (
                <Link
                  key={q}
                  href={link}
                  className="block p-4 rounded-xl bg-white border border-gray-100 hover:border-violet-200 transition-all group"
                >
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-violet-600 transition-colors">{q}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700">
                View All FAQs
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Response time info */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-violet-50 border border-violet-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl flex-shrink-0">
                ⏱
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-violet-900">Average Response Time</p>
                <p className="text-xs text-violet-700">We typically respond within 12–24 hours on business days (Mon–Fri, 9 AM–5 PM PST)</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try ResuPulse for free</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              No signup required. Get your ATS score and improvement suggestions in 30 seconds.
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


