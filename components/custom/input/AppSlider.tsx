'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type AppSliderProps = {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
  currency?: string;
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
  const formatValue = (val: number) => {
    if (val == null || typeof val !== 'number' || isNaN(val)) {
      return '0';
    }
    return `${val.toLocaleString('ro-RO')} ${currency || ''}`.trim();
  };

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <Slider value={value} onValueChange={onValueChange} min={min} max={max} step={step} className='w-full' />

      {showLabelDesc && (
        <div className='text-sm text-muted-foreground mt-1'>
          {value.map((v, index) => (
            <span key={index}>
              {formatValue(v)}
              {index < value.length - 1 && ' - '}
            </span>
          ))}
        </div>
      )}

      {error && <FieldError errors={error} />}
    </Field>
  );
};

export default AppSlider;
