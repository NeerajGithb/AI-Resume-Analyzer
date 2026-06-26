import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Match Results | AI Resume Analyzer',
  description: 'View your resume-to-job match analysis with detailed compatibility scores, matched and missing keywords, requirements breakdown, and AI-powered recommendations.',
  keywords: [
    'job match results',
    'resume job fit',
    'ATS match score',
    'job description comparison',
    'resume keyword match',
    'job requirements analysis',
    'application readiness',
    'resume compatibility',
  ],
  robots: {
    index: false, // Don't index individual results
    follow: true,
  },
  openGraph: {
    title: 'Job Match Analysis Results',
    description: 'See how well your resume matches the job requirements with detailed AI analysis',
    type: 'website',
  },
};
