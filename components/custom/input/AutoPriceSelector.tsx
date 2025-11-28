import { useWatch, Controller } from 'react-hook-form';
import type { UseFormReturn, Path } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type AutoPriceSelectorProps<T extends { price: string; currency: 'EUR' | 'USD' | 'RON' | 'GBP'; period?: string }> = {
  form: UseFormReturn<T>;
  showPeriod?: boolean;
  label?: string;
  className?: string;
};

export default function AutoPriceSelector<T extends { price: string; currency: 'EUR' | 'USD' | 'RON' | 'GBP'; period?: string }>({
  form,
  showPeriod = false,
  label,
  className = '',
}: AutoPriceSelectorProps<T>) {
  const period = useWatch({ control: form.control, name: 'period' as Path<T> });

  const getPeriodLabel = () => {
    if (period === 'day') return 'pe zi';
    if (period === 'week') return 'pe săptămână';
    if (period === 'month') return 'pe lună';
    return '';
  };

  return (
    <Field className={className}>
      <FieldLabel required>{label || `Preț${showPeriod ? ` ${getPeriodLabel()}` : ''}`}</FieldLabel>
      <div className='flex items-center gap-2'>
        <Input
          {...form.register('price' as Path<T>)}
          type='number'
          step='0.01'
          min={0.01}
          placeholder='22.500'
          className='wrap-break-word max-w-full'
        />
        <Controller
          control={form.control}
          name={'currency' as Path<T>}
          render={({ field }) => (
            <Select value={field.value as string} onValueChange={(v) => field.onChange(v)}>
              <SelectTrigger className='w-24'>
                <SelectValue placeholder='Valuta' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Valută</SelectLabel>
                  <SelectItem value='EUR'>EUR</SelectItem>
                  <SelectItem value='USD'>USD</SelectItem>
                  <SelectItem value='RON'>RON</SelectItem>
                  <SelectItem value='GBP'>GBP</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {showPeriod && (
          <Controller
            control={form.control}
            name={'period' as Path<T>}
            render={({ field }) => (
              <Select value={field.value as string} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger>
                  <SelectValue placeholder='Perioada' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Perioada</SelectLabel>
                    <SelectItem value='day'>pe zi</SelectItem>
                    <SelectItem value='week'>pe săptămână</SelectItem>
                    <SelectItem value='month'>pe lună</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        )}
      </div>
      <FieldError errors={form.formState.errors.price ? [form.formState.errors.price as { message?: string | undefined }] : undefined} />
      <FieldError
        errors={form.formState.errors.currency ? [form.formState.errors.currency as { message?: string | undefined }] : undefined}
      />
      {showPeriod && (
        <FieldError
          errors={form.formState.errors.period ? [form.formState.errors.period as { message?: string | undefined }] : undefined}
        />
      )}
    </Field>
  );
}
