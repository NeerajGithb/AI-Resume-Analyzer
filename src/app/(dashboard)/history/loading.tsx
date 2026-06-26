import { Skeleton } from '@/components/ui/Skeleton';

export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/10" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
          {/* Table header */}
          <div className="border-b border-[var(--border)] p-4 bg-gray-50">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-3/10" />
              <Skeleton className="h-4 w-[15%]" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-[15%]" />
            </div>
          </div>

          {/* Table rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-[var(--border)] p-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-4 w-3/10" />
                <Skeleton className="h-4 w-[15%]" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-6 w-[60px] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

