import React from 'react';
import { Slider } from '@/components/ui/slider';

type AppSliderProps = {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
  currency?: string;
};

export const AppSlider: React.FC<AppSliderProps> = ({ label, value, onValueChange, min, max, step, className = '', currency }) => {
  const formatValue = (val: number) => `${val.toLocaleString('ro-RO')} ${currency || ''}`.trim();

  return (
    <div className={className}>
      <label className='text-sm font-medium'>{label}</label>
      <Slider value={value} onValueChange={onValueChange} max={max} min={min} step={step} className='mt-2' />
      <div className='text-xs text-muted-foreground mt-1'>
        De la: {formatValue(value[0])} Pânã la: {formatValue(value[1])}
      </div>
    </div>
  );
};
