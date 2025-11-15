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
import AppTextarea from '../../input/AppTextarea';
import { AppLocationInput } from '../../input/AppLocationInput';
import LoadingIndicator from '../../loading/LoadingIndicator';
import { auto, AutoBuyFormData } from '@/lib/validations';
import { Car, Fuel, MapPin, Settings } from 'lucide-react';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitBuyAutoForm } from '@/actions/auto/actions';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { AppMediaUploaderInput } from '../../input/AppMediaUploaderInput';

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
      location: { lat: 0, lng: 0, address: '', fullAddress: '' },
      features: '',
      status: '',
      fuel: '',
      minMileage: '',
      maxMileage: '',
      minYear: '',
      maxYear: '',
      brand: '',
      color: '',
      minEngineCapacity: '',
      maxEngineCapacity: '',
      carType: undefined,
      horsePower: '',
      transmission: undefined,
      is4x4: false,
      uploadedFiles: [],
    },
  });

  const availableOptions = ['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°'];
  const watchedValues = useWatch({ control: form.control });

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
      minPrice: watchedValues.minPrice || '',
      maxPrice: watchedValues.maxPrice || '',
      currency: watchedValues.currency || 'EUR',
      location: watchedValues.location?.address || '',
      category: 'buy',
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : ['/placeholder.svg'],
      fuel: watchedValues.fuel || '',
      minMileage: watchedValues.minMileage || '',
      maxMileage: watchedValues.maxMileage || '',
      minYear: watchedValues.minYear || '',
      maxYear: watchedValues.maxYear || '',
      features: watchedValues.features || '',
      options,
      brand: watchedValues.brand || '',
      color: watchedValues.color || '',
      minEngineCapacity: watchedValues.minEngineCapacity || '',
      maxEngineCapacity: watchedValues.maxEngineCapacity || '',
      carType: watchedValues.carType || '',
      horsePower: watchedValues.horsePower || '',
      transmission: watchedValues.transmission || '',
      is4x4: watchedValues.is4x4 || false,
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
    watchedValues.brand,
    watchedValues.color,
    watchedValues.minEngineCapacity,
    watchedValues.maxEngineCapacity,
    watchedValues.carType,
    watchedValues.horsePower,
    watchedValues.transmission,
    watchedValues.is4x4,
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

      const result = await submitBuyAutoForm({ ...data, uploadedFiles: urls, options });

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
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error('Formularul conține erori. Verificați câmpurile.');
      })}
      noValidate
      className='space-y-6 w-full'
    >
      <FieldSet>
        <FieldGroup>
          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='title'>Caută mașină</FieldLabel>
            <Input {...form.register('title')} placeholder='Introduceți titlul' className='break-all w-full' />
            <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
          </Field>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0'>
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
              location={form.watch('location')}
              onChange={(location) => form.setValue('location', location)}
              placeholder='Introduceți locația'
              leftIcon={MapPin}
              showMap={false}
              value={form.watch('location').address}
              onClear={() => form.setValue('location', { lat: 0, lng: 0, address: '', fullAddress: '' })}
            />
            <FieldError errors={form.formState.errors.location ? [form.formState.errors.location] : undefined} />
          </Field>

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='description' className='flex items-center gap-2'>
              <Car className='h-4 w-4' /> Descriere
            </FieldLabel>
            <AppTextarea
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='brand'>Marcă</FieldLabel>
              <Input {...form.register('brand')} placeholder='BMW' className='w-full' />
              <FieldError errors={form.formState.errors.brand ? [form.formState.errors.brand] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='color'>Culoare</FieldLabel>
              <Input {...form.register('color')} placeholder='Alb' className='w-full' />
              <FieldError errors={form.formState.errors.color ? [form.formState.errors.color] : undefined} />
            </Field>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='minEngineCapacity'>Capacitate Cilindrică Minimă (L)</FieldLabel>
              <Input {...form.register('minEngineCapacity')} type='number' step='0.1' placeholder='1.5' className='w-full' />
              <FieldError errors={form.formState.errors.minEngineCapacity ? [form.formState.errors.minEngineCapacity] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='maxEngineCapacity'>Capacitate Cilindrică Maximă (L)</FieldLabel>
              <Input {...form.register('maxEngineCapacity')} type='number' step='0.1' placeholder='3.0' className='w-full' />
              <FieldError errors={form.formState.errors.maxEngineCapacity ? [form.formState.errors.maxEngineCapacity] : undefined} />
            </Field>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='carType'>Tip Mașină</FieldLabel>
              <Select value={form.watch('carType')} onValueChange={(v) => form.setValue('carType', v as 'SUV' | 'Coupe' | 'Sedan' | 'Hatchback' | 'Convertible' | 'Wagon' | 'Pickup' | 'Van' | 'Other')}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selectați tipul' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='SUV'>SUV</SelectItem>
                  <SelectItem value='Coupe'>Coupe</SelectItem>
                  <SelectItem value='Sedan'>Sedan</SelectItem>
                  <SelectItem value='Hatchback'>Hatchback</SelectItem>
                  <SelectItem value='Convertible'>Convertible</SelectItem>
                  <SelectItem value='Wagon'>Wagon</SelectItem>
                  <SelectItem value='Pickup'>Pickup</SelectItem>
                  <SelectItem value='Van'>Van</SelectItem>
                  <SelectItem value='Other'>Altul</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.carType ? [form.formState.errors.carType] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='horsePower'>Putere (CP)</FieldLabel>
              <Input {...form.register('horsePower')} type='number' placeholder='150' className='w-full' />
              <FieldError errors={form.formState.errors.horsePower ? [form.formState.errors.horsePower] : undefined} />
            </Field>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='transmission'>Transmisie</FieldLabel>
              <Select value={form.watch('transmission')} onValueChange={(v) => form.setValue('transmission', v as 'Manual' | 'Automatic' | 'Semi-Automatic')}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selectați transmisia' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Manual'>Manuală</SelectItem>
                  <SelectItem value='Automatic'>Automată</SelectItem>
                  <SelectItem value='Semi-Automatic'>Semi-automată</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={form.formState.errors.transmission ? [form.formState.errors.transmission] : undefined} />
            </Field>
            <Field orientation='horizontal' className='max-w-full'>
              <Checkbox id='is4x4' {...form.register('is4x4')} />
              <FieldLabel htmlFor='is4x4' className='font-normal'>4x4</FieldLabel>
              <FieldError errors={form.formState.errors.is4x4 ? [form.formState.errors.is4x4] : undefined} />
            </Field>
          </div>

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='features' className='flex items-center gap-2'>
              <Settings className='h-4 w-4' /> Cerințe suplimentare
            </FieldLabel>
            <AppTextarea
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

          <AppMediaUploaderInput
            label='Fișiere'
            error={form.formState.errors.uploadedFiles ? [form.formState.errors.uploadedFiles] : undefined}
            className='min-w-0 w-full'
            uploaderKey={uploaderKey}
            onFilesChange={handleFilesChange}
          />
        </FieldGroup>
      </FieldSet>

      {isSubmitting && uploadProgress > 0 && (
        <div className='space-y-2'>
          <p className='text-sm text-gray-600'>Se încarcă... {uploadProgress}%</p>
          <Progress value={uploadProgress} className='w-full' />
        </div>
      )}
      <Button type='submit' size={'lg'} className='w-full' disabled={isSubmitting}>
        {isSubmitting ? <LoadingIndicator inline size={16} text='Se trimite...' /> : 'Trimite'}
      </Button>
    </form>
  );
}
