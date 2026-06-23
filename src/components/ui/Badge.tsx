import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-gray-100 text-gray-700 border border-gray-200',
  success:
    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning:
    'bg-amber-50 text-amber-700 border border-amber-200',
  destructive:
    'bg-red-50 text-red-700 border border-red-200',
  outline:
    'bg-transparent text-[var(--text-secondary)] border border-[var(--border)]',
  accent:
    'bg-[var(--accent-light)] text-[var(--accent)] border border-purple-200',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px] font-medium rounded',
  md: 'px-2 py-0.5 text-xs font-medium rounded',
};

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

