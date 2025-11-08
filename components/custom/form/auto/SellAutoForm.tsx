'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { Car, Fuel, Settings, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import FormTextarea from '@/components/custom/form/controls/FormTextarea';
import { AutoPriceSelector } from '@/components/custom/form/controls/AutoPriceSelector';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitSellAutoForm } from '@/actions/auto/actions';
import { auto, AutoSellFormData } from '@/lib/validations';

const CURRENT_YEAR = new Date().getFullYear();

export function SellAutoForm({ onPreviewUpdate }: { onPreviewUpdate: (data: PreviewData) => void; subcategory?: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const form = useForm<AutoSellFormData>({
    resolver: zodResolver(auto.sellSchema) as Resolver<AutoSellFormData>,
    defaultValues: {
      title: '',
      description: '',
      price: '',
      currency: 'EUR',
      location: '',
      features: '',
      fuel: '',
      mileage: 0,
      year: 0,
      uploadedFiles: [],
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const availableOptions = ['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°'];

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.price || '',
      currency: watchedValues.currency || 'EUR',
      location: watchedValues.location || '',
      category: 'sell',
      uploadedFiles,
      fuel: watchedValues.fuel || '',
      mileage: watchedValues.mileage || 0,
      year: watchedValues.year || 0,
      features: watchedValues.features || '',
      options,
    });
  }, [
    watchedValues.title,
    watchedValues.description,
    watchedValues.price,
    watchedValues.currency,
    watchedValues.location,
    watchedValues.fuel,
    watchedValues.mileage,
    watchedValues.year,
    watchedValues.features,
    uploadedFiles,
    options,
    onPreviewUpdate,
  ]);

  const toggleOption = (opt: string, checked: boolean | 'indeterminate') => {
    setOptions((prev) => {
      if (checked) {
        if (!prev.includes(opt)) return [...prev, opt];
        return prev;
      } else {
        return prev.filter((o) => o !== opt);
      }
    });
  };

  const onSubmit: SubmitHandler<AutoSellFormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await submitSellAutoForm({ ...data, uploadedFiles, options });
      if (result.success) {
        toast.success('Formular trimis cu succes!');
        form.reset();
        setUploadedFiles([]);
        setOptions([]);
        setUploaderKey((k) => k + 1);
        setUploadError(false);
      } else {
        toast.error('Eroare la trimiterea formularului.');
      }
    } catch {
      toast.error('Eroare la trimiterea formularului.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-4 max-w-full'>
      <FieldSet>
        <FieldGroup>
          <div className='flex flex-col md:flex-row gap-4'>
            <Field className='min-w-0 flex-1'>
              <FieldLabel htmlFor='title' className='flex items-center gap-2'>
                <Car className='h-4 w-4' /> Titlu
              </FieldLabel>
              <Input {...form.register('title')} placeholder='Introduceți titlul mașinii' className='wrap-break-word max-w-full' />
              <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
            </Field>
            <div className='min-w-0 flex-1'>
              <AutoPriceSelector form={form} />
            </div>
          </div>

          <Field className='min-w-0'>
            <FieldLabel htmlFor='location'>Locație</FieldLabel>
            <Input {...form.register('location')} placeholder='Introduceți locația' className='wrap-break-word max-w-full' />
            <FieldError errors={form.formState.errors.location ? [form.formState.errors.location] : undefined} />
          </Field>

          <Field className='min-w-0'>
            <FieldLabel htmlFor='description' className='flex items-center gap-2'>
              <Car className='h-4 w-4' /> Descriere
            </FieldLabel>
            <FormTextarea
              value={form.watch('description')}
              onChange={(v) => form.setValue('description', v, { shouldValidate: true })}
              placeholder='Descrieți mașina detaliat...'
            />
            <FieldError errors={form.formState.errors.description ? [form.formState.errors.description] : undefined} />
          </Field>

          <div className='flex flex-col md:flex-row items-center gap-4 max-w-full'>
            <Field className='min-w-0'>
              <FieldLabel htmlFor='fuel' className='flex items-center gap-2' aria-required='true'>
                <Fuel className='h-4 w-4' /> Combustibil <span className='text-red-600'>*</span>
              </FieldLabel>
              <Select value={form.watch('fuel')} onValueChange={(v) => form.setValue('fuel', v, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder='Selectați combustibil' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Petrol'>Benzină</SelectItem>
                  <SelectItem value='Diesel'>Motorină</SelectItem>
                  <SelectItem value='Hybrid'>Hibrid</SelectItem>
                  <SelectItem value='Electric'>Electric</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.fuel ? [form.formState.errors.fuel] : undefined} />
            </Field>
            <Field className='min-w-0'>
              <FieldLabel htmlFor='mileage' className='flex items-center gap-2'>
                <Settings className='h-4 w-4' /> Kilometraj <span className='text-red-600'>*</span>
              </FieldLabel>
              <Input
                {...form.register('mileage', { valueAsNumber: true })}
                type='number'
                placeholder='0'
                min={1}
                required
                className='wrap-break-word max-w-full'
              />
              <FieldError errors={form.formState.errors.mileage ? [form.formState.errors.mileage] : undefined} />
            </Field>
            <Field className='min-w-0'>
              <FieldLabel htmlFor='year' className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' /> An Fabricație
              </FieldLabel>
              <Input
                {...form.register('year', { valueAsNumber: true })}
                type='number'
                placeholder='2020'
                min={1900}
                max={CURRENT_YEAR}
                className='wrap-break-word max-w-full'
              />
              <FieldError errors={form.formState.errors.year ? [form.formState.errors.year] : undefined} />
            </Field>
          </div>

          <Field className='min-w-0'>
            <FieldLabel htmlFor='features' className='flex items-center gap-2' aria-required='true'>
              <Settings className='h-4 w-4' /> Caracteristici <span className='text-red-600'>*</span>
            </FieldLabel>
            <FormTextarea
              value={form.watch('features')}
              onChange={(v) => form.setValue('features', v, { shouldValidate: true })}
              placeholder='Listează caracteristicile mașinii...'
            />
            <FieldError errors={form.formState.errors.features ? [form.formState.errors.features] : undefined} />
          </Field>

          <FieldSet>
            <FieldLegend>Opțiuni Adiționale</FieldLegend>
            <FieldGroup className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {availableOptions.map((option) => (
                <Field key={option} orientation='horizontal' className='min-w-0'>
                  <Checkbox id={option} checked={options.includes(option)} onCheckedChange={(c) => toggleOption(option, c)} />
                  <FieldLabel htmlFor={option} className='font-normal'>
                    {option}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <Field className='min-w-0'>
            <FieldLabel className={uploadError ? 'text-red-600' : ''}>Fotografii</FieldLabel>
            <div className={uploadError ? 'rounded-md ring-2 ring-red-500 p-1' : ''}>
              <MediaUploader
                key={uploaderKey}
                category='sell'
                onUpload={(urls) => {
                  setUploadedFiles(urls);
                  form.setValue('uploadedFiles', urls, { shouldValidate: true });
                  if (urls.length > 0) setUploadError(false);
                }}
              />
            </div>
            <FieldError errors={form.formState.errors.uploadedFiles ? [form.formState.errors.uploadedFiles] : undefined} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        type='submit'
        onClick={() => form.trigger()}
        disabled={isSubmitting}
        className='w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-102 shadow-lg'
      >
        {isSubmitting ? 'Se trimite...' : 'Trimite Vânzare Auto'}
      </Button>
    </form>
  );
}
