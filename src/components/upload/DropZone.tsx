'use client';

import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatFileSize } from '@/lib/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';

interface DropZoneProps {
  file: File | null;
  onFile: (f: File | null) => void;
  disabled?: boolean;
  error?: string | null;
}

export function DropZone({ file, onFile, disabled = false, error }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f?: File | null) => {
      if (!f) return;
      const err = !ACCEPTED_FILE_TYPES.includes(f.type)
        ? 'Only PDF files are accepted.'
        : f.size > MAX_FILE_SIZE
        ? `Max size is ${formatFileSize(MAX_FILE_SIZE)}.`
        : null;
      setLocalError(err);
      if (!err) onFile(f);
    },
    [onFile]
  );

  const displayError = error ?? localError;

  return (
    <div className="w-full space-y-2">
      {/* Fixed-height container — prevents layout shift on file select */}
      <div className="relative h-[160px]">
        <AnimatePresence mode="wait" initial={false}>
          {file ? (
            /* ── File selected state ── */
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex flex-col justify-center gap-4 p-5 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-emerald-50/40"
            >
              {/* Top row: icon + file info + remove */}
              <div className="flex items-center gap-4">
                {/* PDF icon */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white border border-violet-200 shadow-sm flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-500">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="13" y2="17" />
                  </svg>
                </div>

                {/* File name + size */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(file.size)} · PDF Document</p>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => { onFile(null); setLocalError(null); }}
                  disabled={disabled}
                  className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
                  aria-label="Remove file"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Success badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-emerald-700">File ready — click Analyze Resume below</span>
              </div>
            </motion.div>
          ) : (
            /* ── Empty / drag state ── */
            <motion.div
              key="drop"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
            >
              <div
                onDragOver={(e) => { e.preventDefault(); !disabled && setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); !disabled && handleFile(e.dataTransfer.files[0]); }}
                onClick={() => !disabled && inputRef.current?.click()}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) { e.preventDefault(); inputRef.current?.click(); } }}
                role="button"
                tabIndex={disabled ? -1 : 0}
                className={cn(
                  'h-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer select-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
                  isDragging
                    ? 'border-violet-400 bg-violet-50 scale-[1.01]'
                    : displayError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50/80 hover:border-violet-300 hover:bg-violet-50/50',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <motion.div
                  animate={{ y: isDragging ? -4 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center gap-2.5"
                >
                  {/* Upload icon */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-colors',
                    isDragging ? 'bg-violet-100 border-violet-300' : 'bg-white border-gray-200'
                  )}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={isDragging ? 'text-violet-600' : 'text-violet-500'}>
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {isDragging ? 'Drop to upload' : 'Drop your resume here'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      or <span className="text-violet-600 font-medium underline underline-offset-2">browse files</span>
                    </p>
                  </div>
                </motion.div>

                {/* Constraints row */}
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    </svg>
                    PDF only
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>Max 5 MB</span>
                  <span className="text-gray-300">·</span>
                  <span>ATS optimized</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-600 flex items-center gap-1.5 overflow-hidden"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
        disabled={disabled}
        aria-hidden="true"
      />
    </div>
  );
}