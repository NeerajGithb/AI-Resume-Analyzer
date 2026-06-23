'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white border border-[var(--accent)] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] active:scale-[0.98]',
  secondary:
    'bg-white text-[var(--text-primary)] border border-[var(--border)] hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98]',
  outline:
    'bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:bg-gray-50 active:bg-gray-100',
  ghost:
    'bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-gray-100 hover:text-[var(--text-primary)] active:bg-gray-200',
  destructive:
    'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs font-medium gap-1.5',
  md: 'h-8 px-3.5 text-sm font-medium gap-2',
  lg: 'h-10 px-5 text-sm font-semibold gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-md)] select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin shrink-0"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
        {!loading && iconRight && (
          <span className="shrink-0">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

