'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormControl } from '@/components/ui/form';

type Option = { value: string; label: string };
type Props = {
  options: Option[];
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export default function FormSelect({ options, value, onChange, placeholder = 'Selectați', className = '' }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className={`w-full ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
