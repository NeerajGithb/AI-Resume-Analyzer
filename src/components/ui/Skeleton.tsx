export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6 space-y-4">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-sm" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  const heights = ['h-32', 'h-40', 'h-48', 'h-36', 'h-44', 'h-52', 'h-38'];
  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="flex items-end justify-between gap-2 h-64">
        {heights.map((height, i) => (
          <Skeleton key={i} className={`flex-1 ${height}`} />
        ))}
      </div>
    </div>
  );
}

