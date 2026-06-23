'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/analyze': { title: 'Analyze Resume', subtitle: 'Upload your PDF resume for AI-powered ATS analysis' },
  '/analysis': { title: 'Analysis Results', subtitle: 'Your resume score, keywords, and improvement suggestions' },
  '/history': { title: 'History', subtitle: 'Your previous resume analyses' },
  '/job-match': { title: 'Job Match', subtitle: 'Compare your resume against a specific job description' },
  '/compare': { title: 'Compare Resumes', subtitle: 'Side-by-side comparison of two resumes' },
  '/builder': { title: 'Resume Builder', subtitle: 'Build an ATS-optimized resume with AI assistance' },
  '/cover-letter': { title: 'Cover Letter Generator', subtitle: 'Generate a personalized cover letter for any job' },
  '/linkedin': { title: 'LinkedIn Analyzer', subtitle: 'Optimize your LinkedIn profile for better visibility' },
};

export function TopNav() {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? PAGE_TITLES['/'];

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center border-b border-[var(--border)] bg-white/95 backdrop-blur-sm"
      style={{
        left: 'var(--sidebar-width)',
        height: 'var(--topnav-height)',
      }}
    >
      <div className="flex items-center px-6 w-full">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-[var(--text-primary)] leading-none truncate">
            {page.title}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{page.subtitle}</p>
        </div>
      </div>
    </header>
  );
}

