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
};

export const AppSlider: React.FC<AppSliderProps> = ({ label, value, onValueChange, min, max, step, className = '' }) => {
  return (
    <div className={className}>
      <label className='text-sm font-medium'>{label}</label>
      <Slider value={value} onValueChange={onValueChange} max={max} min={min} step={step} className='mt-2' />
    </div>
  );
};
