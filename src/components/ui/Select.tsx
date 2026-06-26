import { Option } from '@/lib/options';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className,
  disabled = false,
  required = false,
  id,
  name,
}: SelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className={cn(
        'w-full px-3 py-2 rounded-sm border border-[var(--border)]',
        'bg-white text-[var(--text-primary)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
        'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface GroupedOption {
  group: string;
  options: Option[];
}

interface SelectGroupedProps {
  value: string;
  onChange: (value: string) => void;
  groups: GroupedOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

export function SelectGrouped({
  value,
  onChange,
  groups,
  placeholder = 'Select an option',
  className,
  disabled = false,
  required = false,
  id,
  name,
}: SelectGroupedProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className={cn(
        'w-full px-3 py-2 rounded-sm border border-[var(--border)]',
        'bg-white text-[var(--text-primary)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
        'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {groups.map((group) => (
        <optgroup key={group.group} label={group.group}>
          {group.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}