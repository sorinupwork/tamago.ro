'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import FormTextarea from '@/components/custom/form/controls/FormTextarea';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import { auto, AutoAuctionFormData } from '@/lib/validations';
import { Car, Fuel, Settings } from 'lucide-react';
import type { PreviewData } from '@/components/custom/categories/CategoriesClient';
import { submitAuctionAutoForm } from '@/actions/auto/actions';
import { toast } from 'sonner';

export function AuctionAutoForm({ onPreviewUpdate, subcategory }: { onPreviewUpdate: (data: PreviewData) => void; subcategory?: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const form = useForm<AutoAuctionFormData>({
    resolver: zodResolver(auto.auctionSchema) as Resolver<AutoAuctionFormData>,
    defaultValues: { title: '', description: '', startingBid: 0, location: '', features: '', endDate: '', uploadedFiles: [] },
  });
  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.startingBid?.toString() || '',
      currency: 'EUR',
      location: watchedValues.location || '',
      category: 'auction',
      uploadedFiles,
      fuel: watchedValues.fuel || '',
      mileage: 0,
      year: 0,
      features: watchedValues.features || '',
      options,
    });
  }, [
    watchedValues.title,
    watchedValues.description,
    watchedValues.startingBid,
    watchedValues.location,
    watchedValues.fuel,
    watchedValues.features,
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
    try {
      const result = await submitAuctionAutoForm({ ...data, uploadedFiles, options });
      if (result.success) {
        toast.success('Formular trimis cu succes!');
        form.reset();
        setUploadedFiles([]);
        setOptions([]);
        setUploaderKey((k) => k + 1);
        setUploadError(false);
      } else {
        toast.error('Eroare la trimiterea formularului.');
      }
    } catch {
      toast.error('Eroare la trimiterea formularului.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='space-y-6'>
      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='title'>Titlu</FieldLabel>
              <Input {...form.register('title')} placeholder='Introduceți titlul' />
              <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
            </Field>
            <Field>
              <FieldLabel htmlFor='startingBid'>Ofertă de început</FieldLabel>
              <Input {...form.register('startingBid', { valueAsNumber: true })} type='number' placeholder='0' min={0} step={0.01} />
              <FieldError errors={form.formState.errors.startingBid ? [form.formState.errors.startingBid] : undefined} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='location'>Locație</FieldLabel>
            <Input {...form.register('location')} placeholder='Introduceți locația' />
            <FieldError errors={form.formState.errors.location ? [form.formState.errors.location] : undefined} />
          </Field>

          <Field>
            <FieldLabel htmlFor='endDate'>Data de sfârșit</FieldLabel>
            <Input {...form.register('endDate')} type='date' placeholder='YYYY-MM-DD' />
            <FieldError errors={form.formState.errors.endDate ? [form.formState.errors.endDate] : undefined} />
          </Field>

          <Field>
            <FieldLabel htmlFor='description' className='flex items-center gap-2'>
              <Car className='h-4 w-4' /> Descriere
            </FieldLabel>
            <FormTextarea value={form.watch('description')} onChange={(v) => form.setValue('description', v)} placeholder='Descrieți produsul detaliat...' />
            <FieldError errors={form.formState.errors.description ? [form.formState.errors.description] : undefined} />
          </Field>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='status'>Status</FieldLabel>
              <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v)}>
                <SelectTrigger>
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
              <Field>
                <FieldLabel htmlFor='fuel' className='flex items-center gap-2'>
                  <Fuel className='h-4 w-4' /> Combustibil
                </FieldLabel>
                <Select value={form.watch('fuel')} onValueChange={(v) => form.setValue('fuel', v)}>
                  <SelectTrigger>
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

          <Field>
            <FieldLabel htmlFor='features' className='flex items-center gap-2'>
              <Settings className='h-4 w-4' /> Caracteristici
            </FieldLabel>
            <FormTextarea value={form.watch('features')} onChange={(v) => form.setValue('features', v)} placeholder='Listează caracteristicile...' />
            <FieldError errors={form.formState.errors.features ? [form.formState.errors.features] : undefined} />
          </Field>

          <FieldSet>
            <FieldLegend>Opțiuni Adiționale</FieldLegend>
            <FieldGroup className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {availableOptions.map((option) => (
                <Field key={option} orientation='horizontal'>
                  <Checkbox id={option} onCheckedChange={(checked) => toggleOption(option, checked)} />
                  <FieldLabel htmlFor={option} className='font-normal'>
                    {option}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <Field>
            <FieldLabel className={uploadError ? 'text-red-600' : ''}>Fotografii</FieldLabel>
            <div className={uploadError ? 'rounded-md ring-2 ring-red-500 p-1' : ''}>
              <MediaUploader
                key={uploaderKey}
                category='auction'
                onUpload={(urls) => {
                  setUploadedFiles(urls);
                  form.setValue('uploadedFiles', urls);
                  if (urls.length > 0) setUploadError(false);
                }}
              />
            </div>
            <FieldError errors={form.formState.errors.uploadedFiles ? [form.formState.errors.uploadedFiles] : undefined} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        type='submit'
        onClick={() => form.trigger()}
        disabled={isSubmitting}
        className='w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg'
      >
        {isSubmitting ? 'Se trimite...' : 'Trimite Licitație'}
      </Button>
    </form>
  );
}
