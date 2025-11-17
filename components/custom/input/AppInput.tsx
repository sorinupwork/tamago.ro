'use client';

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type AppInputProps = {
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: string | number;
  label?: string;
  error?: { message?: string }[];
  required?: boolean;
  htmlFor?: string;
} & React.ComponentProps<typeof Input>;

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      type = 'text',
      placeholder,
      onChange,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      className = '',
      onKeyDown,
      min,
      label,
      error,
      required,
      htmlFor,
      ...rest
    },
    ref
  ) => {
    return (
      <Field className={className}>
        {label && (
          <FieldLabel htmlFor={htmlFor} required={required}>
            {label}
          </FieldLabel>
        )}
        <div className='relative'>
          {LeftIcon && <LeftIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
          <Input
            ref={ref}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown}
            min={min}
            className={`transition-all duration-200 focus:scale-101 ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''}`}
            {...rest}
          />
          {RightIcon && (
            <RightIcon
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground ${
                onRightIconClick ? 'cursor-pointer' : ''
              }`}
              onClick={onRightIconClick}
            />
          )}
        </div>
        {error && <FieldError errors={error} />}
      </Field>
    );
  }
);

AppInput.displayName = 'AppInput';
