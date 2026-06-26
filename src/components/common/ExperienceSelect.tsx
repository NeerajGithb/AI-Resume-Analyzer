import { Select } from '@/components/ui/Select';
import { EXPERIENCE_OPTIONS } from '@/lib/options';

interface ExperienceSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
}

export function ExperienceSelect({
  value,
  onChange,
  className,
  disabled = false,
  required = false,
  id = 'experience',
  name = 'experience',
  placeholder = 'Select your experience level',
}: ExperienceSelectProps) {
  return (
    <Select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      options={EXPERIENCE_OPTIONS}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      required={required}
    />
  );
}