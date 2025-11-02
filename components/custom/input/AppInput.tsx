import React from 'react';
import { LucideIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';

type AppInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const AppInput: React.FC<AppInputProps> = ({
  placeholder,
  value,
  onChange,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  onKeyDown,
}) => {
  return (
    <div className={`relative ${className}`}>
      {LeftIcon && <LeftIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`transition-all duration-200 focus:scale-101 ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''}`}
      />
      {RightIcon && <RightIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />}
    </div>
  );
};
