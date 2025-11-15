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
import { AppMediaUploaderInput } from '../../input/AppMediaUploaderInput';
import { auto, AutoAuctionFormData } from '@/lib/validations';
import { Car, Fuel, Settings } from 'lucide-react';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitAuctionAutoForm } from '@/actions/auto/actions';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { AppLocationInput } from '@/components/custom/input/AppLocationInput';
import { AutoPriceSelector } from '../../input/AutoPriceSelector';
import LoadingIndicator from '../../loading/LoadingIndicator';

export function AuctionAutoForm({ onPreviewUpdate, subcategory }: { onPreviewUpdate: (data: PreviewData) => void; subcategory?: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const form = useForm<AutoAuctionFormData>({
    resolver: zodResolver(auto.auctionSchema) as Resolver<AutoAuctionFormData>,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: '',
      currency: 'EUR',
      location: '',
      features: '',
      endDate: '',
      fuel: '',
      status: '',
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
      price: watchedValues.price || '',
      currency: watchedValues.currency || 'EUR',
      location: watchedValues.location || '',
      category: 'auction',
      uploadedFiles,
      fuel: watchedValues.fuel || '',
      mileage: watchedValues.mileage || '',
      year: watchedValues.year || '',
      features: watchedValues.features || '',
      options,
      endDate: watchedValues.endDate || '',
      brand: watchedValues.brand || '',
      color: watchedValues.color || '',
      engineCapacity: watchedValues.engineCapacity || '',
      carType: watchedValues.carType || '',
      horsePower: watchedValues.horsePower || '',
      transmission: watchedValues.transmission || '',
      is4x4: watchedValues.is4x4 || false,
      status: watchedValues.status || '',
      startingBid: watchedValues.price || '',
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
    watchedValues.endDate,
    watchedValues.brand,
    watchedValues.color,
    watchedValues.engineCapacity,
    watchedValues.carType,
    watchedValues.horsePower,
    watchedValues.transmission,
    watchedValues.is4x4,
    watchedValues.status,
    uploadedFiles,
    options,
    onPreviewUpdate,
  ]);

  const availableOptions = ['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°'];
  const toggleOption = (opt: string, checked: boolean | 'indeterminate') => {
    setOptions((prev) => (checked ? (prev.includes(opt) ? prev : [...prev, opt]) : prev.filter((o) => o !== opt)));
  };

  const onSubmit: SubmitHandler<AutoAuctionFormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let urls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('category', 'auction');
        formData.append('subcategory', 'auto'); // Add subcategory

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

      const result = await submitAuctionAutoForm({ ...data, uploadedFiles: urls, options });
      if (result.success) {
        toast.success('Formular trimis cu succes!');
        form.reset();
        setUploadedFiles([]); // Clear preview images
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
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-6 w-full'>
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='title'>Titlu</FieldLabel>
              <Input {...form.register('title')} placeholder='Introduceți titlul' className='break-all w-full' />
              <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
            </Field>
            <AutoPriceSelector form={form} showPeriod={false} label='Preț de început' />
          </div>

          <Field className='min-w-0 w-full'>
            <FieldLabel>Locație</FieldLabel>
            <AppLocationInput
              location={{ lat: 0, lng: 0, address: watchedValues.location || '', fullAddress: '' }}
              onChange={(loc) => form.setValue('location', loc.address)}
              showMap={false}
              placeholder='Introduceți locația'
              className='w-full'
            />
            <FieldError errors={form.formState.errors.location ? [form.formState.errors.location] : undefined} />
          </Field>

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='endDate'>Data de sfârșit</FieldLabel>
            <Input
              {...form.register('endDate')}
              type='date'
              placeholder='YYYY-MM-DD'
              className='wrap-break-word overflow-wrap-break-word w-full'
            />
            <FieldError errors={form.formState.errors.endDate ? [form.formState.errors.endDate] : undefined} />
          </Field>

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='description' className='flex items-center gap-2'>
              <Car className='h-4 w-4' /> Descriere
            </FieldLabel>
            <AppTextarea
              value={form.watch('description')}
              onChange={(v) => form.setValue('description', v)}
              placeholder='Descrieți produsul detaliat...'
            />
            <FieldError errors={form.formState.errors.description ? [form.formState.errors.description] : undefined} />
          </Field>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <Field className='min-w-0 w-full'>
              <FieldLabel htmlFor='status'>Status</FieldLabel>
              <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v)}>
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
                <Select value={form.watch('fuel')} onValueChange={(v) => form.setValue('fuel', v)}>
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

          {subcategory === 'auto' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0'>
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='brand'>Marcă</FieldLabel>
                <Input {...form.register('brand')} placeholder='Introduceți marca' className='w-full' />
                <FieldError errors={form.formState.errors.brand ? [form.formState.errors.brand] : undefined} />
              </Field>
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='color'>Culoare</FieldLabel>
                <Input {...form.register('color')} placeholder='Introduceți culoarea' className='w-full' />
                <FieldError errors={form.formState.errors.color ? [form.formState.errors.color] : undefined} />
              </Field>
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='engineCapacity'>Capacitate Cilindrică (L)</FieldLabel>
                <Input {...form.register('engineCapacity')} type='number' step='0.1' placeholder='2.0' className='w-full' />
                <FieldError errors={form.formState.errors.engineCapacity ? [form.formState.errors.engineCapacity] : undefined} />
              </Field>
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='carType'>Tip Mașină</FieldLabel>
                <Select
                  value={form.watch('carType')}
                  onValueChange={(v) =>
                    form.setValue(
                      'carType',
                      v as 'SUV' | 'Coupe' | 'Sedan' | 'Hatchback' | 'Convertible' | 'Wagon' | 'Pickup' | 'Van' | 'Other'
                    )
                  }
                >
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
                <Select
                  value={form.watch('transmission')}
                  onValueChange={(v) => form.setValue('transmission', v as 'Manual' | 'Automatic' | 'Semi-Automatic')}
                >
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
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='mileage'>Kilometraj</FieldLabel>
                <Input {...form.register('mileage')} type='number' placeholder='50000' className='w-full' />
                <FieldError errors={form.formState.errors.mileage ? [form.formState.errors.mileage] : undefined} />
              </Field>
              <Field className='min-w-0 w-full'>
                <FieldLabel htmlFor='year'>An Fabricație</FieldLabel>
                <Input {...form.register('year')} type='number' placeholder='2020' className='w-full' />
                <FieldError errors={form.formState.errors.year ? [form.formState.errors.year] : undefined} />
              </Field>
              <Field orientation='horizontal' className='max-w-full'>
                <Checkbox id='is4x4' {...form.register('is4x4')} />
                <FieldLabel htmlFor='is4x4' className='font-normal'>
                  4x4
                </FieldLabel>
                <FieldError errors={form.formState.errors.is4x4 ? [form.formState.errors.is4x4] : undefined} />
              </Field>
            </div>
          )}

          <Field className='min-w-0 w-full'>
            <FieldLabel htmlFor='features' className='flex items-center gap-2'>
              <Settings className='h-4 w-4' /> Caracteristici
            </FieldLabel>
            <AppTextarea
              value={form.watch('features')}
              onChange={(v) => form.setValue('features', v)}
              placeholder='Listează caracteristicile...'
            />
            <FieldError errors={form.formState.errors.features ? [form.formState.errors.features] : undefined} />
          </Field>

          <FieldSet>
            <FieldLegend>Opțiuni Adiționale</FieldLegend>
            <FieldGroup className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {availableOptions.map((option) => (
                <Field key={option} orientation='horizontal' className='max-w-full'>
                  <Checkbox id={option} onCheckedChange={(checked) => toggleOption(option, checked)} />
                  <FieldLabel htmlFor={option} className='font-normal'>
                    {option}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <Field className='max-w-full'>
            <FieldLabel>Fișiere</FieldLabel>
            <div>
              <AppMediaUploaderInput key={uploaderKey} onFilesChange={handleFilesChange} />
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
