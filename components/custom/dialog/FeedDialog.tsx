'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { FileText, Image as ImageIcon, Video, Smile } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AppTextarea from '@/components/custom/input/AppTextarea';
import { AppMediaUploaderInput } from '@/components/custom/input/AppMediaUploaderInput';
import { AppTagsInput } from '@/components/custom/input/AppTagsInput';
import { createFeedAction } from '@/actions/social/feeds/actions';
import { feedSchema, FeedFormData } from '@/lib/validations';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FeedDialog({ open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<FeedFormData>({
    resolver: zodResolver(feedSchema),
    defaultValues: { text: '', files: [], tags: [] },
  });

  const text = watch('text');
  const files = watch('files') || [];
  const tags = watch('tags') || [];

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const onSubmit = (data: FeedFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('text', data.text || '');
      data.files?.forEach((file) => formData.append('files', file));
      data.tags?.forEach((tag) => formData.append('tags', tag));
      await createFeedAction(formData);
      onOpenChange(false);
      toast.success('Feed post created successfully!');
      reset();
    });
  };

  const handleRemoveFile = () => {
    // Update files in form
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <FileText className='h-5 w-5 mr-2' />
            Creează o Postare
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='text'
            control={control}
            render={({ field }) => (
              <AppTextarea
                label='Ce ai pe suflet?'
                placeholder='Împărtășește-ți gândurile...'
                value={field.value}
                onChange={field.onChange}
                icon={Smile}
                error={errors.text ? [{ message: errors.text.message }] : undefined}
              />
            )}
          />

          <Controller
            name='tags'
            control={control}
            render={({ field }) => (
              <AppTagsInput
                label='Tag-uri (pentru căutare)'
                tags={field.value || []}
                onTagsChange={field.onChange}
              />
            )}
          />

          <Controller
            name='files'
            control={control}
            render={({ field }) => (
              <AppMediaUploaderInput
                id='feed-media'
                name='files'
                uploaderKey={2}
                onFilesChange={(f) => field.onChange(f.slice(0, 1))}
                accept='image/*,video/*'
                maxFiles={1}
                className='mt-1'
                showPreview={false}
              />
            )}
          />

          {previews.length > 0 && (
            <div className='space-y-2'>
              <div className='relative w-full h-64 rounded-lg overflow-hidden border'>
                {files[0]?.type.startsWith('image/') ? (
                  <Image
                    src={previews[0]}
                    alt='Feed preview'
                    width={400}
                    height={256}
                    className='w-full h-full object-cover animate-spin-slow'
                    style={{ animationDuration: '10s' }}
                  />
                ) : (
                  <video
                    src={previews[0]}
                    className='w-full h-full object-cover'
                    controls={false}
                    muted
                    autoPlay
                    onLoadedData={(e) => {
                      const video = e.target as HTMLVideoElement;
                      setTimeout(() => video.pause(), 5000);
                    }}
                  />
                )}
                <Button type='button' variant='destructive' size='sm' className='absolute top-2 right-2' onClick={handleRemoveFile}>
                  X
                </Button>
              </div>
              {text?.trim() && (
                <div className='bg-gray-100 p-3 rounded-lg'>
                  <p className='text-sm'>{text}</p>
                </div>
              )}
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag, i) => (
                    <span key={i} className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button type='submit' className='w-full' disabled={!isValid || isPending}>
            {isPending ? 'Posting...' : 'Postează pe Feed'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
