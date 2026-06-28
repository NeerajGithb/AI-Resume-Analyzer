// Bare layout for Puppeteer-rendered pages.
// No Header, no Footer, no QueryProvider wrapper — just the page.
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { inter } from '@/lib/fonts';
import { QueryProvider } from '@/components/providers/QueryProvider';
import '../globals.css';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, padding: 0, background: '#fff' }}>
        <Suspense fallback={null}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
