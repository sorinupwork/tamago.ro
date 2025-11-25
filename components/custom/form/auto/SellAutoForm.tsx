'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { Resolver, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import AutoPriceSelector from '@/components/custom/input/AutoPriceSelector';
import AppLocationInput from '../../input/AppLocationInput';
import LoadingIndicator from '../../loading/LoadingIndicator';
import AppSelectInput from '../../input/AppSelectInput';
import AppInput from '../../input/AppInput';
import AppTextarea from '../../input/AppTextarea';
import AppCollapsibleCheckboxGroup from '../../input/AppCollapsibleCheckboxGroup';
import AppMediaUploaderInput from '../../input/AppMediaUploaderInput';
import { submitSellAutoForm } from '@/actions/auto/actions';
import { auto, AutoSellFormData } from '@/lib/validations';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import type { CarHistoryItem } from '@/lib/types';
import {
  brandOptions,
  colorOptions,
  carTypeOptions,
  transmissionOptions,
  availableOptions,
  iconOptions,
  tractionOptions,
} from '@/lib/mockData';
import { iconMap } from '@/lib/icons';
import CarHighlightsForm from './CarHighlightsForm';

export default function SellAutoForm({ onPreviewUpdate }: { onPreviewUpdate: (data: PreviewData) => void }) {
  const [options, setOptions] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<CarHistoryItem[]>([]);

  const form = useForm<AutoSellFormData>({
    resolver: zodResolver(auto.sellSchema) as Resolver<AutoSellFormData>,
    defaultValues: {
      title: '',
      price: '',
      currency: 'EUR',
      location: '',
      description: '',
      fuel: '',
      mileage: '',
      year: '',
      status: '',
      brand: '',
      color: '',
      engineCapacity: '',
      carType: undefined,
      horsePower: '',
      transmission: undefined,
      traction: undefined,
      features: '',
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
      category: 'sell',
      title: watchedValues.title || '',
      price: watchedValues.price || '',
      currency: watchedValues.currency || 'EUR',
      location: watchedValues.location || '',
      description: watchedValues.description || '',
      fuel: watchedValues.fuel || '',
      mileage: watchedValues.mileage || '',
      year: watchedValues.year || '',
      status: watchedValues.status || '',
      brand: watchedValues.brand || '',
      color: watchedValues.color || '',
      engineCapacity: watchedValues.engineCapacity || '',
      carType: watchedValues.carType || '',
      horsePower: watchedValues.horsePower || '',
      transmission: watchedValues.transmission || '',
      traction: watchedValues.traction || '',
      features: watchedValues.features || '',
      options,
      uploadedFiles,
      history,
    });
  }, [
    watchedValues.status,
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
    watchedValues.traction,
    options,
    uploadedFiles,
    history,
    onPreviewUpdate,
  ]);

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

      const result = await submitSellAutoForm({ ...data, uploadedFiles: urls, options, history });

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
    } catch (err) {
      console.error(err);
      toast.error('Eroare la încărcarea fișierelor.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='grid gap-4'>
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <AppInput
              type='text'
              placeholder='Introduceți titlul mașinii'
              value={form.watch('title')}
              onChange={(e) => form.setValue('title', e.target.value, { shouldValidate: true })}
              className='min-w-0 w-full wrap-break-word'
              label='Titlu'
              required
              error={form.formState.errors.title ? [form.formState.errors.title] : undefined}
            />

            <AutoPriceSelector form={form} className='min-w-0 w-full' />
          </div>

          <AppLocationInput
            location={null}
            value={form.watch('location')}
            onChange={(loc) => form.setValue('location', loc?.address || '', { shouldValidate: true })}
            placeholder='Introduceți locația'
            leftIcon={MapPin}
            showMap={false}
            onClear={() => form.setValue('location', '')}
            label='Locație'
            required
            error={form.formState.errors.location ? [form.formState.errors.location] : undefined}
            className='min-w-0 w-full'
          />

          <AppTextarea
            value={form.watch('description')}
            onChange={(v) => form.setValue('description', v, { shouldValidate: true })}
            placeholder='Descrieți mașina detaliat...'
            label='Descriere'
            required
            error={form.formState.errors.description ? [form.formState.errors.description] : undefined}
            className='min-w-0 w-full wrap-break-word'
          />

          <div className='flex flex-col md:grid md:grid-cols-4 items-center gap-4 min-w-0'>
            <AppSelectInput
              options={[
                { value: 'Petrol', label: 'Benzină' },
                { value: 'Diesel', label: 'Motorină' },
                { value: 'Hybrid', label: 'Hibrid' },
                { value: 'Electric', label: 'Electric' },
              ]}
              value={form.watch('fuel')}
              onValueChange={(v) => form.setValue('fuel', v as 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric', { shouldValidate: true })}
              placeholder='Selectați combustibil'
              className='min-w-0 w-full'
              label='Combustibil'
              required
              error={form.formState.errors.fuel ? [form.formState.errors.fuel] : undefined}
            />

            <AppInput
              type='number'
              step='0.01'
              min={0.01}
              placeholder='22.500'
              value={form.watch('mileage')}
              onChange={(e) => form.setValue('mileage', e.target.value, { shouldValidate: true })}
              className='min-w-0 w-full'
              label='Kilometraj'
              error={form.formState.errors.mileage ? [form.formState.errors.mileage] : undefined}
              required
            />

            <AppInput
              type='number'
              min={1}
              inputMode='numeric'
              placeholder='2020'
              value={form.watch('year')}
              onChange={(e) => form.setValue('year', e.target.value, { shouldValidate: true })}
              className='min-w-0 w-full'
              label='An Fabricație'
              error={form.formState.errors.year ? [form.formState.errors.year] : undefined}
              required
            />

            <AppSelectInput
              options={[
                { value: 'new', label: 'Nou' },
                { value: 'used', label: 'Second Hand' },
                { value: 'damaged', label: 'Deteriorat' },
              ]}
              value={form.watch('status')}
              onValueChange={(v) => form.setValue('status', v as string, { shouldValidate: true })}
              placeholder='Selectați status'
              className='min-w-0 w-full'
              label='Status'
              required
              error={form.formState.errors.status ? [form.formState.errors.status] : undefined}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0'>
            <AppSelectInput
              options={brandOptions}
              value={form.watch('brand')}
              onValueChange={(v) => form.setValue('brand', v as string, { shouldValidate: true })}
              placeholder='Selectați marca'
              className='min-w-0 w-full'
              label='Marcă'
              error={form.formState.errors.brand ? [form.formState.errors.brand] : undefined}
              required
            />
            <AppSelectInput
              options={colorOptions}
              value={form.watch('color')}
              onValueChange={(v) => form.setValue('color', v as string, { shouldValidate: true })}
              placeholder='Selectați culoarea'
              className='min-w-0 w-full'
              label='Culoare'
              error={form.formState.errors.color ? [form.formState.errors.color] : undefined}
              required
            />
            <AppInput
              type='number'
              step='0.1'
              min={0.1}
              placeholder='2.0'
              value={form.watch('engineCapacity')}
              onChange={(e) => form.setValue('engineCapacity', e.target.value, { shouldValidate: true })}
              className='min-w-0 w-full'
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
                  v as 'SUV' | 'Coupe' | 'Sedan' | 'Hatchback' | 'Convertible' | 'Wagon' | 'Pickup' | 'Van' | 'Other',
                  { shouldValidate: true }
                )
              }
              placeholder='Selectați tipul'
              className='min-w-0 w-full'
              label='Tip Mașină'
              error={form.formState.errors.carType ? [form.formState.errors.carType] : undefined}
              required
            />
            <AppInput
              type='number'
              min={1}
              placeholder='150'
              value={form.watch('horsePower')}
              onChange={(e) => form.setValue('horsePower', e.target.value, { shouldValidate: true })}
              className='min-w-0 w-full'
              label='Putere (CP)'
              error={form.formState.errors.horsePower ? [form.formState.errors.horsePower] : undefined}
              required
            />
            <AppSelectInput
              options={transmissionOptions}
              value={form.watch('transmission')}
              onValueChange={(v) => form.setValue('transmission', v as 'Manual' | 'Automatic' | 'Semi-Automatic', { shouldValidate: true })}
              placeholder='Selectați transmisia'
              className='min-w-0 w-full'
              label='Transmisie'
              error={form.formState.errors.transmission ? [form.formState.errors.transmission] : undefined}
              required
            />
            <AppSelectInput
              label='Tractiune'
              options={tractionOptions}
              value={form.watch('traction')}
              onValueChange={(v) => form.setValue('traction', v as 'integrala' | 'fata' | 'spate', { shouldValidate: true })}
              placeholder='Selectați tracțiunea'
              className='max-w-full'
              error={form.formState.errors.traction ? [form.formState.errors.traction] : undefined}
            />
          </div>

          <CarHighlightsForm history={history} setHistory={setHistory} iconOptions={iconSelectOptions} />

          <AppTextarea
            value={form.watch('features')}
            onChange={(v) => form.setValue('features', v, { shouldValidate: true })}
            placeholder='Listează caracteristicile mașinii...'
            label='Caracteristici'
            subLabel='Separă elementele prin virgulă (ex: ABS, Airbag, AC)'
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

      {isSubmitting && (
        <LoadingIndicator
          showProgress={uploadProgress > 0}
          progressValue={uploadProgress}
          text={uploadProgress > 0 ? 'Se încarcă fișiere...' : 'Se trimite...'}
        />
      )}
      <Button type='submit' size={'lg'} className='w-full' disabled={isSubmitting}>
        Trimite
      </Button>
    </form>
  );
}
