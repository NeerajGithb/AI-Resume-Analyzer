import { Select, SelectGrouped } from '@/components/ui/Select';
import { ROLE_OPTIONS, ROLE_OPTIONS_GROUPED } from '@/lib/options';

interface RoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  grouped?: boolean;
}

export function RoleSelect({
  value,
  onChange,
  className,
  disabled = false,
  required = false,
  id = 'role',
  name = 'role',
  placeholder = 'Select target role',
  grouped = false,
}: RoleSelectProps) {
  if (grouped) {
    return (
      <SelectGrouped
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        groups={ROLE_OPTIONS_GROUPED}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        required={required}
      />
    );
  }

  return (
    <Select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      options={ROLE_OPTIONS}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      required={required}
    />
  );
}