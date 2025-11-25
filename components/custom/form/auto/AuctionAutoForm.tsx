'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import type { Resolver, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import AppTextarea from '../../input/AppTextarea';
import AppLocationInput from '../../input/AppLocationInput';
import AppMediaUploaderInput from '../../input/AppMediaUploaderInput';
import AutoPriceSelector from '../../input/AutoPriceSelector';
import LoadingIndicator from '../../loading/LoadingIndicator';
import AppInput from '../../input/AppInput';
import AppSelectInput from '../../input/AppSelectInput';
import AppCollapsibleCheckboxGroup from '../../input/AppCollapsibleCheckboxGroup';
import { submitAuctionAutoForm } from '@/actions/auto/actions';
import { auto, AutoAuctionFormData } from '@/lib/validations';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import type { CarHistoryItem } from '@/lib/types';
import {
  brandOptions,
  colorOptions,
  carTypeOptions,
  availableOptions,
  transmissionOptions,
  iconOptions,
  tractionOptions,
} from '@/lib/mockData';
import { iconMap } from '@/lib/icons';
import CarHighlightsForm from './CarHighlightsForm';

export default function AuctionAutoForm({
  onPreviewUpdate,
  subcategory,
}: {
  onPreviewUpdate: (data: PreviewData) => void;
  subcategory?: string;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [history, setHistory] = useState<CarHistoryItem[]>([]);

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
      traction: undefined,
      uploadedFiles: [],
    },
  });

  const watchedValues = useWatch({ control: form.control });

  const iconSelectOptions = iconOptions.map((o) => ({ ...o, icon: iconMap[o.value] || undefined }));

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
      traction: watchedValues.traction || '',
      status: watchedValues.status || '',
      startingBid: watchedValues.price || '',
      history,
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
    watchedValues.traction,
    watchedValues.status,
    uploadedFiles,
    options,
    history,
    onPreviewUpdate,
  ]);

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

      const result = await submitAuctionAutoForm({ ...data, uploadedFiles: urls, options, history });

      if (result.success) {
        toast.success('Formular trimis cu succes!');
        form.reset();
        setUploadedFiles([]);
        setOptions([]);
        setFiles([]);
        setUploaderKey((k) => k + 1);
        setHistory([]);
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
            <AppInput
              type='text'
              placeholder='Introduceți titlul'
              value={form.watch('title')}
              onChange={(e) => form.setValue('title', e.target.value, { shouldValidate: true })}
              className='break-all w-full wrap-break-word'
              label='Titlu'
              error={form.formState.errors.title ? [form.formState.errors.title] : undefined}
              required
            />
            <AutoPriceSelector form={form} showPeriod={false} label='Preț de început' />
          </div>

          <AppLocationInput
            location={null}
            value={form.watch('location')}
            onChange={(loc) => form.setValue('location', loc?.address || '', { shouldValidate: true })}
            placeholder='Introduceți locația'
            className='w-full'
            showMap={true}
            onClear={() => form.setValue('location', '')}
            label='Locație'
            error={form.formState.errors.location ? [form.formState.errors.location] : undefined}
            required
          />

          <AppInput
            type='date'
            placeholder='YYYY-MM-DD'
            value={form.watch('endDate')}
            onChange={(e) => form.setValue('endDate', e.target.value, { shouldValidate: true })}
            className='wrap-break-word overflow-wrap-break-word w-full'
            label='Data de sfârșit'
            error={form.formState.errors.endDate ? [form.formState.errors.endDate] : undefined}
            required
          />

          <AppTextarea
            value={form.watch('description')}
            onChange={(v) => form.setValue('description', v, { shouldValidate: true })}
            placeholder='Descrieți produsul detaliat...'
            label='Descriere'
            error={form.formState.errors.description ? [form.formState.errors.description] : undefined}
            required
            className='min-w-0 w-full wrap-break-word'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <AppSelectInput
              options={[
                { value: 'new', label: 'Nou' },
                { value: 'used', label: 'Second Hand' },
                { value: 'damaged', label: 'Deteriorat' },
              ]}
              value={form.watch('status')}
              onValueChange={(v) => form.setValue('status', v as string)}
              placeholder='Selectați status'
              className='w-full'
              label='Status'
              error={form.formState.errors.status ? [form.formState.errors.status] : undefined}
              required
            />
            {subcategory === 'auto' && (
              <AppSelectInput
                options={[
                  { value: 'Petrol', label: 'Benzină' },
                  { value: 'Diesel', label: 'Motorină' },
                  { value: 'Hybrid', label: 'Hibrid' },
                  { value: 'Electric', label: 'Electric' },
                ]}
                value={form.watch('fuel')}
                onValueChange={(v) => form.setValue('fuel', v as string)}
                placeholder='Selectați combustibil'
                className='w-full'
                label='Combustibil'
                error={form.formState.errors.fuel ? [form.formState.errors.fuel] : undefined}
                required
              />
            )}
          </div>

          {subcategory === 'auto' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0'>
              <AppSelectInput
                options={brandOptions}
                value={form.watch('brand')}
                onValueChange={(v) => form.setValue('brand', v as string, { shouldValidate: true })}
                placeholder='Introduceți marca'
                className='w-full'
                label='Marcă'
                error={form.formState.errors.brand ? [form.formState.errors.brand] : undefined}
                required
              />
              <AppSelectInput
                options={colorOptions}
                value={form.watch('color')}
                onValueChange={(v) => form.setValue('color', v as string, { shouldValidate: true })}
                placeholder='Introduceți culoarea'
                className='w-full'
                label='Culoare'
                error={form.formState.errors.color ? [form.formState.errors.color] : undefined}
                required
              />
              <AppInput
                type='number'
                step='0.1'
                placeholder='2.0'
                value={form.watch('engineCapacity')}
                onChange={(e) => form.setValue('engineCapacity', e.target.value, { shouldValidate: true })}
                className='w-full'
                label='Capacitate Cilindrică (L)'
                error={form.formState.errors.engineCapacity ? [form.formState.errors.engineCapacity] : undefined}
                required
              />
              <AppSelectInput
                options={carTypeOptions}
                value={form.watch('carType')}
                onValueChange={(v) =>
                  form.setValue(
                    'carType',
                    v as 'SUV' | 'Coupe' | 'Sedan' | 'Hatchback' | 'Convertible' | 'Wagon' | 'Pickup' | 'Van' | 'Other'
                  )
                }
                placeholder='Selectați tipul'
                className='w-full'
                label='Tip Mașină'
                error={form.formState.errors.carType ? [form.formState.errors.carType] : undefined}
                required
              />
              <AppInput
                type='number'
                placeholder='150'
                value={form.watch('horsePower')}
                onChange={(e) => form.setValue('horsePower', e.target.value, { shouldValidate: true })}
                className='w-full'
                label='Putere (CP)'
                error={form.formState.errors.horsePower ? [form.formState.errors.horsePower] : undefined}
                required
              />
              <AppSelectInput
                options={transmissionOptions}
                value={form.watch('transmission')}
                onValueChange={(v) => form.setValue('transmission', v as 'Manual' | 'Automatic' | 'Semi-Automatic')}
                placeholder='Selectați transmisia'
                className='w-full'
                label='Transmisie'
                error={form.formState.errors.transmission ? [form.formState.errors.transmission] : undefined}
                required
              />
              <AppInput
                type='number'
                placeholder='50000'
                value={form.watch('mileage')}
                onChange={(e) => form.setValue('mileage', e.target.value, { shouldValidate: true })}
                className='w-full'
                label='Kilometraj'
                error={form.formState.errors.mileage ? [form.formState.errors.mileage] : undefined}
                required
              />
              <AppInput
                type='number'
                placeholder='2020'
                value={form.watch('year')}
                onChange={(e) => form.setValue('year', e.target.value, { shouldValidate: true })}
                className='w-full'
                label='An Fabricație'
                error={form.formState.errors.year ? [form.formState.errors.year] : undefined}
                required
              />
              <AppSelectInput
                label='Tractiune'
                options={tractionOptions}
                value={form.watch('traction')}
                onValueChange={(v) => form.setValue('traction', v as 'integrala' | 'fata' | 'spate')}
                placeholder='Selectați tracțiunea'
                className='w-full'
                error={form.formState.errors.traction ? [form.formState.errors.traction] : undefined}
              />
            </div>
          )}

          <CarHighlightsForm history={history} setHistory={setHistory} iconOptions={iconSelectOptions} />

          <AppTextarea
            value={form.watch('features')}
            onChange={(v) => form.setValue('features', v)}
            placeholder='Listează caracteristicile...'
            label='Caracteristici'
            error={form.formState.errors.features ? [form.formState.errors.features] : undefined}
            className='min-w-0 w-full wrap-break-word'
          />

          <AppCollapsibleCheckboxGroup
            label='Opțiuni Adiționale'
            options={availableOptions.map((opt) => ({ value: opt, label: opt }))}
            value={options}
            onChange={setOptions}
            className='min-w-0 w-full'
            containerClassName='grid grid-cols-2 gap-2'
          />

          <AppMediaUploaderInput
            label='Fișiere'
            error={form.formState.errors.uploadedFiles ? [form.formState.errors.uploadedFiles] : undefined}
            className='min-w-0 w-full'
            uploaderKey={uploaderKey}
            onFilesChange={handleFilesChange}
            required
            showPreview
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
