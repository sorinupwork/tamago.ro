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
import { MediaUploader } from '@/components/custom/MediaUploader';
import { rentSchema, RentFormData } from '@/lib/validations';
import dynamic from 'next/dynamic';
import { Calendar, Clock, MapPin } from 'lucide-react';

// Dynamically import Editor
const Editor = dynamic(() => import('react-simple-wysiwyg').then((mod) => ({ default: mod.default })), { ssr: false });

// Reusable Form Field Component
const ReusableFormField = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  ...props
}: {
  control: Control<RentFormData>;
  name: keyof RentFormData;
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

interface RentFormProps {
  onPreviewUpdate: (data: {
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    uploadedFiles: string[];
  }) => void;
}

export function RentForm({ onPreviewUpdate }: RentFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const form = useForm<RentFormData>({
    resolver: zodResolver(rentSchema),
    defaultValues: { title: '', description: '', price: 0, location: '', duration: '' },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.price || 0,
      location: watchedValues.location || '',
      category: 'rent',
      uploadedFiles,
    });
  }, [watchedValues.title, watchedValues.description, watchedValues.price, watchedValues.location, uploadedFiles, onPreviewUpdate]);

  const onSubmit = (data: RentFormData) => {
    console.log('Rent Form Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ReusableFormField control={form.control} name='title' label='Titlu' placeholder='Introduceți titlul' />
          <ReusableFormField
            control={form.control}
            name='price'
            label={
              <>
                <Clock className='h-4 w-4' /> Preț pe Zi
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
              <FormLabel>Descriere</FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder='Descrieți închirierea...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Calendar className='h-4 w-4 inline mr-2' />
                  Durată
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selectați durata' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='1 zi'>1 Zi</SelectItem>
                    <SelectItem value='1 săptămână'>1 Săptămână</SelectItem>
                    <SelectItem value='1 lună'>1 Lună</SelectItem>
                    <SelectItem value='3 luni'>3 Luni</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tip Închiriere</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selectați tipul' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='short'>Scurtă Durată</SelectItem>
                    <SelectItem value='long'>Lungă Durată</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormLabel>Opțiuni Suplimentare</FormLabel>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {['Asigurare Inclusă', 'Km Nelimitat', 'Suport 24/7', 'Curățenie'].map((option) => (
              <div key={option} className='flex items-center space-x-2'>
                <Checkbox id={option} />
                <label htmlFor={option} className='text-sm'>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <MediaUploader category='rent' onUpload={(urls) => setUploadedFiles(urls)} />
        <Button
          type='submit'
          className='w-full bg-linear-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-lg'
        >
          Trimite Închiriere
        </Button>
      </form>
    </Form>
  );
}
