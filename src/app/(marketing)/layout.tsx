import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ResuPulse — AI-Powered ATS Resume Analyzer',
  description: 'Get an instant ATS score, keyword gap analysis, and AI-powered improvement suggestions in 30 seconds. Free forever.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

