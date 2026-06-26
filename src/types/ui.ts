// ─── UI Types ─────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

export type KeywordStatus = 'present' | 'missing' | 'partial';

export interface KeywordChip {
  word: string;
  status: KeywordStatus;
  category: 'technical' | 'soft_skills' | 'industry';
}
