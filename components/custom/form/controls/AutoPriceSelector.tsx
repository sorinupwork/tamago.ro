import { UseFormReturn } from 'react-hook-form';
import { useWatch, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface AutoPriceSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  showPeriod?: boolean;
  label?: string;
}

export function AutoPriceSelector({ form, showPeriod = false, label }: AutoPriceSelectorProps) {
  const period = useWatch({ control: form.control, name: 'period' });

  const getPeriodLabel = () => {
    if (period === 'day') return 'pe zi';
    if (period === 'week') return 'pe săptămână';
    if (period === 'month') return 'pe lună';
    return '';
  };

  return (
    <Field>
      <FieldLabel>{label || `Preț${showPeriod ? ` ${getPeriodLabel()}` : ''}`}</FieldLabel>
      <div className='flex items-center gap-2'>
        <Input
          {...form.register('price')}
          type='number'
          step='0.01'
          placeholder='22.500'
          className='wrap-break-word max-w-full'
        />
        <Controller
          control={form.control}
          name="currency"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
              <SelectTrigger className='w-16'>
                <SelectValue placeholder='Valuta' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Valută</SelectLabel>
                  <SelectItem value='EUR'>EUR</SelectItem>
                  <SelectItem value='USD'>USD</SelectItem>
                  <SelectItem value='RON'>RON</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {showPeriod && (
          <Controller
            control={form.control}
            name="period"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className='w-24'>
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
      <FieldError errors={form.formState.errors.price ? [form.formState.errors.price] : undefined} />
      <FieldError errors={form.formState.errors.currency ? [form.formState.errors.currency] : undefined} />
      {showPeriod && (
        <FieldError errors={form.formState.errors.period ? [form.formState.errors.period] : undefined} />
      )}
    </Field>
  );
}
