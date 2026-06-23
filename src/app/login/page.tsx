'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import * as authService from '@/services/authService';
import { ApiError } from '@/lib/httpClient';
import type { Metadata } from 'next';

const BENEFITS = [
  { icon: '📊', title: 'Instant ATS Score', desc: 'Get a 0–100 score in 30 seconds' },
  { icon: '🔍', title: 'Keyword Gap Analysis', desc: 'Find missing keywords recruiters look for' },
  { icon: '✏️', title: 'AI Improvement Tips', desc: 'Before/after rewrites for weak sections' },
  { icon: '📄', title: 'PDF Report Download', desc: 'Share your full analysis report' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setAuth(response.data.user, response.data.token);
      router.push('/analyze');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#0b0614 0%,#1e0a33 100%)' }}>
        {/* Orbs */}
        <div className="absolute rounded-full opacity-30 w-96 h-96 -top-24 -left-24" style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.6),transparent 70%)' }} />
        <div className="absolute rounded-full opacity-20 w-72 h-72 bottom-0 right-0" style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.5),transparent 70%)' }} />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#loginLogoGrad)" />
              <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="13" y1="21" x2="23" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-white">ResuPulse</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white mb-3 leading-snug">
            Your career journey<br />starts with a great resume
          </h2>
          <p className="text-gray-400 leading-relaxed mb-12 text-sm">
            Join 50,000+ professionals who use ResuPulse to beat ATS filters and land more interviews.
          </p>

          <div className="space-y-5">
            {BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">{icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/8 rounded-2xl p-5 border border-white/10">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>)}
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">"My ATS score went from 52 to 91 in one session. Got 4 interview callbacks the following week."</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">SM</div>
            <div>
              <p className="text-xs font-semibold text-white">Sarah M.</p>
              <p className="text-[10px] text-gray-500">Software Engineer · Now at Google</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 min-h-screen md:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#7c3aed" />
              <path d="M8 20L14 8L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="10.5" y1="15.5" x2="17.5" y2="15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-base font-bold text-gray-900">ResuPulse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back 👋</h1>
            <p className="text-sm text-gray-500">Log in to access your resume analyses</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                id="email" type="email" value={email} autoComplete="email"
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  id="password" type={showPwd ? 'text' : 'password'} value={password} autoComplete="current-password"
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPwd ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-700">{error}</p>
              </motion.div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading} disabled={isLoading}>
              Log In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-gray-50 text-xs text-gray-400">or continue without account</span></div>
          </div>

          <Link href="/analyze" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all">
            Analyze Resume Free (No Login)
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-violet-600 font-semibold hover:text-violet-800 transition-colors">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

