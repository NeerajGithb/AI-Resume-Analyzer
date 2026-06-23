import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Hero skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Main card skeleton */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-3/10" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

