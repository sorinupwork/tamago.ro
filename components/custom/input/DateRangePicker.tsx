'use client';

import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UseFormReturn } from 'react-hook-form';
import { AutoRentFormData } from '@/lib/validations';

interface DateRangePickerProps {
  form: UseFormReturn<AutoRentFormData>;
}

export function DateRangePicker({ form }: DateRangePickerProps) {
  return (
    <Field className='min-w-0 w-full'>
      <FieldLabel>Perioada Închirierii</FieldLabel>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <FieldLabel htmlFor='startDate' className='text-sm'>Data Început</FieldLabel>
          <Input {...form.register('startDate')} type='date' className='w-full' />
          <FieldError errors={form.formState.errors.startDate ? [form.formState.errors.startDate] : undefined} />
        </div>
        <div className='flex-1'>
          <FieldLabel htmlFor='endDate' className='text-sm'>Data Sfârșit</FieldLabel>
          <Input {...form.register('endDate')} type='date' className='w-full' />
          <FieldError errors={form.formState.errors.endDate ? [form.formState.errors.endDate] : undefined} />
        </div>
      </div>
    </Field>
  );
}