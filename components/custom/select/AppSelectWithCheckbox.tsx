import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Option = {
  value: string;
  label: string;
};

type AppSelectWithCheckboxProps = {
  options: Option[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  placeholder: string;
  className?: string;
};

export const AppSelectWithCheckbox: React.FC<AppSelectWithCheckboxProps> = ({
  options,
  selected,
  onChange,
  placeholder,
  className = '',
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className={`w-full justify-start ${className}`}>
          {placeholder} ({selected.length} selectat{selected.length !== 1 ? 'e' : ''})
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-56'>
        <div className='flex flex-col gap-2'>
          {options.map((option) => (
            <div key={option.value} className='flex items-center space-x-2'>
              <Checkbox
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => onChange(option.value, checked as boolean)}
              />
              <label>{option.label}</label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
