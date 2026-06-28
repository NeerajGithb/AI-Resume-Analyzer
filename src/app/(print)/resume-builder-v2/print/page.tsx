'use client';

import { useEffect, useRef, useState } from 'react';
import ModernResume, { A4_WIDTH_PX, A4_HEIGHT_PX } from '@/components/templates/ModernResume';
import type { ResumeData } from '@/components/templates/ModernResume';

export default function PrintPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [fitScale, setFitScale]     = useState(1);
  const measureRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = (window as any).__RESUME_DATA__;
    if (data) {
      setResumeData(data as ResumeData);
      return;
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 200;
    const interval = setInterval(() => {
      attempts++;
      const injected = (window as any).__RESUME_DATA__;
      if (injected) {
        clearInterval(interval);
        setResumeData(injected as ResumeData);
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
        setError('No resume data found (window.__RESUME_DATA__ missing after 10s)');
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!resumeData) return;
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const naturalHeight = el.scrollHeight;
      if (naturalHeight === 0) return;

      const scale = naturalHeight <= A4_HEIGHT_PX
        ? 1
        : Math.max(A4_HEIGHT_PX / naturalHeight, 0.55);

      setFitScale(scale);

      // ← no requestAnimationFrame, synchronous so Puppeteer never races
      if (!document.getElementById('resume-ready')) {
        const marker = document.createElement('div');
        marker.id = 'resume-ready';
        marker.style.display = 'none';
        document.body.appendChild(marker);
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [resumeData]);

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', color: 'red' }}>
        Print error: {error}
      </div>
    );
  }

  if (!resumeData) return null;

  return (
    <>
      {/* Hidden measuring div — reads natural content height at scale=1 */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: 0,
          visibility: 'hidden', pointerEvents: 'none',
          width: A4_WIDTH_PX, height: 'auto', zIndex: -1,
        }}
      >
        <div ref={measureRef} style={{ width: A4_WIDTH_PX }}>
          <ModernResume data={resumeData} scale={1} unboundedHeight />
        </div>
      </div>

      {/* Actual resume — hard-clamped to exact A4, overflow hidden */}
      <div style={{
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        maxHeight: A4_HEIGHT_PX,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        background: '#fff',
      }}>
        <ModernResume data={resumeData} scale={fitScale} />
      </div>

      <style>{`
        * { box-sizing: border-box !important; }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          width: ${A4_WIDTH_PX}px !important;
          height: ${A4_HEIGHT_PX}px !important;
          max-height: ${A4_HEIGHT_PX}px !important;
          overflow: hidden !important;
        }
      `}</style>
    </>
  );
}