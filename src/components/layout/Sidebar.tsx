'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="var(--accent)" />
      <path
        d="M7 17L12 7L17 17"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="9" y1="13" x2="15" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { href: '/analyze', label: 'Analyze Resume', icon: <UploadIcon /> },
  { href: '/analysis', label: 'Results', icon: <BarChartIcon /> },
  { href: '/history', label: 'History', icon: <ClockIcon /> },
  { href: '/job-match', label: 'Job Match', icon: <BriefcaseIcon /> },
  { href: '/compare', label: 'Compare Resumes', icon: <CompareIcon /> },
  { href: '/builder', label: 'Resume Builder', icon: <EditIcon /> },
  { href: '/cover-letter', label: 'Cover Letter', icon: <FileTextIcon /> },
  { href: '/linkedin', label: 'LinkedIn Analyzer', icon: <LinkedInIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-[var(--border)] bg-white"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 border-b border-[var(--border)]" style={{ height: 'var(--topnav-height)' }}>
        <LogoIcon />
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-primary)] leading-none">ResuPulse</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Resume Analyzer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Main navigation">
        <p className="px-2 pt-1 pb-2 text-[10px] font-semibold tracking-wider text-[var(--text-subtle)] uppercase">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-md)] text-sm',
                'transition-colors duration-100',
                isActive
                  ? 'bg-[var(--accent-light)] text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-gray-100 hover:text-[var(--text-primary)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={cn(isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--border)] space-y-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </Link>
        <p className="text-[10px] text-[var(--text-subtle)]">
          Powered by Groq · Llama 3.3
        </p>
      </div>
    </aside>
  );
}

