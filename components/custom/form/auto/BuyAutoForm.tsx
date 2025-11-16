'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import AppTextarea from '../../input/AppTextarea';
import { AppLocationInput } from '../../input/AppLocationInput';
import LoadingIndicator from '../../loading/LoadingIndicator';
import { auto, AutoBuyFormData } from '@/lib/validations';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitBuyAutoForm } from '@/actions/auto/actions';
import { AppMediaUploaderInput } from '../../input/AppMediaUploaderInput';
import { AppInput } from '../../input/AppInput';
import { AppSelectInput } from '../../input/AppSelectInput';
import { AppCheckbox } from '../../input/AppCheckbox';
import { AppCollapsibleCheckboxGroup } from '../../input/AppCollapsibleCheckboxGroup';
import { AppSlider } from '../../input/AppSlider';

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
      minPrice: '0',
      maxPrice: '10000',
      currency: 'EUR',
      location: { lat: 0, lng: 0, address: '', fullAddress: '' },
      features: '',
      status: '',
      fuel: '',
      minMileage: '0',
      maxMileage: '500000',
      minYear: '1900',
      maxYear: new Date().getFullYear().toString(),
      brand: '',
      color: '',
      minEngineCapacity: '0.1',
      maxEngineCapacity: '5.0',
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

  const handlePriceRangeChange = (value: number[]) => {
    form.setValue('minPrice', value[0].toString(), { shouldValidate: true });
    form.setValue('maxPrice', value[1].toString(), { shouldValidate: true });
  };

  const priceRangeValue = [parseFloat(form.watch('minPrice') || '0'), parseFloat(form.watch('maxPrice') || '10000')];

  const handleMileageRangeChange = (value: number[]) => {
    form.setValue('minMileage', value[0].toString(), { shouldValidate: true });
    form.setValue('maxMileage', value[1].toString(), { shouldValidate: true });
  };

  const mileageRangeValue = [parseFloat(form.watch('minMileage') || '0'), parseFloat(form.watch('maxMileage') || '500000')];

  const handleYearRangeChange = (value: number[]) => {
    form.setValue('minYear', value[0].toString(), { shouldValidate: true });
    form.setValue('maxYear', value[1].toString(), { shouldValidate: true });
  };

  const yearRangeValue = [
    parseFloat(form.watch('minYear') || '1900'),
    parseFloat(form.watch('maxYear') || new Date().getFullYear().toString()),
  ];

  const brandOptions = [
    { value: 'BMW', label: 'BMW' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Mercedes', label: 'Mercedes' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Chevrolet', label: 'Chevrolet' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Kia', label: 'Kia' },
    { value: 'Renault', label: 'Renault' },
    { value: 'Peugeot', label: 'Peugeot' },
    { value: 'Citroen', label: 'Citroen' },
    { value: 'Fiat', label: 'Fiat' },
    { value: 'Opel', label: 'Opel' },
    { value: 'Skoda', label: 'Skoda' },
    { value: 'Seat', label: 'Seat' },
    { value: 'Volvo', label: 'Volvo' },
    { value: 'Mazda', label: 'Mazda' },
    { value: 'Mitsubishi', label: 'Mitsubishi' },
    { value: 'Suzuki', label: 'Suzuki' },
    { value: 'Lexus', label: 'Lexus' },
    { value: 'Infiniti', label: 'Infiniti' },
    { value: 'Jaguar', label: 'Jaguar' },
    { value: 'Land Rover', label: 'Land Rover' },
    { value: 'Porsche', label: 'Porsche' },
    { value: 'Ferrari', label: 'Ferrari' },
    { value: 'Lamborghini', label: 'Lamborghini' },
    { value: 'Bentley', label: 'Bentley' },
    { value: 'Rolls-Royce', label: 'Rolls-Royce' },
    { value: 'Aston Martin', label: 'Aston Martin' },
    { value: 'McLaren', label: 'McLaren' },
    { value: 'Bugatti', label: 'Bugatti' },
    { value: 'Alfa Romeo', label: 'Alfa Romeo' },
    { value: 'Maserati', label: 'Maserati' },
    { value: 'Lancia', label: 'Lancia' },
    { value: 'Saab', label: 'Saab' },
    { value: 'Smart', label: 'Smart' },
    { value: 'Mini', label: 'Mini' },
    { value: 'Dacia', label: 'Dacia' },
    { value: 'Lada', label: 'Lada' },
    { value: 'Trabant', label: 'Trabant' },
    { value: 'Moskvich', label: 'Moskvich' },
    { value: 'ZAZ', label: 'ZAZ' },
    { value: 'UAZ', label: 'UAZ' },
    { value: 'GAZ', label: 'GAZ' },
    { value: 'ZIL', label: 'ZIL' },
    { value: 'Volga', label: 'Volga' },
    { value: 'Zhiguli', label: 'Zhiguli' },
    { value: 'Alta', label: 'Alta' },
  ];

  const colorOptions = [
    { value: 'Alb', label: 'Alb' },
    { value: 'Negru', label: 'Negru' },
    { value: 'Gri', label: 'Gri' },
    { value: 'Albastru', label: 'Albastru' },
    { value: 'Rosu', label: 'Rosu' },
    { value: 'Verde', label: 'Verde' },
    { value: 'Galben', label: 'Galben' },
    { value: 'Portocaliu', label: 'Portocaliu' },
    { value: 'Violet', label: 'Violet' },
    { value: 'Maro', label: 'Maro' },
    { value: 'Argintiu', label: 'Argintiu' },
    { value: 'Auriu', label: 'Auriu' },
    { value: 'Alta', label: 'Alta' },
  ];

  const handleEngineCapacityRangeChange = (value: number[]) => {
    form.setValue('minEngineCapacity', value[0].toString(), { shouldValidate: true });
    form.setValue('maxEngineCapacity', value[1].toString(), { shouldValidate: true });
  };

  const engineCapacityRangeValue = [
    parseFloat(form.watch('minEngineCapacity') || '0.1'),
    parseFloat(form.watch('maxEngineCapacity') || '5.0'),
  ];

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      minPrice: form.watch('minPrice') || '',
      maxPrice: form.watch('maxPrice') || '',
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
    form.watch('minPrice'),
    form.watch('maxPrice'),
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
          <AppInput
            type='text'
            placeholder='Introduceți titlul'
            value={form.watch('title')}
            onChange={(e) => form.setValue('title', e.target.value, { shouldValidate: true })}
            className='break-all w-full'
            label='Titlu'
            error={form.formState.errors.title ? [form.formState.errors.title] : undefined}
            required
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <AppSlider
              label={`Buget (${form.watch('currency')})`}
              value={priceRangeValue}
              onValueChange={handlePriceRangeChange}
              min={0}
              max={100000}
              step={100}
              currency={form.watch('currency')}
              className='min-w-0 w-full'
            />
            <AppSelectInput
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'USD', label: 'USD' },
                { value: 'RON', label: 'RON' },
              ]}
              value={form.watch('currency')}
              onValueChange={(v) => form.setValue('currency', v as 'EUR' | 'USD' | 'RON', { shouldValidate: true })}
              placeholder='Selectați moneda'
              className='w-full'
              label='Monedă'
              error={form.formState.errors.currency ? [form.formState.errors.currency] : undefined}
            />
          </div>

          <AppLocationInput
            location={form.watch('location')}
            onChange={(location) => form.setValue('location', location)}
            placeholder='Introduceți locația'
            leftIcon={MapPin}
            showMap={false}
            value={form.watch('location').address}
            onClear={() => form.setValue('location', { lat: 0, lng: 0, address: '', fullAddress: '' })}
            label='Locație'
            error={form.formState.errors.location ? [form.formState.errors.location] : undefined}
          />

          <AppTextarea
            value={form.watch('description')}
            onChange={(v) => form.setValue('description', v, { shouldValidate: true })}
            placeholder='Descrieți ce căutați...'
            label='Descriere'
            error={form.formState.errors.description ? [form.formState.errors.description] : undefined}
            required
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <AppSelectInput
              options={[
                { value: 'new', label: 'Nou' },
                { value: 'used', label: 'Second Hand' },
                { value: 'damaged', label: 'Deteriorat' },
              ]}
              value={form.watch('status')}
              onValueChange={(v) => form.setValue('status', v as 'new' | 'used' | 'damaged', { shouldValidate: true })}
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
                onValueChange={(v) => form.setValue('fuel', v as 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric', { shouldValidate: true })}
                placeholder='Selectați combustibil'
                className='w-full'
                label='Combustibil'
                error={form.formState.errors.fuel ? [form.formState.errors.fuel] : undefined}
                required
              />
            )}
          </div>

          <AppSlider
            label='Kilometraj'
            value={mileageRangeValue}
            onValueChange={handleMileageRangeChange}
            min={0}
            max={500000}
            step={1000}
            className='min-w-0 w-full'
          />

          <AppSlider
            label='An Fabricație'
            value={yearRangeValue}
            onValueChange={handleYearRangeChange}
            min={1900}
            max={new Date().getFullYear()}
            step={1}
            className='min-w-0 w-full'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <AppSelectInput
              options={brandOptions}
              value={form.watch('brand')}
              onValueChange={(v) => form.setValue('brand', v as string, { shouldValidate: true })}
              placeholder='Selectați marca'
              className='w-full'
              label='Marcă'
              error={form.formState.errors.brand ? [form.formState.errors.brand] : undefined}
              required
            />
            <AppSelectInput
              options={colorOptions}
              value={form.watch('color')}
              onValueChange={(v) => form.setValue('color', v as string, { shouldValidate: true })}
              placeholder='Selectați culoarea'
              className='w-full'
              label='Culoare'
              error={form.formState.errors.color ? [form.formState.errors.color] : undefined}
              required
            />
          </div>

          <AppSlider
            label='Capacitate Cilindrică (L)'
            value={engineCapacityRangeValue}
            onValueChange={handleEngineCapacityRangeChange}
            min={0.1}
            max={10.0}
            step={0.1}
            className='min-w-0 w-full'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <AppInput
              type='number'
              min={1}
              placeholder='150'
              value={form.watch('horsePower')}
              onChange={(e) => form.setValue('horsePower', e.target.value, { shouldValidate: true })}
              className='w-full'
              label='Putere (CP)'
              error={form.formState.errors.horsePower ? [form.formState.errors.horsePower] : undefined}
            />
            <AppSelectInput
              options={[
                { value: 'Manual', label: 'Manuală' },
                { value: 'Automatic', label: 'Automată' },
                { value: 'Semi-Automatic', label: 'Semi-automată' },
              ]}
              value={form.watch('transmission')}
              onValueChange={(v) => form.setValue('transmission', v as 'Manual' | 'Automatic' | 'Semi-Automatic')}
              placeholder='Selectați transmisia'
              className='w-full'
              label='Transmisie'
              error={form.formState.errors.transmission ? [form.formState.errors.transmission] : undefined}
            />
            <AppCheckbox
              label='4x4'
              value={form.watch('is4x4')}
              onChange={(checked) => form.setValue('is4x4', checked as boolean)}
              error={form.formState.errors.is4x4 ? [form.formState.errors.is4x4] : undefined}
              className='max-w-full'
              lift={false}
            />
          </div>

          <AppTextarea
            value={form.watch('features')}
            onChange={(v) => form.setValue('features', v)}
            placeholder='Listează cerințele...'
            label='Cerințe suplimentare'
            error={form.formState.errors.features ? [form.formState.errors.features] : undefined}
          />

          <AppCollapsibleCheckboxGroup
            label='Opțiuni Adiționale'
            options={availableOptions.map((opt) => ({ value: opt, label: opt }))}
            value={options}
            onChange={setOptions}
            className='min-w-0 w-full'
          />

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
