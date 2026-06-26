'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useHistoryListQuery } from '@/hooks/useHistoryQuery';
import { HistoryItem } from '@/types';
import { formatDate, formatFileSize, getGradeColor, cn } from '@/lib/utils';

// ─── Sub-components (pure UI) ─────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-16 space-y-3">
      <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-gray-100 flex items-center justify-center mx-auto">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-subtle)]">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">No analyses yet</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Your resume analyses will appear here after you analyze your first resume.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-[var(--radius-lg)] p-5 text-center">
      <p className="text-sm font-medium text-red-700">Failed to load history</p>
      <p className="text-xs text-red-500 mt-1">{message}</p>
    </div>
  );
}

function ScoreIndicator({ score }: { score: number }) {
  const color = score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  return <span className={cn('text-sm font-bold tabular-nums', color)}>{score}</span>;
}

function HistoryRow({ 
  item, 
  onClick, 
  isSelected, 
  onSelect 
}: { 
  item: HistoryItem; 
  onClick: () => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}) {
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
          className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="px-4 py-3 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)]">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
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
        <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold border', getGradeColor(item.grade))}>
          {item.grade}
        </span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const { data, isLoading, error } = useHistoryListQuery(page, limit);
  const items = data?.data ?? [];
  const pagination = data?.pagination;

  // Filter and search
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (scoreFilter === 'high') return item.overall_score >= 75;
        if (scoreFilter === 'medium') return item.overall_score >= 50 && item.overall_score < 75;
        if (scoreFilter === 'low') return item.overall_score < 50;
        return true;
      });
    }

    return filtered;
  }, [items, searchQuery, scoreFilter]);

  const handleItemClick = (item: HistoryItem) => {
    router.push(`/analyze/report/${item._id}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredItems.map(item => item._id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (confirm(`Delete ${selectedItems.size} selected analyses?`)) {
      // API call would go here
      console.log('Deleting:', Array.from(selectedItems));
      setSelectedItems(new Set());
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Filename', 'Score', 'Grade', 'Date'].join(','),
      ...filteredItems.map(item => 
        [item.fileName, item.overall_score, item.grade, formatDate(item.createdAt)].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-history.csv';
    a.click();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Filters and Search */}
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                />
              </div>

              {/* Score filter */}
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'high', label: '75+' },
                  { value: 'medium', label: '50-74' },
                  { value: 'low', label: '<50' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setScoreFilter(value as any)}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                      scoreFilter === value
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Export */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-sm bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedItems.size > 0 && (
            <div className="bg-violet-50 border border-violet-200 rounded-sm p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-violet-900">
                {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 rounded-sm bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
              >
                Delete Selected
              </button>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && !isLoading && <ErrorState message={error instanceof Error ? error.message : 'Unknown error'} />}

          {!isLoading && !error && filteredItems.length === 0 && items.length > 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-gray-600">No results found for your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setScoreFilter('all');
                }}
                className="text-sm text-violet-600 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}

          {!isLoading && !error && items.length === 0 && <EmptyState />}

          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-xs)]">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Analysis History</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {filteredItems.length} of {items.length} analyses
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-gray-50">
                      <th className="px-4 py-2.5 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                      </th>
                      {['File', 'Score', 'Grade', 'Date', ''].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <HistoryRow 
                        key={item._id} 
                        item={item} 
                        onClick={() => handleItemClick(item)}
                        isSelected={selectedItems.has(item._id)}
                        onSelect={(checked) => handleSelectItem(item._id, checked)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="px-5 py-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= pagination.pages}
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    >
                      Next
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

