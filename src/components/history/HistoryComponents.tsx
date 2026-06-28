'use client';

import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Pagination } from '@/components/ui/Pagination';
import { GradeBadge } from '@/components/shared/ScoreBadge';
import { formatDate, formatFileSize, cn } from '@/lib/utils';
import type { HistoryItem } from '@/types';

// ─── Score Indicator ──────────────────────────────────────────────────────────

function ScoreIndicator({ score }: { score: number }) {
  const color =
    score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  return <span className={cn('text-sm font-bold tabular-nums', color)}>{score}</span>;
}

// ─── History Row ──────────────────────────────────────────────────────────────

interface HistoryRowProps {
  item:       HistoryItem;
  onClick:    () => void;
  isSelected: boolean;
  onSelect:   (checked: boolean) => void;
}

export function HistoryRow({ item, onClick, isSelected, onSelect }: HistoryRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border-b border-[var(--border)] hover:bg-gray-50 transition-colors duration-100"
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
        />
      </td>
      <td className="px-4 py-3 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)]">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[200px]">{item.fileName}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{formatFileSize(item.fileSize)}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 cursor-pointer" onClick={onClick}>
        <ScoreIndicator score={item.overall_score} />
        <span className="text-xs text-[var(--text-muted)]">/100</span>
      </td>
      <td className="px-4 py-3 cursor-pointer" onClick={onClick}>
        <GradeBadge grade={item.grade} />
      </td>
      <td className="px-4 py-3 cursor-pointer" onClick={onClick}>
        <span className="text-xs text-[var(--text-muted)]">{formatDate(item.createdAt)}</span>
      </td>
      <td className="px-4 py-3 text-right cursor-pointer" onClick={onClick}>
        <span className="text-xs text-[var(--accent)] font-medium hover:underline">View →</span>
      </td>
    </motion.tr>
  );
}

// ─── History Table ─────────────────────────────────────────────────────────────

interface HistoryTableProps {
  items:         HistoryItem[];
  selectedItems: Set<string>;
  onItemClick:   (item: HistoryItem) => void;
  onSelectItem:  (id: string, checked: boolean) => void;
  onSelectAll:   (checked: boolean) => void;
}

export function HistoryTable({
  items,
  selectedItems,
  onItemClick,
  onSelectItem,
  onSelectAll,
}: HistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-gray-50">
            <th className="px-4 py-2.5 text-left">
              <input
                type="checkbox"
                checked={selectedItems.size === items.length && items.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
            </th>
            {['File', 'Score', 'Grade', 'Date', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <HistoryRow
              key={item._id}
              item={item}
              onClick={() => onItemClick(item)}
              isSelected={selectedItems.has(item._id)}
              onSelect={(checked) => onSelectItem(item._id, checked)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── History Filters ──────────────────────────────────────────────────────────

type ScoreFilter = 'all' | 'high' | 'medium' | 'low';
const SCORE_FILTERS: { value: ScoreFilter; label: string }[] = [
  { value: 'all',    label: 'All'   },
  { value: 'high',   label: '75+'   },
  { value: 'medium', label: '50-74' },
  { value: 'low',    label: '<50'   },
];

interface HistoryFiltersProps {
  searchQuery:    string;
  scoreFilter:    ScoreFilter;
  onSearchChange: (q: string) => void;
  onScoreChange:  (f: ScoreFilter) => void;
  onExportCSV:    () => void;
}

export function HistoryFilters({
  searchQuery,
  scoreFilter,
  onSearchChange,
  onScoreChange,
  onExportCSV,
}: HistoryFiltersProps) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Search by filename…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 px-4 py-2 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
        <div className="flex gap-2">
          {SCORE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onScoreChange(value)}
              className={cn(
                'px-4 py-2 rounded-sm text-sm font-medium transition-all',
                scoreFilter === value
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={onExportCSV}
          className="px-4 py-2 rounded-sm bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────

interface BulkActionBarProps {
  count:         number;
  onDeleteClick: () => void;
}

export function BulkActionBar({ count, onDeleteClick }: BulkActionBarProps) {
  if (count === 0) return null;
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-sm p-4 flex items-center justify-between">
      <span className="text-sm font-medium text-violet-900">
        {count} item{count > 1 ? 's' : ''} selected
      </span>
      <button
        onClick={onDeleteClick}
        className="px-4 py-2 rounded-sm bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
      >
        Delete Selected
      </button>
    </div>
  );
}

// ─── History Skeleton ─────────────────────────────────────────────────────────

export function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
