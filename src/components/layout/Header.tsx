'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

function LogoIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect width="30" height="30" rx="9" fill="url(#hLogoGrad)" />
      <path d="M9 22L15 9L21 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="11.5" y1="17.5" x2="18.5" y2="17.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="hLogoGrad" x1="0" y1="0" x2="30" y2="30">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

const TOOLS = [
  { href: '/analyze', label: 'Resume Analyzer', desc: 'Get instant ATS score & feedback', emoji: '📊' },
  { href: '/builder', label: 'Resume Builder', desc: 'Build ATS-optimized resume from scratch', emoji: '🛠' },
  { href: '/job-match', label: 'Job Match', desc: 'Match your resume to any job posting', emoji: '🎯' },
  { href: '/compare', label: 'Compare Resumes', desc: 'Side-by-side ATS comparison', emoji: '⚖️' },
  { href: '/cover-letter', label: 'Cover Letter AI', desc: 'Generate personalized cover letters', emoji: '✉️' },
  { href: '/linkedin', label: 'LinkedIn Optimizer', desc: 'Optimize your LinkedIn profile', emoji: '💼' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  useEffect(() => {
    setMobileOpen(false);
    setShowTools(false);
    setShowUserMenu(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;
  const isToolActive = TOOLS.some(t => pathname?.startsWith(t.href));

  const navLinkCls = (href: string) => {
    const active = isActive(href);
    return active
      ? 'text-violet-600 bg-violet-50 px-3.5 py-2 rounded-lg text-sm font-medium'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors';
  };

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
    router.push('/');
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (email: string) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-green-500', 'bg-teal-500', 'bg-orange-500', 'bg-red-500'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <LogoIcon />
            <div>
              <span className="text-[15px] font-bold leading-none block text-gray-900">
                ResuPulse
              </span>
              <span className="text-[10px] leading-none block mt-0.5 text-gray-400">
                Resume Analyzer
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowTools(true)}
              onMouseLeave={() => setShowTools(false)}
            >
              <button
                className={[
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isToolActive ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                ].join(' ')}
              >
                Tools
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`transition-transform duration-200 ${showTools ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <AnimatePresence>
                {showTools && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    onMouseEnter={() => setShowTools(true)}
                    onMouseLeave={() => setShowTools(false)}
                  >
                    <div className="p-3 grid grid-cols-2 gap-1">
                      {TOOLS.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors group"
                        >
                          <span className="text-xl mt-0.5 leading-none">{tool.emoji}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{tool.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
                      <Link href="/analyze" className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                        Start with Resume Analyzer — Free →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkCls(href)}>
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA / User Profile */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  href="/history"
                  className={cn(
                    'text-sm font-medium px-3.5 py-2 rounded-lg transition-colors',
                    isActive('/history') ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  History
                </Link>
                
                {/* User Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onMouseEnter={() => setShowUserMenu(true)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow',
                      user?.email ? getAvatarColor(user.email) : 'bg-gray-500'
                    )}>
                      {user?.name ? getUserInitials(user.name) : 'U'}
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onMouseLeave={() => setShowUserMenu(false)}
                        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-violet-50 to-blue-50">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md',
                              user?.email ? getAvatarColor(user.email) : 'bg-gray-500'
                            )}>
                              {user?.name ? getUserInitials(user.name) : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/analyze"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Analyze Resume
                          </Link>
                          <Link
                            href="/history"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            My History
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M12 1v6m0 6v6m0-18a9 9 0 100 18 9 9 0 000-18z" />
                            </svg>
                            Settings
                          </Link>
                          <div className="my-1 border-t border-gray-100"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium px-3.5 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/analyze"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Analyze Resume
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle navigation"
            className="md:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white pt-16 overflow-y-auto"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-5 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 pb-2">Tools</p>
              {TOOLS.map(({ href, label, emoji }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
              <div className="pt-3 pb-1">
                <div className="h-px bg-gray-100" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 pb-2 pt-1">Company</p>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/history"
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-violet-600 border-2 border-violet-200 hover:bg-violet-50 transition-colors"
                    >
                      My History
                    </Link>
                    <Link
                      href="/analyze"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600"
                    >
                      Analyze Resume →
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-violet-600 border-2 border-violet-200 hover:bg-violet-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/analyze"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600"
                    >
                      Analyze Resume Free →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

