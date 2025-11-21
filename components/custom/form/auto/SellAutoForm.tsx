'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { AutoPriceSelector } from '@/components/custom/input/AutoPriceSelector';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitSellAutoForm } from '@/actions/auto/actions';
import { auto, AutoSellFormData } from '@/lib/validations';
import { AppLocationInput } from '../../input/AppLocationInput';
import LoadingIndicator from '../../loading/LoadingIndicator';
import { AppSelectInput } from '../../input/AppSelectInput';
import { AppInput } from '../../input/AppInput';
import AppTextarea from '../../input/AppTextarea';
import { AppCheckbox } from '../../input/AppCheckbox';
import { AppCollapsibleCheckboxGroup } from '../../input/AppCollapsibleCheckboxGroup';
import { AppMediaUploaderInput } from '../../input/AppMediaUploaderInput';

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

  const carTypeOptions = [
    { value: 'SUV', label: 'SUV' },
    { value: 'Coupe', label: 'Coupe' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Convertible', label: 'Convertible' },
    { value: 'Wagon', label: 'Wagon' },
    { value: 'Pickup', label: 'Pickup' },
    { value: 'Van', label: 'Van' },
    { value: 'Other', label: 'Altul' },
  ];

  const transmissionOptions = [
    { value: 'Manual', label: 'Manuală' },
    { value: 'Automatic', label: 'Automată' },
    { value: 'Semi-Automatic', label: 'Semi-automată' },
  ];

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

          <div className='flex flex-col md:flex-row items-center gap-4 min-w-0'>
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
            <AppCheckbox
              label='4x4'
              value={form.watch('is4x4')}
              onChange={(checked) => form.setValue('is4x4', checked as boolean, { shouldValidate: true })}
              error={form.formState.errors.is4x4 ? [form.formState.errors.is4x4] : undefined}
              className='max-w-full'
              lift={false}
            />
          </div>

          <AppTextarea
            value={form.watch('features')}
            onChange={(v) => form.setValue('features', v, { shouldValidate: true })}
            placeholder='Listează caracteristicile mașinii...'
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

      <Button type='submit' size={'lg'} className='w-full' disabled={isSubmitting}>
        Trimite
      </Button>

      {isSubmitting && (
        <LoadingIndicator
          showProgress={uploadProgress > 0}
          progressValue={uploadProgress}
          text={uploadProgress > 0 ? 'Se încarcă fișiere...' : 'Se trimite...'}
        />
      )}
    </form>
  );
}
