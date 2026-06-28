import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** Diameter in Tailwind size units */
  size?:      'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?:     string; // sr-only accessible label
}

const sizeMap = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
};

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex items-center justify-center', className)}>
      <span
        className={cn(
          'animate-spin rounded-full border-current border-r-transparent',
          sizeMap[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Full-page centered loading state */
export function PageSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
