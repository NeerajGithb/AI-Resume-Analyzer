import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title:        string;
  description?: string;
  /** Optional right-side action (button, badge, etc.) */
  action?:      React.ReactNode;
  className?:   string;
}

/**
 * Consistent page header used on every dashboard page.
 * Previously each page had its own <h1> + <p> pattern.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="space-y-1 min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
