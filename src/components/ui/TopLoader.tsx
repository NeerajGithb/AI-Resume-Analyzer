'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Global state for loading
let isNavigating = false;
const listeners = new Set<(loading: boolean) => void>();

export const navigationStart = () => {
  isNavigating = true;
  listeners.forEach(listener => listener(true));
};

export const navigationEnd = () => {
  isNavigating = false;
  listeners.forEach(listener => listener(false));
};

export function TopLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Subscribe to global navigation events
  useEffect(() => {
    listeners.add(setLoading);
    return () => {
      listeners.delete(setLoading);
    };
  }, []);

  // Handle route change completion
  useEffect(() => {
    if (isNavigating) {
      navigationEnd();
    }
  }, [pathname, searchParams]);

  // Progress animation
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    // Start with immediate jump
    setProgress(30);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(50), 100);
    const timer2 = setTimeout(() => setProgress(70), 200);
    const timer3 = setTimeout(() => setProgress(85), 350);
    const timer4 = setTimeout(() => setProgress(95), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [loading]);

  // Complete animation when route changes
  useEffect(() => {
    if (!loading && progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [loading, progress]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-[9999] pointer-events-none">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}
      />
    </div>
  );
}

