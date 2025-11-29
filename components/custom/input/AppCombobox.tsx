'use client';

import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LoadingDots from '@/components/custom/loading/LoadingDots';
import { cn } from '@/lib/utils';

type Option = {
  value: string;
  label: string;
};

type AppComboboxProps = {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  onInputChange?: (query: string) => void | Promise<void>;
  placeholder?: string;
  className?: string;
  additionalContent?: React.ReactNode;
  displayValue?: string;
  onClear?: () => void;
  fullDisplayValue?: string;
  leftIcon?: LucideIcon;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
};

const AppCombobox: React.FC<AppComboboxProps> = ({
  options,
  value,
  onValueChange,
  onInputChange,
  placeholder = 'Selectează...',
  className = '',
  additionalContent,
  displayValue,
  onClear,
  fullDisplayValue,
  leftIcon: LeftIcon,
  open,
  onOpenChange,
  isLoading = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const selectedOption = options.find((option) => option.value === value);
  const effectiveDisplayValue = displayValue || selectedOption?.label || placeholder;
  const effectiveFullDisplayValue = fullDisplayValue || selectedOption?.label;

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <div className={className}>
                <Button variant='outline' role='combobox' aria-expanded={isOpen} className={`w-full justify-between`} type='button'>
                  <div className='flex items-center'>
                    {LeftIcon && <LeftIcon className='w-4 h-4 text-muted-foreground mr-2' />}
                    <span className='truncate'>{effectiveDisplayValue}</span>
                  </div>

                  <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </div>
            </PopoverTrigger>
          </TooltipTrigger>
          {effectiveFullDisplayValue && (
            <TooltipContent>
              <p>{effectiveFullDisplayValue}</p>
            </TooltipContent>
          )}
        </Tooltip>
        <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
          <div className='relative'>
            {onClear && (
              <Button variant='ghost' size='sm' className='absolute top-2 right-2 z-10 h-6 w-6 p-0' onClick={() => onClear()} type='button'>
                <X className='h-4 w-4' />
              </Button>
            )}
            <Command>
              <CommandInput 
                placeholder='Caută...' 
                onValueChange={onInputChange}
              />
              <CommandList>
                {isLoading ? (
                  <div className='flex items-center justify-center py-6'>
                    <LoadingDots size='sm' />
                  </div>
                ) : options.length === 0 ? (
                  <CommandEmpty>Nu s-a găsit nimic.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        className={cn('mb-1', value === option.value && 'bg-accent')}
                        onSelect={() => {
                          if (value === option.value) {
                            onValueChange('');
                          } else {
                            onValueChange(option.value);
                          }
                          handleOpenChange(false);
                        }}
                      >
                        <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
            {additionalContent}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default AppCombobox;
