'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

type Option = {
  value: string;
  label: string;
};

type AppCollapsibleCheckboxGroupProps = {
  label: string;
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  className?: string;
};

export const AppCollapsibleCheckboxGroup: React.FC<AppCollapsibleCheckboxGroupProps> = ({
  label,
  options,
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckedChange = (optionValue: string, checked: boolean) => {
    const newSelected = checked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue);
    onChange(newSelected);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='flex items-center justify-between w-full p-2'>
          <span className='font-medium'>{label}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-2 p-2'>
        {options.map((option) => (
          <div key={option.value} className='flex items-center space-x-2'>
            <Checkbox
              id={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => handleCheckedChange(option.value, checked as boolean)}
            />
            <label htmlFor={option.value} className='text-sm font-normal cursor-default'>
              {option.label}
            </label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
