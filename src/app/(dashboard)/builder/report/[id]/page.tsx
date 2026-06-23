'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import { getResumeById } from '@/services/resumeBuilderService';
import { ApiError } from '@/lib/httpClient';

function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}

function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}

export default function BuilderResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [resumeData, setResumeData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [compilingPdf, setCompilingPdf] = useState(false);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const result = await getResumeById(id);
      setResumeData(result);
      // Auto-compile PDF on load
      compilePdfPreview();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to load resume');
      }
      router.push('/builder');
    } finally {
      setLoading(false);
    }
  };

  const compilePdfPreview = async () => {
    setCompilingPdf(true);
    try {
      // Use our backend endpoint with Puppeteer HTML→PDF
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/builder/compile-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: id }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('PDF compilation failed:', error);
        alert('Failed to compile PDF. Please try again.');
        setPdfUrl('');
      }
    } catch (error) {
      console.error('Failed to compile PDF:', error);
      alert('Failed to compile PDF. Please check your connection.');
      setPdfUrl('');
    } finally {
      setCompilingPdf(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'resume.pdf';
      a.click();
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading resume...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-white"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/builder')}
              icon={<EditIcon />}
            >
              New Resume
            </Button>
            <div className="h-4 w-px bg-[var(--border)]" />
            <div>
              <h1 className="text-sm font-semibold">Resume Preview</h1>
              <p className="text-xs text-[var(--text-muted)]">Your professional resume</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              icon={<DownloadIcon />}
              disabled={!pdfUrl}
            >
              Download PDF
            </Button>
          </div>
        </motion.div>

        {/* PDF Preview - Full Width */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 overflow-auto">
          {compilingPdf ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-[var(--text-muted)]">Generating your resume...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border border-[var(--border)] rounded bg-white shadow-lg"
              style={{ maxWidth: '8.5in', maxHeight: '11in' }}
              title="PDF Preview"
            />
          ) : (
            <div className="text-center max-w-md">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-[var(--text-muted)] mb-3">Loading your resume...</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
