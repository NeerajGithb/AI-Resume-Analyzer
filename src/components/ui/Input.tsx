import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  /** Render an icon on the left */
  leading?: React.ReactNode;
  /** Render an icon/button on the right */
  trailing?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leading, trailing, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-hidden>*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leading && (
            <div className="pointer-events-none absolute left-3 flex items-center text-gray-400">
              {leading}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              // Base
              'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400',
              'transition-colors outline-none',
              // Focus
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
              // Error
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
              // Leading / trailing padding
              leading  && 'pl-9',
              trailing && 'pr-9',
              className,
            )}
            {...props}
          />

          {trailing && (
            <div className="absolute right-3 flex items-center text-gray-400">
              {trailing}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
