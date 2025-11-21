'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import AppTextarea from '../../input/AppTextarea';
import { AppLocationInput } from '../../input/AppLocationInput';
import { AppMediaUploaderInput } from '../../input/AppMediaUploaderInput';
import { auto, AutoRentFormData } from '@/lib/validations';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitRentAutoForm } from '@/actions/auto/actions';
import { Progress } from '@/components/ui/progress';
import LoadingIndicator from '../../loading/LoadingIndicator';
import { DateRangePicker } from '../../input/DateRangePicker';
import { AutoPriceSelector } from '../../input/AutoPriceSelector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AppInput } from '../../input/AppInput';
import { AppSelectInput } from '../../input/AppSelectInput';
import { AppCheckbox } from '../../input/AppCheckbox';
import { AppCollapsibleCheckboxGroup } from '../../input/AppCollapsibleCheckboxGroup';

export function RentAutoForm({ onPreviewUpdate, subcategory }: { onPreviewUpdate: (data: PreviewData) => void; subcategory?: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [driverOpen, setDriverOpen] = useState(false);
  const form = useForm<AutoRentFormData>({
    resolver: zodResolver(auto.rentSchema) as Resolver<AutoRentFormData>,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: '',
      currency: 'EUR',
      period: 'day',
      location: { lat: 0, lng: 0, address: '', fullAddress: '' },
      startDate: '',
      endDate: '',
      status: '',
      fuel: '',
      features: '',
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
      withDriver: false,
      driverName: '',
      driverContact: '',
      driverTelephone: '',
    },
  });

  const watchedValues = useWatch({ control: form.control });

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setUploadedFiles(previewUrls);
    form.setValue('uploadedFiles', previewUrls);
    form.trigger('uploadedFiles');
  };

  const previewData = useMemo(
    () => ({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.price || '',
      currency: watchedValues.currency || 'EUR',
      period: watchedValues.period || '',
      location: watchedValues.location?.address || '',
      category: 'rent',
      uploadedFiles,
      fuel: watchedValues.fuel || '',
      status: watchedValues.status || '',
      mileage: watchedValues.mileage || '',
      year: watchedValues.year || '',
      features: watchedValues.features || '',
      options,
      startDate: watchedValues.startDate || '',
      endDate: watchedValues.endDate || '',
      withDriver: watchedValues.withDriver || false,
      driverName: watchedValues.driverName || '',
      driverContact: watchedValues.driverContact || '',
      driverTelephone: watchedValues.driverTelephone || '',
      brand: watchedValues.brand || '',
      color: watchedValues.color || '',
      engineCapacity: watchedValues.engineCapacity || '',
      carType: watchedValues.carType || '',
      horsePower: watchedValues.horsePower || '',
      transmission: watchedValues.transmission || '',
      is4x4: watchedValues.is4x4 || false,
    }),
    [
      watchedValues.title,
      watchedValues.description,
      watchedValues.price,
      watchedValues.currency,
      watchedValues.period,
      watchedValues.location,
      watchedValues.fuel,
      watchedValues.status,
      watchedValues.mileage,
      watchedValues.year,
      watchedValues.features,
      watchedValues.startDate,
      watchedValues.endDate,
      watchedValues.withDriver,
      watchedValues.driverName,
      watchedValues.driverContact,
      watchedValues.driverTelephone,
      watchedValues.brand,
      watchedValues.color,
      watchedValues.engineCapacity,
      watchedValues.carType,
      watchedValues.horsePower,
      watchedValues.transmission,
      watchedValues.is4x4,
      uploadedFiles,
      options,
    ]
  );

  useEffect(() => {
    onPreviewUpdate(previewData);
  }, [previewData, onPreviewUpdate]);

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

  const onSubmit: SubmitHandler<AutoRentFormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let urls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('category', 'rent');
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

      const result = await submitRentAutoForm({ ...data, uploadedFiles: urls, options });
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
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-6 w-full'>
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-1 gap-4 min-w-0'>
            <AppInput
              type='text'
              placeholder='Introduceți titlul'
              value={form.watch('title')}
              onChange={(e) => form.setValue('title', e.target.value, { shouldValidate: true })}
              className='break-all w-full overflow-wrap-break-word wrap-break-word'
              label='Titlu'
              error={form.formState.errors.title ? [form.formState.errors.title] : undefined}
              required
            />
            <div className='min-w-0 w-full'>
              <AutoPriceSelector form={form} showPeriod={true} />
            </div>
          </div>

          <AppLocationInput
            location={form.watch('location')}
            leftIcon={MapPin}
            onChange={(location) => form.setValue('location', location)}
            placeholder='Introduceți locația'
            className='w-full'
            value={form.watch('location').address}
            onClear={() => form.setValue('location', { lat: 0, lng: 0, address: '', fullAddress: '' })}
            label='Locație'
            error={form.formState.errors.location?.address ? [{ message: form.formState.errors.location.address.message }] : undefined}
            required
          />

          <DateRangePicker form={form} required />

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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0'>
            <AppInput
              type='number'
              step='0.01'
              placeholder='22.500'
              value={form.watch('mileage')}
              onChange={(e) => form.setValue('mileage', e.target.value, { shouldValidate: true })}
              className='break-all w-full'
              label='Kilometraj'
              error={form.formState.errors.mileage ? [form.formState.errors.mileage] : undefined}
              required
            />
            <AppInput
              type='number'
              placeholder='2020'
              value={form.watch('year')}
              onChange={(e) => form.setValue('year', e.target.value, { shouldValidate: true })}
              className='break-all w-full'
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
              options={[
                { value: 'SUV', label: 'SUV' },
                { value: 'Coupe', label: 'Coupe' },
                { value: 'Sedan', label: 'Sedan' },
                { value: 'Hatchback', label: 'Hatchback' },
                { value: 'Convertible', label: 'Convertible' },
                { value: 'Wagon', label: 'Wagon' },
                { value: 'Pickup', label: 'Pickup' },
                { value: 'Van', label: 'Van' },
                { value: 'Other', label: 'Altul' },
              ]}
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
              required
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
            placeholder='Listează caracteristicile...'
            label='Caracteristici'
            error={form.formState.errors.features ? [form.formState.errors.features] : undefined}
            className='min-w-0 w-full wrap-break-word'
          />

          <Collapsible
            open={driverOpen}
            onOpenChange={(open) => {
              setDriverOpen(open);
              form.setValue('withDriver', open);
            }}
          >
            <CollapsibleTrigger asChild>
              <div className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-default'>
                <div onClick={(e) => e.stopPropagation()}>
                  <AppCheckbox
                    label=''
                    value={driverOpen}
                    onChange={(checked) => {
                      const isChecked = checked === true;
                      setDriverOpen(isChecked);
                      form.setValue('withDriver', isChecked);
                    }}
                    className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
                  />
                </div>
                <div className='grid gap-1.5 font-normal'>
                  <p className='text-sm leading-none font-medium'>Cu Șofer</p>
                  <p className='text-muted-foreground text-sm'>
                    Selectați această opțiune dacă doriți să includeți un șofer în închiriere.
                  </p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='space-y-2 pl-6'>
              <AppInput
                type='text'
                placeholder='Introduceți numele șoferului'
                value={form.watch('driverName')}
                onChange={(e) => form.setValue('driverName', e.target.value, { shouldValidate: true })}
                className='break-all w-full wrap-break-word'
                label='Nume Șofer'
                error={form.formState.errors.driverName ? [form.formState.errors.driverName] : undefined}
                required={driverOpen}
              />
              <AppInput
                type='text'
                placeholder='Introduceți contactul șoferului'
                value={form.watch('driverContact')}
                onChange={(e) => form.setValue('driverContact', e.target.value, { shouldValidate: true })}
                className='break-all w-full wrap-break-word'
                label='Contact Șofer'
                error={form.formState.errors.driverContact ? [form.formState.errors.driverContact] : undefined}
                required={driverOpen}
              />
              <AppInput
                type='text'
                placeholder='Introduceți telefonul șoferului'
                value={form.watch('driverTelephone')}
                onChange={(e) => form.setValue('driverTelephone', e.target.value, { shouldValidate: true })}
                className='break-all w-full wrap-break-word'
                label='Telefon Șofer'
                error={form.formState.errors.driverTelephone ? [form.formState.errors.driverTelephone] : undefined}
                required={driverOpen}
              />
            </CollapsibleContent>
          </Collapsible>

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
