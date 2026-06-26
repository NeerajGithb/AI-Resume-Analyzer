import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Card ──────────────────────────────────────────────────────────────────────
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, padding = 'none', children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-[var(--border)] rounded-[var(--radius-lg)]',
          'shadow-[var(--shadow-xs)]',
          hoverable && 'hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] cursor-pointer',
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ─── CardHeader ───────────────────────────────────────────────────────────────
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-gradient-to-r from-blue-50 to-violet-50', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── CardTitle ────────────────────────────────────────────────────────────────
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-bold text-[var(--text-primary)] leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

// ─── CardDescription ─────────────────────────────────────────────────────────
export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xs text-[var(--text-muted)] mt-0.5', className)}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── CardContent ──────────────────────────────────────────────────────────────
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

// ─── CardFooter ───────────────────────────────────────────────────────────────
export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center px-5 py-3 border-t border-[var(--border)] bg-gray-50 rounded-b-[var(--radius-lg)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

