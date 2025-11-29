'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import AppTextarea from '@/components/custom/input/AppTextarea';
import AppMediaUploaderInput from '@/components/custom/input/AppMediaUploaderInput';
import { updateStoryAction } from '@/actions/social/stories/actions';
import type { StoryPost } from '@/lib/types';
import { DialogDescription } from '@radix-ui/react-dialog';

type EditStoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: StoryPost | null;
  onSuccess?: () => void;
};

export default function EditStoryDialog({ open, onOpenChange, story, onSuccess }: EditStoryDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [caption, setCaption] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleOpenChange = (isOpen: boolean) => {
    
    if (!isOpen) {
      setCaption('');
      setNewFiles([]);
      setFilePreviews([]);
      setUploaderKey((p) => p + 1);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (open && story) {
      
      const captionValue = story.caption || '';
      const previewUrls = story.files?.map((f) => f.url) || [];
      
      setCaption(captionValue);
      setFilePreviews(previewUrls);
      setNewFiles([]);
    }
  }, [open, story]);

  const handleFileChange = (files: File[]) => {
    setNewFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return previews;
    });
  };

  const handleRemoveFile = (index: number) => {
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    const newFilesArray = newFiles.filter((_, i) => i !== index);
    setFilePreviews(newPreviews);
    setNewFiles(newFilesArray);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!story) return;

    if (!caption.trim() && newFiles.length === 0 && filePreviews.length === 0) {
      toast.error('Trebuie să adaugi o captură sau media');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    newFiles.forEach((file) => formData.append('files', file));

    startTransition(async () => {
      try {
        const result = await updateStoryAction(story.id, formData);
        if (result.success) {
          toast.success('Poveste actualizată cu succes');
          handleOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Eroare la actualizarea povestei');
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='max-w-2xl max-h-[90vh] overflow-y-auto'
        aria-describedby='edit-story-description'
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editează Poveste</DialogTitle>
          <DialogDescription>Formularul pentru editarea povestei</DialogDescription>
        </DialogHeader>

        {story && (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FieldGroup>
              <AppTextarea
                label='Captură (Opțional)'
                placeholder='Adaugă o captură pentru povestea ta...'
                name='caption'
                onChange={(v: string) => setCaption(v)}
                value={caption}
              />
            </FieldGroup>

            <FieldGroup>
              <AppMediaUploaderInput
                label='Imagine/Video'
                onFilesChange={handleFileChange}
                maxFiles={10}
                showPreview={true}
                layout='col'
                accept='image/*,video/*'
                uploaderKey={uploaderKey}
              />
              {(filePreviews.length > 0 || (story?.files && story.files.length > 0)) && (
                <div className='space-y-2 mt-2'>
                  {filePreviews.map((preview, idx) => (
                    <div key={idx} className='relative rounded-lg overflow-hidden bg-muted h-48 w-full'>
                      {preview.startsWith('blob:') || preview.startsWith('data:') ? (
                        <>
                          {preview.startsWith('data:image/') || preview.includes('image') ? (
                            <Image src={preview} alt={`Preview ${idx}`} fill sizes='100%' className='object-cover' />
                          ) : (
                            <video src={preview} className='w-full h-full object-cover' controls />
                          )}
                        </>
                      ) : (
                        <Image src={preview} alt={`Preview ${idx}`} fill sizes='100%' className='object-cover' />
                      )}
                      <button
                        type='button'
                        onClick={() => handleRemoveFile(idx)}
                        className='absolute top-2 right-2 bg-destructive text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity'
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className='text-xs text-muted-foreground'>Povesterile expiră după 24 ore</p>
            </FieldGroup>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)} disabled={isPending}>
                Anulează
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Se salvează...' : 'Salvează'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
