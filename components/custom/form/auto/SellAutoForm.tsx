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
import LoadingIndicator from '../../loading/LoadingIndicator';

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
      brand: '',
      color: '',
      engineCapacity: '',
      carType: undefined,
      horsePower: '',
      transmission: undefined,
      is4x4: false,
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
      brand: watchedValues.brand || '',
      color: watchedValues.color || '',
      engineCapacity: watchedValues.engineCapacity || '',
      carType: watchedValues.carType || '',
      horsePower: watchedValues.horsePower || '',
      transmission: watchedValues.transmission || '',
      is4x4: watchedValues.is4x4 || false,
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
    watchedValues.brand,
    watchedValues.color,
    watchedValues.engineCapacity,
    watchedValues.carType,
    watchedValues.horsePower,
    watchedValues.transmission,
    watchedValues.is4x4,
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

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0'>
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
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='engineCapacity'>Capacitate Cilindrică (L)</FieldLabel>
              <Input {...form.register('engineCapacity')} type='number' step='0.1' placeholder='2.0' className='w-full' />
              <FieldError errors={form.formState.errors.engineCapacity ? [form.formState.errors.engineCapacity] : undefined} />
            </Field>
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

      <Button type='submit' size={'lg'} className='w-full' disabled={isSubmitting}>
        {isSubmitting ? <LoadingIndicator inline size={16} text='Se trimite...' /> : 'Trimite'}
      </Button>
    </form>
  );
}
