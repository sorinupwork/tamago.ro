'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import { sellSchema, SellFormData } from '@/lib/validations';
import dynamic from 'next/dynamic';
import { Car, Fuel, Settings } from 'lucide-react';
const Editor = dynamic(() => import('react-simple-wysiwyg').then((mod) => ({ default: mod.default })), { ssr: false });

const ReusableFormField = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  ...props
}: {
  control: Control<SellFormData>;
  name: keyof SellFormData;
  label: React.ReactNode;
  placeholder: string;
  type?: string;
  [key: string]: unknown;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className='space-y-2'>
        <FormLabel className='text-sm font-medium flex items-center gap-2'>{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            {...props}
            className='transition-all duration-200 focus:ring-2 focus:ring-primary'
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface SellFormProps {
  onPreviewUpdate: (data: {
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    uploadedFiles: string[];
  }) => void;
}

export function SellForm({ onPreviewUpdate }: SellFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const form = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: { title: '', description: '', price: 0, location: '', features: '' },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.price || 0,
      location: watchedValues.location || '',
      category: 'sell',
      uploadedFiles,
    });
  }, [watchedValues.title, watchedValues.description, watchedValues.price, watchedValues.location, uploadedFiles, onPreviewUpdate]);

  const onSubmit = (data: SellFormData) => {
    console.log('Sell Form Data:', { ...data, uploadedFiles });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ReusableFormField control={form.control} name='title' label='Titlu' placeholder='Introduceți titlul' />
          <ReusableFormField control={form.control} name='price' label='Preț' placeholder='0' type='number' />
        </div>
        <ReusableFormField control={form.control} name='location' label='Locație' placeholder='Introduceți locația' />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-2'>
                <Car className='h-4 w-4' /> Descriere
              </FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder='Descrieți produsul detaliat...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selectați status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='new'>Nou</SelectItem>
                    <SelectItem value='used'>Second Hand</SelectItem>
                    <SelectItem value='damaged'>Deteriorat</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='fuel'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <Fuel className='h-4 w-4' /> Combustibil
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selectați combustibil' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Petrol'>Benzină</SelectItem>
                    <SelectItem value='Diesel'>Motorină</SelectItem>
                    <SelectItem value='Hybrid'>Hibrid</SelectItem>
                    <SelectItem value='Electric'>Electric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='features'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-2'>
                <Settings className='h-4 w-4' /> Caracteristici
              </FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder='Listează caracteristicile...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          <FormLabel>Opțiuni Adiționale</FormLabel>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°'].map((option) => (
              <div key={option} className='flex items-center space-x-2'>
                <Checkbox id={option} />
                <label htmlFor={option} className='text-sm'>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <MediaUploader category='sell' onUpload={(urls) => setUploadedFiles(urls)} />
        <Button
          type='submit'
          className='w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg'
        >
          Trimite Vânzare
        </Button>
      </form>
    </Form>
  );
}
