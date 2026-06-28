import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?:      string;
  description?: string;
  children:    React.ReactNode;
  action?:     React.ReactNode;
  className?:  string;
  /** Extra class on the inner content div */
  bodyClass?:  string;
}

/**
 * Consistent card wrapper used throughout the dashboard.
 * Replaces the repeated <div className="bg-white border rounded-lg ..."> pattern.
 *
 * Includes optional title + description header and a right-side action slot.
 */
export function SectionCard({
  title,
  description,
  children,
  action,
  className,
  bodyClass,
}: SectionCardProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden', className)}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('p-5', bodyClass)}>{children}</div>
    </div>
  );
}
