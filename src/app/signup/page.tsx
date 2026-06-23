'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import * as authService from '@/services/authService';
import { ApiError } from '@/lib/httpClient';

const PERKS = [
  { icon: '🎯', text: '94% of users improve their ATS score' },
  { icon: '⚡', text: 'Results in 30 seconds — no waiting' },
  { icon: '🤖', text: 'Powered by Llama 3.3 70B AI' },
  { icon: '📊', text: 'Track your progress with history' },
  { icon: '🔒', text: 'Your data stays private, always' },
  { icon: '✓', text: 'Free plan — no credit card needed' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
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
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const response = await authService.signup({ name, email, password });
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
      {/* Left — form */}
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 min-h-screen md:min-h-0 order-2 md:order-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
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
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account 🚀</h1>
            <p className="text-sm text-gray-500">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input id="name" type="text" value={name} autoComplete="name"
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input id="email" type="email" value={email} autoComplete="email"
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="password" type={showPwd ? 'text' : 'password'} value={password} autoComplete="new-password"
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPwd ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${password.length >= (i + 1) * 3 ? (password.length >= 12 ? 'bg-emerald-500' : password.length >= 8 ? 'bg-amber-400' : 'bg-red-400') : 'bg-gray-200'}`} />
                  ))}
                </div>
              )}
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
              Create Free Account
            </Button>

            <p className="text-[11px] text-gray-400 text-center">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
            </p>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-gray-50 text-xs text-gray-400">or</span></div>
          </div>

          <Link href="/analyze" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all">
            Skip — Analyze Resume Without Account
          </Link>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-800 transition-colors">Log in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden order-1 md:order-2" style={{ background: 'linear-gradient(145deg,#0b0614 0%,#16062a 100%)' }}>
        <div className="absolute rounded-full opacity-30 w-96 h-96 -top-24 -right-24" style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.6),transparent 70%)' }} />
        <div className="absolute rounded-full opacity-20 w-72 h-72 bottom-0 left-0" style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.5),transparent 70%)' }} />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#signupLogoGrad)" />
              <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="13" y1="21" x2="23" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="signupLogoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-white">ResuPulse</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white mb-3 leading-snug">
            Join 50,000+<br />professionals landing<br /><span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">their dream jobs</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 text-sm">Everything you need to go from rejected to hired.</p>

          <div className="space-y-4">
            {PERKS.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg shrink-0">{icon}</div>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[{ val: '50k+', label: 'Users' }, { val: '94%', label: 'Score Boost' }, { val: '4.9★', label: 'Rating' }].map(({ val, label }) => (
            <div key={label} className="bg-white/8 rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-extrabold text-white">{val}</div>
              <div className="text-[11px] text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

