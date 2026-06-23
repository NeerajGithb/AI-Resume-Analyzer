import type { Metadata } from 'next';
import { Suspense } from 'react';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { TopLoader } from '@/components/ui/TopLoader';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://resupulse.app'),
  title: {
    default: 'ResuPulse — AI-Powered ATS Resume Analyzer',
    template: '%s | ResuPulse',
  },
  description:
    'Beat ATS filters and land more interviews with AI-powered resume analysis. Get an instant ATS score, keyword gap analysis, section scoring, and AI improvement suggestions in 30 seconds. Free forever.',
  keywords: [
    'resume analyzer', 'ATS score', 'ATS resume checker', 'resume review AI',
    'keyword gap analysis', 'resume improvement', 'career tools', 'job search',
    'resume builder', 'cover letter generator', 'LinkedIn optimizer',
    'resume feedback', 'beat ATS', 'applicant tracking system',
  ],
  authors: [{ name: 'ResuPulse' }],
  creator: 'ResuPulse',
  publisher: 'ResuPulse',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resupulse.app',
    siteName: 'ResuPulse',
    title: 'ResuPulse — Beat ATS Filters. Land More Interviews.',
    description:
      'AI-powered resume analysis that gives you an instant ATS score, keyword gaps, section-by-section scoring, and actionable improvement suggestions in 30 seconds. Free forever.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResuPulse — AI-Powered Resume Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuPulse — Beat ATS Filters. Land More Interviews.',
    description: 'AI-powered resume analysis with ATS scoring, keyword gaps & AI suggestions. Free forever.',
    images: ['/og-image.png'],
    creator: '@resupulse',
  },
  alternates: {
    canonical: 'https://resupulse.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ResuPulse',
              description: 'AI-powered resume analysis tool that helps job seekers beat ATS filters and land more interviews.',
              url: 'https://resupulse.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free ATS resume analysis',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '1240',
                bestRating: '5',
              },
            }),
          }}
        />
      </head>
      <body className="h-full antialiased flex flex-col">
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <Header />
        <QueryProvider>
          <main className="flex-1">{children}</main>
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}

