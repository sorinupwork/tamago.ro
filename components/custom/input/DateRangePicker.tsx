'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UseFormReturn } from 'react-hook-form';
import { AutoRentFormData } from '@/lib/validations';
import { AppInput } from './AppInput';

interface DateRangePickerProps {
  form: UseFormReturn<AutoRentFormData>;
  required?: boolean;
}

export function DateRangePicker({ form, required }: DateRangePickerProps) {
  return (
    <Field className='min-w-0 w-full'>
      <FieldLabel required={required}>Perioada Închirierii</FieldLabel>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <AppInput
            type='date'
            value={form.watch('startDate')}
            onChange={(e) => form.setValue('startDate', e.target.value, { shouldValidate: true })}
            className='w-full'
          />
          <div className='text-xs text-muted-foreground mt-1'>Data Început</div>
          <FieldError errors={form.formState.errors.startDate ? [form.formState.errors.startDate] : undefined} />
        </div>
        <div className='flex-1'>
          <AppInput
            type='date'
            value={form.watch('endDate')}
            onChange={(e) => form.setValue('endDate', e.target.value, { shouldValidate: true })}
            className='w-full'
          />
          <div className='text-xs text-muted-foreground mt-1'>Data Sfârșit</div>
          <FieldError errors={form.formState.errors.endDate ? [form.formState.errors.endDate] : undefined} />
        </div>
      </div>
    </Field>
  );
}