'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MediaUploader } from '@/components/custom/media/MediaUploader';
import { auctionSchema, AuctionFormData } from '@/lib/validations';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('react-simple-wysiwyg').then((mod) => ({ default: mod.default })), { ssr: false });

const ReusableFormField = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  ...props
}: {
  control: Control<AuctionFormData>;
  name: keyof AuctionFormData;
  label: React.ReactNode;
  placeholder: string;
  type?: string;
  [key: string]: unknown;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface AuctionFormProps {
  onPreviewUpdate: (data: {
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    uploadedFiles: string[];
  }) => void;
}

export function AuctionForm({ onPreviewUpdate }: AuctionFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const form = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues: { title: '', description: '', price: 0, location: '', startingBid: 0, endDate: '' },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onPreviewUpdate({
      title: watchedValues.title || '',
      description: watchedValues.description || '',
      price: watchedValues.price || 0,
      location: watchedValues.location || '',
      category: 'auction',
      uploadedFiles,
    });
  }, [watchedValues.title, watchedValues.description, watchedValues.price, watchedValues.location, uploadedFiles, onPreviewUpdate]);

  const onSubmit = (data: AuctionFormData) => {
    console.log('Auction Form Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <ReusableFormField control={form.control} name='title' label='Titlu' placeholder='Introduceți titlul' />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere</FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder='Introduceți descrierea' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ReusableFormField control={form.control} name='price' label='Preț de Rezervă' placeholder='0' type='number' />
        <ReusableFormField control={form.control} name='location' label='Locație' placeholder='Introduceți locația' />
        <ReusableFormField control={form.control} name='startingBid' label='Licitație de Start' placeholder='0' type='number' />
        <ReusableFormField control={form.control} name='endDate' label='Data de Sfârșit' placeholder='YYYY-MM-DD' type='date' />
        <MediaUploader category='auction' onUpload={(urls) => setUploadedFiles(urls)} />
        <Button type='submit' className='transition-all duration-300 hover:scale-105'>
          Trimite Licitație
        </Button>
      </form>
    </Form>
  );
}
