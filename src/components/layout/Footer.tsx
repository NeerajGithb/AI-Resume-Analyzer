'use client';

import Link from 'next/link';
import { useState } from 'react';

function LogoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="10" fill="url(#fLogoGrad)" />
      <path d="M10 25L17 10L24 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12.5" y1="20" x2="21.5" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="fLogoGrad" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const LINKS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: 'Resume Analyzer', href: '/analyze' },
    { label: 'Resume Builder', href: '/builder' },
    { label: 'Job Match', href: '/job-match' },
    { label: 'Compare Resumes', href: '/compare' },
    { label: 'Cover Letter AI', href: '/cover-letter' },
    { label: 'LinkedIn Optimizer', href: '/linkedin' },
    { label: 'Analysis History', href: '/history' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog & Resources', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: "What's New", href: '/changelog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const SOCIALS = [
  {
    label: 'GitHub', href: '#',
    icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  },
  {
    label: 'Twitter/X', href: '#',
    icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  },
  {
    label: 'LinkedIn', href: '#',
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  },
];

const TRUST = [
  { icon: '🔒', text: 'Privacy First' },
  { icon: '⚡', text: 'Results in 30s' },
  { icon: '✓', text: 'Free Forever' },
  { icon: '🤖', text: 'Powered by Llama 3.3' },
  { icon: '📄', text: 'PDF Export Included' },
  { icon: '🌍', text: '50,000+ Users' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Brand — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <LogoIcon />
              <div>
                <p className="text-[15px] font-bold text-white leading-none">ResuPulse</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-none">AI-Powered Resume Analyzer</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Beat ATS filters and land more interviews with AI-powered resume analysis.
              Instant scores, keyword gaps, and actionable suggestions — free forever.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Weekly resume tips
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  You're subscribed! 🎉
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setSubscribed(true); }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
              <p className="text-xs text-gray-600 mt-2">No spam. Unsubscribe anytime.</p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — 4 cols (1 each) */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="lg:col-span-1">
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-widest mb-5">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-x-8 gap-y-2">
          {TRUST.map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span>{icon}</span>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {year} ResuPulse. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-gray-400 transition-colors">Cookies</Link>
            <span className="flex items-center gap-1">
              Built with <span className="text-rose-500 mx-0.5">♥</span> using Next.js &amp; Llama 3.3
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

