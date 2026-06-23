'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Toast, ToastVariant } from '@/types';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (
      title: string,
      variant: ToastVariant = 'info',
      description?: string,
      duration = 4000
    ) => {
      const id = String(++toastIdCounter);
      const toast: Toast = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => addToast(title, 'success', description),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => addToast(title, 'error', description, 6000),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => addToast(title, 'info', description),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => addToast(title, 'warning', description),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, info, warning };
}

