'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type AppSliderProps = {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
  currency?: string | string[];
  error?: { message?: string }[];
  showLabelDesc?: boolean;
};

const AppSlider: React.FC<AppSliderProps> = ({
  label,
  showLabelDesc = true,
  value,
  onValueChange,
  min,
  max,
  step,
  className = '',
  currency,
  error,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedCallbackRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Initialize debounced callback
  useEffect(() => {
    debouncedCallbackRef.current = debounce((newValue: number[]) => {
      onValueChange(newValue);
    }, 300);

    return () => {
      debouncedCallbackRef.current?.cancel();
    };
  }, [onValueChange]);

  // Sync local value with prop value when it changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = useCallback((newValue: number[]) => {
    setLocalValue(newValue);
    debouncedCallbackRef.current?.(newValue);
  }, []);

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value) || min;
    const clampedMin = Math.max(min, Math.min(newMin, localValue[1]));
    const newValue = [clampedMin, localValue[1]];
    setLocalValue(newValue);
    debouncedCallbackRef.current?.(newValue);
  }, [localValue, min]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value) || max;
    const clampedMax = Math.min(max, Math.max(newMax, localValue[0]));
    const newValue = [localValue[0], clampedMax];
    setLocalValue(newValue);
    debouncedCallbackRef.current?.(newValue);
  }, [localValue, max]);

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <Slider value={localValue} onValueChange={handleSliderChange} min={min} max={max} step={step} className='w-full' />

      {showLabelDesc && (
        <div className='flex gap-2 mt-2'>
          <Input
            type='number'
            value={localValue[0]}
            onChange={handleMinChange}
            min={min}
            max={localValue[1]}
            step={step}
            className='flex-1'
            placeholder='Min'
          />
          <Input
            type='number'
            value={localValue[1]}
            onChange={handleMaxChange}
            min={localValue[0]}
            max={max}
            step={step}
            className='flex-1'
            placeholder='Max'
          />
        </div>
      )}

      {error && <FieldError errors={error} />}
    </Field>
  );
};

export default AppSlider;
