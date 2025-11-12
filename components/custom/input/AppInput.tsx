import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';

type AppInputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: number;
};

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  onKeyDown,
  min,
}, ref) => {
  return (
    <div className={`relative ${className}`}>
      {LeftIcon && <LeftIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
      <Input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        min={min}
        className={`transition-all duration-200 focus:scale-101 ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''}`}
      />
      {RightIcon && <RightIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
    </div>
  );
});

AppInput.displayName = 'AppInput';
