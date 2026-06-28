'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Pagination } from '@/components/ui/Pagination';
import {
  HistoryFilters,
  HistoryTable,
  BulkActionBar,
  HistorySkeleton,
} from '@/components/history/HistoryComponents';
import { useHistoryListQuery } from '@/hooks/useHistoryQuery';
import { formatDate } from '@/lib/utils';
import type { HistoryItem } from '@/types';

type ScoreFilter = 'all' | 'high' | 'medium' | 'low';

export default function HistoryPage() {
  const router = useRouter();
  const [page, setPage]               = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useHistoryListQuery(page, 10);
  const items      = data?.data ?? [];
  const pagination = data?.pagination;

  const filteredItems = useMemo(() => {
    let list: HistoryItem[] = items;
    if (searchQuery) {
      list = list.filter((i) => i.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (scoreFilter === 'high')   list = list.filter((i) => i.overall_score >= 75);
    if (scoreFilter === 'medium') list = list.filter((i) => i.overall_score >= 50 && i.overall_score < 75);
    if (scoreFilter === 'low')    list = list.filter((i) => i.overall_score < 50);
    return list;
  }, [items, searchQuery, scoreFilter]);

  const handleExportCSV = () => {
    const csv = [
      ['Filename', 'Score', 'Grade', 'Date'].join(','),
      ...filteredItems.map((i: HistoryItem) =>
        [i.fileName, i.overall_score, i.grade, formatDate(i.createdAt)].join(',')
      ),
    ].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href:     URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'resume-history.csv',
    });
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <HistoryFilters
          searchQuery={searchQuery}
          scoreFilter={scoreFilter}
          onSearchChange={setSearchQuery}
          onScoreChange={setScoreFilter}
          onExportCSV={handleExportCSV}
        />

        <BulkActionBar
          count={selectedItems.size}
          onDeleteClick={() => {
            if (confirm(`Delete ${selectedItems.size} selected analyses?`)) {
              setSelectedItems(new Set());
            }
          }}
        />

        {isLoading && <HistorySkeleton />}
        {!isLoading && error && (
          <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load history'} />
        )}
        {!isLoading && !error && items.length === 0 && (
          <EmptyState
            title="No analyses yet"
            description="Your resume analyses will appear here after you analyze your first resume."
          />
        )}
        {!isLoading && !error && filteredItems.length === 0 && items.length > 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-600">No results for your filters.</p>
            <button onClick={() => { setSearchQuery(''); setScoreFilter('all'); }} className="text-sm text-violet-600 hover:underline mt-2">
              Clear filters
            </button>
          </div>
        )}
        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-xs)]">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Analysis History</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {filteredItems.length} of {items.length} analyses
              </p>
            </div>
            <HistoryTable
              items={filteredItems}
              selectedItems={selectedItems}
              onItemClick={(item) => router.push(`/analyze/report/${item._id}`)}
              onSelectItem={(id, checked) => {
                const next = new Set(selectedItems);
                checked ? next.add(id) : next.delete(id);
                setSelectedItems(next);
              }}
              onSelectAll={(checked) =>
                setSelectedItems(checked ? new Set(filteredItems.map((i: HistoryItem) => i._id)) : new Set())
              }
            />
            {pagination && (
              <div className="px-5 py-4 border-t border-[var(--border)]">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  onChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
