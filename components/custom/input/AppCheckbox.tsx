'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type Option = {
  value: string;
  label: string;
};

type AppCheckboxProps = {
  label?: string;
  error?: { message?: string }[];
  required?: boolean;
  className?: string;
  htmlFor?: string;
  multiple?: boolean;
  options?: Option[];
  value?: boolean | string[];
  onChange?: (value: boolean | string[]) => void;
  lift?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

const AppCheckbox: React.FC<AppCheckboxProps> = ({
  label,
  error,
  required,
  className = '',
  htmlFor,
  multiple = false,
  options = [],
  value,
  lift = false,
  onChange,
  orientation = 'vertical',
}) => {
  if (multiple) {
    const selected = (value as string[]) || [];
    return (
      <Field className={className}>
        {label && (
          <FieldLabel lift={lift} required={required}>
            {label}
          </FieldLabel>
        )}
        <div className={orientation === 'horizontal' ? 'flex gap-2' : 'space-y-2'}>
          {options.map((option) => (
            <div key={option.value} className='flex items-center space-x-2'>
              <Checkbox
                id={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newSelected = checked ? [...selected, option.value] : selected.filter((v) => v !== option.value);
                  onChange?.(newSelected);
                }}
              />
              <FieldLabel
                lift={lift}
                className='font-normal cursor-default'
                onClick={() => {
                  const newSelected = selected.includes(option.value)
                    ? selected.filter((v) => v !== option.value)
                    : [...selected, option.value];
                  onChange?.(newSelected);
                }}
              >
                {option.label}
              </FieldLabel>
            </div>
          ))}
        </div>
        {error && <FieldError errors={error} />}
      </Field>
    );
  }

  const checked = (value as boolean) || false;
  return (
    <Field orientation='horizontal' className={className}>
      <Checkbox id={htmlFor} checked={checked} onCheckedChange={(checked) => onChange?.(checked as boolean)} />
      {label && (
        <FieldLabel className='font-normal cursor-default' onClick={() => onChange?.(!checked)}>
          {label}
        </FieldLabel>
      )}
      {error && <FieldError errors={error} />}
    </Field>
  );
};

export default AppCheckbox;
