'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { AutoSellFormData } from '@/lib/validations';

interface AutoPriceSelectorProps {
  form: UseFormReturn<AutoSellFormData>;
}

export function AutoPriceSelector({ form }: AutoPriceSelectorProps) {
  return (
    <Field>
      <FieldLabel>Preț</FieldLabel>
      <div className='flex items-center gap-2'>
        <Input
          {...form.register('price')}
          type='number'
          step='0.01'
          placeholder='22.500'
          className='wrap-break-word max-w-full'
        />
        <Select
          value={form.watch('currency')}
          onValueChange={(v) => form.setValue('currency', v as 'EUR' | 'USD' | 'RON', { shouldValidate: true })}
        >
          <SelectTrigger className='w-20'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='EUR'>EUR</SelectItem>
            <SelectItem value='USD'>USD</SelectItem>
            <SelectItem value='RON'>RON</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FieldError errors={form.formState.errors.price ? [form.formState.errors.price] : undefined} />
      <FieldError errors={form.formState.errors.currency ? [form.formState.errors.currency] : undefined} />
    </Field>
  );
}
