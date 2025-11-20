'use client';
import React, { useEffect, useMemo, useTransition } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppTextarea from '@/components/custom/input/AppTextarea';
import { AppMediaUploaderInput } from '@/components/custom/input/AppMediaUploaderInput';
import { createStoryAction } from '@/actions/social/stories/actions';
import { storySchema, StoryFormData } from '@/lib/validations';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StoryDialog({ open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: { caption: '', files: [] },
  });

  const caption = watch('caption');
  const files = watch('files') || [];

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const onSubmit = (data: StoryFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('caption', data.caption || '');
      data.files?.forEach((file) => formData.append('files', file));
      await createStoryAction(formData);
      onOpenChange(false);
      toast.success('Story posted successfully!');
      reset();
    });
  };

  const handleRemoveFile = () => {
    // Update files
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Camera className='h-5 w-5 mr-2' />
            Adaugă o Poveste
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label>Încarcă Media</Label>
            <Controller
              name='files'
              control={control}
              render={({ field }) => (
                <AppMediaUploaderInput
                  name='files'
                  uploaderKey={1}
                  onFilesChange={(f) => field.onChange(f.slice(0, 1))}
                  accept='image/*,video/*'
                  maxFiles={1}
                  className='mt-1'
                  showPreview={false}
                />
              )}
            />
          </div>

          {previews.length > 0 && (
            <div className='space-y-2'>
              <div className='relative w-full h-64 rounded-lg overflow-hidden border'>
                {files[0]?.type.startsWith('image/') ? (
                  <Image
                    src={previews[0]}
                    alt='Story preview'
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
              {caption?.trim() && (
                <div className='bg-linear-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg shadow-md'>
                  <p className='text-sm font-bold'>{caption}</p>
                </div>
              )}
            </div>
          )}

          <Controller
            name='caption'
            control={control}
            render={({ field }) => (
              <AppTextarea
                id='story-caption'
                name='caption'
                placeholder='Spune ceva...'
                rows={2}
                value={field.value}
                onChange={field.onChange}
                className='mt-1'
                error={errors.caption ? [{ message: errors.caption.message }] : undefined}
              />
            )}
          />
          <input type='hidden' name='caption' value={caption} />

          <Button type='submit' className='w-full' disabled={!isValid || isPending}>
            {isPending ? 'Posting...' : 'Postează Povestea'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
