import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface FeatureFormShellProps {
  /** Page title */
  title:        string;
  /** Subtitle below title */
  description?: string;
  /** Feature-specific content (dropzones, selects, textareas…) */
  children?:    React.ReactNode;
  /** Submit button label */
  submitLabel?: string;
  /** Called when submit is clicked */
  onSubmit:     () => void;
  /** Whether the mutation is in-flight */
  isPending:    boolean;
  /** Disable the submit button */
  disabled?:    boolean;
  /** Icon above title */
  icon?:        React.ReactNode;
  /** Tip text below submit */
  tip?:         string;
  className?:   string;
}

/**
 * Shared shell for every AI feature form page.
 *
 * Every feature (Analyze, Compare, Cover Letter, Job Match, LinkedIn)
 * has the same structure:
 *   - Icon + title + description
 *   - Dropzone / inputs  (via children)
 *   - Submit button + tip text
 *
 * Previously this layout was duplicated in each feature's page.tsx.
 */
export function FeatureFormShell({
  title,
  description,
  children,
  submitLabel = 'Analyze',
  onSubmit,
  isPending,
  disabled,
  icon,
  tip,
  className,
}: FeatureFormShellProps) {
  return (
    <div className={cn('max-w-2xl mx-auto space-y-6 py-8 px-4', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        {icon && (
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
              {icon}
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">{description}</p>
        )}
      </div>

      {/* Feature-specific content */}
      {children && <div className="space-y-4">{children}</div>}

      {/* Submit */}
      <div className="space-y-3">
        <Button
          onClick={onSubmit}
          disabled={isPending || disabled}
          className="w-full h-11 text-base"
          variant="default"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              Processing…
            </span>
          ) : (
            submitLabel
          )}
        </Button>
        {tip && <p className="text-center text-xs text-gray-400">{tip}</p>}
      </div>
    </div>
  );
}
