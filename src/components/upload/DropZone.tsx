'use client';

import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatFileSize } from '@/lib/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';

interface DropZoneProps {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
  error?: string | null;
}

function FileIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-[var(--text-subtle)]">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function DropZone({ file, onFile, disabled = false, error }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
      return 'Only PDF files are accepted.';
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const validationError = validateFile(f);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      setLocalError(null);
      onFile(f);
    },
    [validateFile, onFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [disabled, handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFile(selectedFile);
      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    [handleFile]
  );

  // Parent errors (from API/external sources) take priority over local validation errors
  // This ensures server-side errors are always shown even if there's also a local validation error
  const displayError = error ?? localError;

  return (
    <div className="w-full space-y-2">
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-[var(--radius-lg)]"
          >
            <div className="shrink-0 w-9 h-9 bg-white rounded-[var(--radius-md)] border border-emerald-200 flex items-center justify-center shadow-[var(--shadow-xs)]">
              <FileIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{file.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatFileSize(file.size)} · PDF</p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <CheckIcon />
                Ready
              </div>
              <button
                type="button"
                onClick={() => { onFile(null); setLocalError(null); }}
                disabled={disabled}
                className={cn(
                  'p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] border border-transparent',
                  'hover:bg-white hover:border-[var(--border)] hover:text-[var(--text-secondary)]',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
                aria-label="Remove file"
              >
                <XIcon />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !disabled && inputRef.current?.click()}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label="Upload resume PDF"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!disabled) inputRef.current?.click();
                }
              }}
              className={cn(
                'relative flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)]',
                'border-2 border-dashed cursor-pointer select-none',
                'transition-colors duration-150',
                'py-12 px-8',
                isDragging
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                  : displayError
                    ? 'border-red-300 bg-red-50 hover:border-red-400'
                    : 'border-gray-200 bg-gray-50 hover:border-[var(--accent)] hover:bg-[var(--accent-light)]',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <motion.div
                animate={{ y: isDragging ? -4 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={cn(
                  'w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center border',
                  isDragging
                    ? 'bg-[var(--accent-light)] border-purple-200'
                    : 'bg-white border-[var(--border)]',
                  'shadow-[var(--shadow-xs)]'
                )}>
                  <UploadIcon />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {isDragging ? 'Drop your resume here' : 'Drop your resume here'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    or{' '}
                    <span className="text-[var(--accent)] font-medium underline underline-offset-2">
                      browse files
                    </span>
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-4 text-[10px] text-[var(--text-subtle)]">
                <span className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  </svg>
                  PDF only
                </span>
                <span>·</span>
                <span>Max 5 MB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-600 flex items-center gap-1 overflow-hidden"
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
        onChange={handleInputChange}
        disabled={disabled}
        aria-hidden="true"
      />
    </div>
  );
}

