'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { AppMediaUploaderInput } from '@/components/custom/input/AppMediaUploaderInput';
import { updateProfile } from '@/actions/auth/actions'; // server action
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingIndicator from '../loading/LoadingIndicator';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  imagePreview?: string | null; // Add prop for current image
  files?: File[]; // files passed from parent
  userId?: string;
  onFilesChange?: (files: File[]) => void;
  onImageRemove?: () => void;
  // keep for optional backward compatibility, but form will handle its own save
  onSave?: () => void;
  isSaving?: boolean;
};

export default function EditDrawer({
  open,
  onOpenChange,
  name,
  onNameChange,
  email,
  imagePreview, // New prop
  files = [],
  userId,
  onFilesChange,
  onImageRemove,
}: Props) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [localImageFile, setLocalImageFile] = useState<File | null>(null); // Store selected file locally
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null); // Local preview state
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 140);
      setLocalImagePreview(imagePreview || null); // Initialize with current image
      setLocalImageFile(null); // Reset file
    }
  }, [open, imagePreview]);

  // On file selection, set local file and preview (no upload yet)
  const handleFilesChange = (selectedFiles: File[]) => {
    const f = selectedFiles?.[0];
    if (!f) {
      setLocalImageFile(null);
      setLocalImagePreview(imagePreview || null); // Reset to current
      onFilesChange?.([]);
      return;
    }
    setLocalImageFile(f);
    setLocalImagePreview(URL.createObjectURL(f)); // Immediate local preview
    onFilesChange?.(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Numele este obligatoriu');
      return;
    }
    setSaving(true);
    let uploadedImageUrl: string | null = null;
    try {
      // Upload only on submit
      if (localImageFile) {
        const uploadForm = new FormData();
        uploadForm.append('files', localImageFile);
        uploadForm.append('userId', userId || 'anonymous');
        uploadForm.append('category', 'user');
        uploadForm.append('subcategory', 'avatar');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadForm,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        uploadedImageUrl = data.urls?.[0];
        if (!uploadedImageUrl) throw new Error('No URL returned');
      }

      const fd = new FormData();
      fd.append('name', name);
      if (uploadedImageUrl) fd.append('imageUrl', uploadedImageUrl);

      await updateProfile(fd);

      toast.success('Profil actualizat');
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error('Eșec la actualizarea profilului', err);
      toast.error('Nu s-a putut actualiza profilul');
    } finally {
      setSaving(false);
    }
  };

  // Cancel: reset to current image
  const handleCancel = () => {
    setLocalImageFile(null);
    setLocalImagePreview(imagePreview || null); // Reset to current
    onFilesChange?.([]);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full md:w-1/2 bg-white dark:bg-gray-900'>
        <SheetHeader>
          <SheetTitle className='text-lg font-medium text-primary'>Edit Profile</SheetTitle>
        </SheetHeader>

        <form className='p-6 flex flex-col h-full' onSubmit={handleSubmit} noValidate>
          <div className='flex-1 overflow-y-auto space-y-4'>
            <label className='block'>
              <span className='text-sm font-semibold'>Name</span>
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className='mt-1 block w-full rounded-md border px-3 py-2 bg-transparent'
              />
            </label>

            <label className='block'>
              <span className='text-sm font-semibold'>Email (read-only)</span>
              <input
                value={email}
                readOnly
                className='mt-1 block w-full rounded-md border bg-gray-50 dark:bg-gray-800 px-3 py-2 text-muted-foreground'
              />
            </label>

            <div>
              <span className='text-sm font-semibold block mb-2'>Avatar</span>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={localImagePreview ?? undefined} />
                  <AvatarFallback></AvatarFallback> {/* Remove text, just box */}
                </Avatar>

                <div className='flex flex-col'>
                  <div>
                    <AppMediaUploaderInput onFilesChange={handleFilesChange} className='!p-0' />
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t pt-4'>
              <h4 className='font-medium'>Scalable sections</h4>
              <p className='text-sm text-muted-foreground'>
                Add bank details, socials, verification data and other expandable profile settings here.
              </p>
            </div>
          </div>

          <SheetFooter className='mt-4 flex justify-end space-x-2'>
            <Button variant='outline' type='button' onClick={handleCancel} disabled={saving}>
              Anulează
            </Button>
            <Button type='submit' disabled={saving} className='flex items-center justify-center gap-2'>
              {saving ? <LoadingIndicator inline size={16} showText={false} /> : null}
              {saving ? 'Se salvează...' : 'Salvează modificările'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
