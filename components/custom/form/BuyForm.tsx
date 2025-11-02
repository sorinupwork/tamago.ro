'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import { buySchema, BuyFormData } from '@/lib/validations';
import dynamic from 'next/dynamic';
import { Search, DollarSign, MapPin } from 'lucide-react';
const Editor = dynamic(() => import('react-simple-wysiwyg').then((mod) => ({ default: mod.default })), { ssr: false });

const ReusableFormField = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  ...props
}: {
  control: Control<BuyFormData>;
  name: keyof BuyFormData;
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

interface BuyFormProps {
  onPreviewUpdate: (data: {
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    uploadedFiles: string[];
  }) => void;
}

export function BuyForm({ onPreviewUpdate }: BuyFormProps) {
  const form = useForm<BuyFormData>({
    resolver: zodResolver(buySchema),
    defaultValues: { title: '', description: '', price: 0, location: '', budget: 0 },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.budget || 0,
      location: watchedValues.location || '',
      category: 'buy',
      uploadedFiles: [],
    });
  }, [watchedValues.title, watchedValues.description, watchedValues.budget, watchedValues.location, onPreviewUpdate]);

  const onSubmit = (data: BuyFormData) => {
    console.log('Buy Form Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ReusableFormField
            control={form.control}
            name='title'
            label={
              <>
                <Search className='h-4 w-4' /> Titlu
              </>
            }
            placeholder='Introduceți titlul căutării'
          />
          <ReusableFormField
            control={form.control}
            name='budget'
            label={
              <>
                <DollarSign className='h-4 w-4' /> Buget
              </>
            }
            placeholder='0'
            type='number'
          />
        </div>
        <ReusableFormField
          control={form.control}
          name='location'
          label={
            <>
              <MapPin className='h-4 w-4' /> Locație
            </>
          }
          placeholder='Introduceți locația'
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere Detaliată</FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder='Descrieți ce căutați...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preț Maxim Dorit</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selectați prețul' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='5000'>Sub 5,000€</SelectItem>
                    <SelectItem value='10000'>Sub 10,000€</SelectItem>
                    <SelectItem value='20000'>Sub 20,000€</SelectItem>
                    <SelectItem value='50000'>Sub 50,000€</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='preferences'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferințe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selectați preferințe' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='new'>Nou</SelectItem>
                    <SelectItem value='used'>Second Hand</SelectItem>
                    <SelectItem value='luxury'>Lux</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormLabel>Caracteristici Dorite</FormLabel>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {['GPS', 'Aer Conditionat', 'Scaune Încălzite', 'Cameră 360°', 'Navigație', 'Bluetooth'].map((option) => (
              <div key={option} className='flex items-center space-x-2'>
                <Checkbox id={option} />
                <label htmlFor={option} className='text-sm'>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <MediaUploader category='buy' />
        <Button
          type='submit'
          className='w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg'
        >
          Trimite Căutare
        </Button>
      </form>
    </Form>
  );
}
