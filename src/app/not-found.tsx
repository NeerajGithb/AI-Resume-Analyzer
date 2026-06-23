import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Icon */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-[var(--accent)]">404</div>
          <div className="w-24 h-1 bg-[var(--accent)] mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Page Not Found
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" className="w-full sm:w-auto">
              Go to Home
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" className="w-full sm:w-auto">
              View History
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-xs text-[var(--text-muted)] mb-3">Quick Links</p>
          <div className="flex flex-wrap gap-4 justify-center text-xs">
            <Link href="/" className="text-[var(--accent)] hover:underline">
              Analyze Resume
            </Link>
            <Link href="/analysis" className="text-[var(--accent)] hover:underline">
              View Results
            </Link>
            <Link href="/history" className="text-[var(--accent)] hover:underline">
              Analysis History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

