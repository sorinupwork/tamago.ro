import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type Option = {
  value: string;
  label: string;
};

type AppSelectInputProps = {
  options: Option[];
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: { message?: string }[];
  required?: boolean;
  htmlFor?: string;
};

export const AppSelectInput: React.FC<AppSelectInputProps> = ({
  options,
  value,
  onValueChange,
  multiple = false,
  placeholder = 'Selectează',
  className = '',
  label,
  error,
  required,
  htmlFor,
}) => {
  const selectComponent = multiple ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className={`w-full justify-start ${className}`}>
          {placeholder} ({(value as string[]).length} selectat{(value as string[]).length !== 1 ? 'e' : ''})
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-56'>
        <div className='flex flex-col gap-2'>
          {options.map((option) => (
            <div key={option.value} className='flex items-center space-x-2'>
              <Checkbox
                checked={(value as string[]).includes(option.value)}
                onCheckedChange={(checked) => {
                  const newSelected = checked
                    ? [...(value as string[]), option.value]
                    : (value as string[]).filter((v) => v !== option.value);
                  onValueChange(newSelected);
                }}
              />
              <label
                onClick={() => {
                  const newSelected = (value as string[]).includes(option.value)
                    ? (value as string[]).filter((v) => v !== option.value)
                    : [...(value as string[]), option.value];
                  onValueChange(newSelected);
                }}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <Select value={value as string} onValueChange={(v) => onValueChange(v)}>
      <SelectTrigger className={`w-full ${className}`}>
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

  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor} required={required}>
          {label}
        </FieldLabel>
      )}
      {selectComponent}
      {error && <FieldError errors={error} />}
    </Field>
  );
};