'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import FormTextarea from '@/components/custom/form/controls/FormTextarea';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import { auto, AutoBuyFormData } from '@/lib/validations';
import { Car, Fuel, MapPin, Settings } from 'lucide-react';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitBuyAutoForm } from '@/actions/auto/actions';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { AppLocationInput } from '../../input/AppLocationInput';

export function BuyAutoForm({ onPreviewUpdate, subcategory }: { onPreviewUpdate: (data: PreviewData) => void; subcategory?: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const form = useForm<AutoBuyFormData>({
    resolver: zodResolver(auto.buySchema) as Resolver<AutoBuyFormData>,
    defaultValues: {
      title: '',
      description: '',
      minPrice: '',
      maxPrice: '',
      currency: 'EUR',
      location: '',
      features: '',
      status: '',
      fuel: '',
      minMileage: '',
      maxMileage: '',
      minYear: '',
      maxYear: '',
      uploadedFiles: [],
    }, // price as string
  });

  const availableOptions = ['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°'];
  const watchedValues = useWatch({ control: form.control });

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setUploadedFiles(previewUrls);
    form.setValue('uploadedFiles', previewUrls); // Update form value for Zod validation
    form.trigger('uploadedFiles'); // Trigger live validation
  };

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      minPrice: watchedValues.minPrice || '',
      maxPrice: watchedValues.maxPrice || '',
      currency: watchedValues.currency || 'EUR',
      location: watchedValues.location || '',
      category: 'buy',
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : ['/placeholder.svg'],
      fuel: watchedValues.fuel || '',
      minMileage: watchedValues.minMileage || '',
      maxMileage: watchedValues.maxMileage || '',
      minYear: watchedValues.minYear || '',
      maxYear: watchedValues.maxYear || '',
      features: watchedValues.features || '',
      options,
    });
  }, [
    watchedValues.title,
    watchedValues.description,
    watchedValues.minPrice,
    watchedValues.maxPrice,
    watchedValues.currency,
    watchedValues.location,
    watchedValues.fuel,
    watchedValues.minMileage,
    watchedValues.maxMileage,
    watchedValues.minYear,
    watchedValues.maxYear,
    watchedValues.features,
    uploadedFiles,
    options,
    onPreviewUpdate,
  ]);

  const toggleOption = (opt: string, checked: boolean | 'indeterminate') => {
    setOptions((prev) => (checked ? (prev.includes(opt) ? prev : [...prev, opt]) : prev.filter((o) => o !== opt)));
  };

  const onSubmit: SubmitHandler<AutoBuyFormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUploadProgress(0);

    console.log('Form data:', data);
    console.log('Files:', files);

    try {
      let urls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('category', 'buy');
        formData.append('subcategory', 'auto');

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percentComplete));
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

      console.log('Submitting to action with:', { ...data, uploadedFiles: urls, options });
      const result = await submitBuyAutoForm({ ...data, uploadedFiles: urls, options });
      console.log('Result:', result);

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
    } catch (error) {
      console.error('Error:', error);
      toast.error('Eroare la încărcarea fișierelor.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log('Validation errors:', errors);
        toast.error('Formularul conține erori. Verificați câmpurile.');
      })}
      noValidate
      className='space-y-6 w-full'
    >
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='title'>Caută mașină</FieldLabel>
              <Input {...form.register('title')} placeholder='Introduceți titlul' className='break-all w-full' />
              <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='minPrice'>Buget Minim</FieldLabel>
              <Input {...form.register('minPrice')} type='number' step='0.01' placeholder='0' className='break-all w-full' />
              <FieldError errors={form.formState.errors.minPrice ? [form.formState.errors.minPrice] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='maxPrice'>Buget Maxim</FieldLabel>
              <Input {...form.register('maxPrice')} type='number' step='0.01' placeholder='0' className='break-all w-full' />
              <FieldError errors={form.formState.errors.maxPrice ? [form.formState.errors.maxPrice] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='currency'>Monedă</FieldLabel>
              <Select
                value={form.watch('currency')}
                onValueChange={(v) => form.setValue('currency', v as 'EUR' | 'USD' | 'RON', { shouldValidate: true })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selectați moneda' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='EUR'>EUR</SelectItem>
                  <SelectItem value='USD'>USD</SelectItem>
                  <SelectItem value='RON'>RON</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.currency ? [form.formState.errors.currency] : undefined} />
            </Field>
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
              placeholder='Descrieți ce căutați...'
            />
            <FieldError errors={form.formState.errors.description ? [form.formState.errors.description] : undefined} />
          </Field>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='status'>Status</FieldLabel>
              <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v, { shouldValidate: true })}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selectați status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='new'>Nou</SelectItem>
                  <SelectItem value='used'>Second Hand</SelectItem>
                  <SelectItem value='damaged'>Deteriorat</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.status ? [form.formState.errors.status] : undefined} />
            </Field>
            {subcategory === 'auto' && (
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='fuel' className='flex items-center gap-2'>
                  <Fuel className='h-4 w-4' /> Combustibil
                </FieldLabel>
                <Select value={form.watch('fuel')} onValueChange={(v) => form.setValue('fuel', v, { shouldValidate: true })}>
                  <SelectTrigger className='w-full'>
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
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='minMileage'>Kilometraj Minim</FieldLabel>
              <Input {...form.register('minMileage')} type='number' step='0.01' placeholder='150000' className='break-all w-full' />
              <FieldError errors={form.formState.errors.minMileage ? [form.formState.errors.minMileage] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='maxMileage'>Kilometraj Maxim</FieldLabel>
              <Input {...form.register('maxMileage')} type='number' step='0.01' placeholder='200000' className='break-all w-full' />
              <FieldError errors={form.formState.errors.maxMileage ? [form.formState.errors.maxMileage] : undefined} />
            </Field>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='minYear'>An Minim</FieldLabel>
              <Input
                {...form.register('minYear')}
                type='number'
                min='1900'
                max={new Date().getFullYear().toString()}
                placeholder='2020'
                className='break-all w-full'
              />
              <FieldError errors={form.formState.errors.minYear ? [form.formState.errors.minYear] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='maxYear'>An Maxim</FieldLabel>
              <Input
                {...form.register('maxYear')}
                type='number'
                min='1900'
                max={new Date().getFullYear().toString()}
                placeholder='2025'
                className='break-all w-full'
              />
              <FieldError errors={form.formState.errors.maxYear ? [form.formState.errors.maxYear] : undefined} />
            </Field>
          </div>

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='features' className='flex items-center gap-2'>
              <Settings className='h-4 w-4' /> Cerințe suplimentare
            </FieldLabel>
            <FormTextarea
              value={form.watch('features')}
              onChange={(v) => form.setValue('features', v)}
              placeholder='Listează cerințele...'
            />
            <FieldError errors={form.formState.errors.features ? [form.formState.errors.features] : undefined} />
          </Field>

          <FieldSet>
            <FieldLegend>Opțiuni Adiționale</FieldLegend>
            <FieldGroup className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {availableOptions.map((option) => (
                <Field key={option} orientation='horizontal' className='max-w-full'>
                  <Checkbox id={option} checked={options.includes(option)} onCheckedChange={(c) => toggleOption(option, c)} />
                  <FieldLabel htmlFor={option} className='font-normal'>
                    {option}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <Field className='min-w-0 w-full'>
            <FieldLabel>Fișiere</FieldLabel>
            <div>
              <MediaUploader key={uploaderKey} onFilesChange={handleFilesChange} />
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

      <Button
        type='submit'
        onClick={() => form.trigger()}
        disabled={isSubmitting}
        className='w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg'
      >
        {isSubmitting ? 'Se trimite...' : 'Caută Mașină'}
      </Button>
    </form>
  );
}
