'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { Car, Fuel, Settings, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import FormTextarea from '@/components/custom/form/controls/FormTextarea';
import { AutoPriceSelector } from '@/components/custom/form/controls/AutoPriceSelector';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitSellAutoForm } from '@/actions/auto/actions';
import { auto, AutoSellFormData } from '@/lib/validations';
import { Progress } from '@/components/ui/progress';
import { AppLocationInput } from '../../input/AppLocationInput';

export function SellAutoForm({ onPreviewUpdate }: { onPreviewUpdate: (data: PreviewData) => void; subcategory?: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      mileage: '',
      year: '',
      uploadedFiles: [],
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const availableOptions = ['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°'];

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setUploadedFiles(previewUrls);
    form.setValue('uploadedFiles', previewUrls);
    form.trigger('uploadedFiles');
  };

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
      mileage: watchedValues.mileage || '',
      year: watchedValues.year || '',
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
    setUploadProgress(0);

    try {
      let urls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('category', 'sell');
        formData.append('subcategory', 'auto');

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };

        const uploadPromise = new Promise<string[]>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText).urls);
            } else {
              reject(new Error('Upload failed'));
            }
          };
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.open('POST', '/api/upload');
          xhr.send(formData);
        });

        urls = await uploadPromise;
      }

      const result = await submitSellAutoForm({ ...data, uploadedFiles: urls, options });
      if (result.success) {
        toast.success('Formular trimis cu succes!');
        form.reset();
        setUploadedFiles([]);
        setOptions([]);
        setFiles([]);
        setUploaderKey((k) => k + 1);
      } else {
        toast.error('Eroare la trimiterea formularului.');
      }
    } catch {
      toast.error('Eroare la încărcarea fișierelor.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-4 w-full'>
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='title' className='flex items-center gap-2'>
                <Car className='h-4 w-4' /> Titlu
              </FieldLabel>
              <Input {...form.register('title')} placeholder='Introduceți titlul mașinii' className='break-all w-full' />
              <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
            </Field>
            <div className='min-w-0 w-full'>
              <AutoPriceSelector form={form} />
            </div>
          </div>

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='location'>Locație</FieldLabel>
            <AppLocationInput
              location={null}
              value={form.watch('location')}
              onChange={(loc) => form.setValue('location', loc?.address || '', { shouldValidate: true })}
              placeholder='Introduceți locația'
              leftIcon={MapPin}
              showMap={false}
              onClear={() => form.setValue('location', '')}
            />
            <FieldError errors={form.formState.errors.location ? [form.formState.errors.location] : undefined} />
          </Field>

          <Field className='min-w-0 w-full'>
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

          <div className='flex flex-col md:flex-row items-center gap-4 min-w-0'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='fuel' className='flex items-center gap-2' aria-required='true'>
                <Fuel className='h-4 w-4' /> Combustibil <span className='text-red-600'>*</span>
              </FieldLabel>
              <Select value={form.watch('fuel')} onValueChange={(v) => form.setValue('fuel', v, { shouldValidate: true })}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selectați combustibil' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Combustibil</SelectLabel>
                    <SelectItem value='Petrol'>Benzină</SelectItem>
                    <SelectItem value='Diesel'>Motorină</SelectItem>
                    <SelectItem value='Hybrid'>Hibrid</SelectItem>
                    <SelectItem value='Electric'>Electric</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.fuel ? [form.formState.errors.fuel] : undefined} />
            </Field>

            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='mileage' className='flex items-center gap-2'>
                <Settings className='h-4 w-4' /> Kilometraj <span className='text-red-600'>*</span>
              </FieldLabel>
              <Input {...form.register('mileage')} type='number' step='0.01' placeholder='22.500' className='break-all w-full' />
              <FieldError errors={form.formState.errors.mileage ? [form.formState.errors.mileage] : undefined} />
            </Field>

            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='year' className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' /> An Fabricație
              </FieldLabel>
              <Input
                {...form.register('year')}
                type='text'
                inputMode='numeric'
                placeholder='2020'
                className='wrap-break-word overflow-wrap-break-word w-full'
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <FieldError errors={form.formState.errors.year ? [form.formState.errors.year] : undefined} />
            </Field>
          </div>

          <Field className='min-w-0 w-full'>
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
                <Field key={option} orientation='horizontal' className='min-w-0 w-full'>
                  <Checkbox id={option} checked={options.includes(option)} onCheckedChange={(c) => toggleOption(option, c)} />
                  <FieldLabel htmlFor={option} className='font-normal' lift={false}>
                    {option}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <Field className='min-w-0 w-full'>
            <FieldLabel>Fișiere</FieldLabel>
            <div>
              <MediaUploader
                key={uploaderKey}
                onFilesChange={handleFilesChange} // Use new handler
              />
            </div>
            <FieldError errors={form.formState.errors.uploadedFiles ? [form.formState.errors.uploadedFiles] : undefined} />
          </Field>
        </FieldGroup>
      </FieldSet>

      {isSubmitting && uploadProgress > 0 && (
        <div className='space-y-2'>
          <p className='text-sm text-gray-600'>Se încarcă... {uploadProgress}%</p>
          <Progress value={uploadProgress} className='w-full' />
        </div>
      )}

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Se trimite...' : 'Trimite Formularul'}
      </Button>
    </form>
  );
}
