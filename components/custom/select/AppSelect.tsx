import React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Option = {
  value: string;
  label: string;
};

type AppSelectProps = {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const AppSelect: React.FC<AppSelectProps> = ({ options, value, onValueChange, placeholder = 'Selectează', className = '' }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-full transition-all duration-200 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
