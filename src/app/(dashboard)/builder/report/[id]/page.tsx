'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const result = await getResumeById(id);
      setResumeData(result);
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

  const handleDownload = () => {
    if (!resumeData?.latexCode) return;

    // Create an HTML page that will redirect to LaTeX editor with code
    const latexEditorPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Opening LaTeX Editor...</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 600px;
    }
    h1 { color: #333; margin-bottom: 1rem; }
    p { color: #666; margin-bottom: 2rem; }
    .code-box {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      padding: 1rem;
      max-height: 300px;
      overflow: auto;
      text-align: left;
      margin-bottom: 2rem;
    }
    pre {
      margin: 0;
      font-size: 0.75rem;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: #764ba2;
      transform: translateY(-2px);
    }
    .links {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .links a {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #f0f0f0;
      color: #333;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .links a:hover {
      background: #e0e0e0;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📄 Your LaTeX Resume is Ready!</h1>
    <p>Copy the code below and paste it into any LaTeX editor:</p>
    
    <div class="code-box">
      <pre id="latexCode">${resumeData.latexCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </div>
    
    <button onclick="copyCode()">📋 Copy LaTeX Code</button>
    
    <div class="links">
      <a href="https://www.overleaf.com/project" target="_blank">Open Overleaf</a>
      <a href="https://www.papeeria.com/" target="_blank">Open Papeeria</a>
      <a href="https://latexbase.com/" target="_blank">Open LaTeXBase</a>
    </div>
    
    <p style="margin-top: 2rem; font-size: 0.875rem;">
      💡 <strong>How to use:</strong><br>
      1. Click "Copy LaTeX Code"<br>
      2. Open any LaTeX editor above<br>
      3. Create new project and paste the code<br>
      4. Click "Compile" to generate PDF
    </p>
  </div>
  
  <script>
    function copyCode() {
      const code = document.getElementById('latexCode').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('✅ LaTeX code copied to clipboard!\\n\\nNow open Overleaf and paste it.');
      }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback: select text
        const range = document.createRange();
        range.selectNode(document.getElementById('latexCode'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        alert('Code selected! Press Ctrl+C (or Cmd+C) to copy.');
      });
    }
    
    // Auto-copy on load
    window.onload = () => {
      setTimeout(() => {
        const shouldCopy = confirm('📋 Copy LaTeX code to clipboard automatically?');
        if (shouldCopy) {
          copyCode();
        }
      }, 500);
    };
  </script>
</body>
</html>
    `;

    // Open in new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(latexEditorPage);
      newWindow.document.close();
    } else {
      alert('Please allow popups to view your LaTeX code');
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading resume...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-xs)] text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Resume Ready!</h2>
                <p className="text-sm text-[var(--text-muted)]">Your professional LaTeX resume has been generated</p>
              </div>
              
              {/* LaTeX Code Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-h-48 overflow-auto">
                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                  {resumeData?.latexCode?.substring(0, 300)}...
                </pre>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  icon={<DownloadIcon />}
                >
                  View LaTeX Code & Copy
                </Button>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Opens LaTeX code → Copy → Paste in Overleaf → Compile to PDF
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/builder')}
                  icon={<EditIcon />}
                >
                  Create New Resume
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
