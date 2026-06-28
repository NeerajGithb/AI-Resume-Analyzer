'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

// ─── Input classes ────────────────────────────────────────────────────────────
export const inputCls =
  'w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50';

export const textareaCls = `${inputCls} resize-none`;

// ─── CopyBlock ────────────────────────────────────────────────────────────────
export function CopyBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <div className="px-4 py-3.5 bg-white">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
      </div>
    </div>
  );
}