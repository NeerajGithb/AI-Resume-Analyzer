import { cn } from '@/lib/utils';

interface PaginationProps {
  page:      number;
  pages:     number;
  total?:    number;
  onChange:  (page: number) => void;
  className?: string;
}

export function Pagination({ page, pages, total, onChange, className }: PaginationProps) {
  if (pages <= 1) return null;

  // Build a window: always show first, last, and 2 around current page
  const getPageNumbers = (): (number | '…')[] => {
    const result: (number | '…')[] = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
        result.push(i);
      } else if (result[result.length - 1] !== '…') {
        result.push('…');
      }
    }
    return result;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-between gap-4 py-3', className)}
    >
      {/* Total count */}
      {total != null && (
        <p className="text-sm text-gray-500 hidden sm:block">
          Page <span className="font-medium">{page}</span> of{' '}
          <span className="font-medium">{pages}</span>
          {' '}·{' '}
          <span className="font-medium">{total}</span> results
        </p>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
            'border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          ‹
        </button>

        {getPageNumbers().map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                p === page
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50',
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
            'border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          ›
        </button>
      </div>
    </nav>
  );
}
