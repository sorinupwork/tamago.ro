'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import AppMediaUploaderInput from '@/components/custom/input/AppMediaUploaderInput';
import AppTagsInput from '@/components/custom/input/AppTagsInput';
import AppTextarea from '@/components/custom/input/AppTextarea';
import LoadingIndicator from '../loading/LoadingIndicator';
import { updateProfile } from '@/actions/auth/actions';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  imagePreview?: string | null;
  coverPreview?: string | null;
  files?: File[];
  coverFiles?: File[];
  userId?: string;
  onFilesChange?: (files: File[]) => void;
  onCoverFilesChange?: (files: File[]) => void;
  onImageRemove?: () => void;
  onCoverImageRemove?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  bioInitial?: string | null;
  platformsInitial?: string[] | null;
  onActivityUpdate?: (activity: string) => void;
};

export default function EditProfileDrawer({
  open,
  onOpenChange,
  name,
  onNameChange,
  email,
  imagePreview,
  coverPreview,
  files = [],
  coverFiles = [],
  userId,
  onFilesChange,
  onCoverFilesChange,
  onImageRemove,
  onCoverImageRemove,
  bioInitial = null,
  platformsInitial = null,
  onActivityUpdate,
}: Props) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [saving, setSaving] = useState(false);

  const [localImageFile, setLocalImageFile] = useState<File | null>(null);
  const [localCoverFile, setLocalCoverFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const [bio, setBio] = useState<string>(bioInitial ?? '');
  const [platforms, setPlatforms] = useState<string[]>(platformsInitial ?? []);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 140);
      setLocalImagePreview(imagePreview || null);
      setLocalImageFile(null);

      setLocalCoverFile(null);
      setBio(bioInitial ?? '');
      setPlatforms(platformsInitial ?? []);
    }
  }, [open, imagePreview, coverPreview, bioInitial, platformsInitial]);

  useEffect(() => {
    setLocalImageFile(files[0] || null);
    setLocalImagePreview(files[0] ? URL.createObjectURL(files[0]) : imagePreview || null);
  }, [files, imagePreview]);

  useEffect(() => {
    setLocalCoverFile(coverFiles[0] || null);
  }, [coverFiles]);

  const handleFilesChange = (selectedFiles: File[]) => {
    const f = selectedFiles?.[0];
    if (!f) {
      setLocalImageFile(null);
      setLocalImagePreview(imagePreview || null);
      onFilesChange?.([]);
      return;
    }
    setLocalImageFile(f);
    setLocalImagePreview(URL.createObjectURL(f));
    onFilesChange?.(selectedFiles);
  };

  const handleCoverFilesChange = (selectedFiles: File[]) => {
    const f = selectedFiles?.[0];
    if (!f) {
      setLocalCoverFile(null);
      onCoverFilesChange?.([]);
      return;
    }
    setLocalCoverFile(f);
    onCoverFilesChange?.(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Numele este obligatoriu');
      return;
    }
    setSaving(true);
    let uploadedImageUrl: string | null = null;
    let uploadedCoverUrl: string | null = null;
    try {
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

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Avatar upload failed:', errorText);
          throw new Error('Upload failed');
        }
        const data = await res.json();

        uploadedImageUrl = data.urls?.[0];
        if (!uploadedImageUrl) throw new Error('No avatar URL returned');
      }

      if (localCoverFile) {
        const uploadForm = new FormData();
        uploadForm.append('files', localCoverFile);
        uploadForm.append('userId', userId || 'anonymous');
        uploadForm.append('category', 'user');
        uploadForm.append('subcategory', 'cover');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadForm,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Cover upload failed:', errorText);
          throw new Error('Cover upload failed');
        }
        const data = await res.json();

        uploadedCoverUrl = data.urls?.[0];
        if (!uploadedCoverUrl) throw new Error('No cover URL returned');
      }

      const fd = new FormData();
      fd.append('name', name);
      if (uploadedImageUrl) fd.append('imageUrl', uploadedImageUrl);
      if (uploadedCoverUrl) fd.append('coverUrl', uploadedCoverUrl);
      fd.append('bio', bio ?? '');
      try {
        fd.append('platforms', JSON.stringify(platforms || []));
      } catch {
        // ignore
      }

      await updateProfile(fd);

      toast.success('Profil actualizat');
      onActivityUpdate?.(`Profil actualizat - ${new Date().toLocaleString()}`);
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error('Eșec la actualizarea profilului', err);
      toast.error('Nu s-a putut actualiza profilul');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalImageFile(null);
    setLocalImagePreview(imagePreview || null);
    setLocalCoverFile(null);
    onFilesChange?.([]);
    onCoverFilesChange?.([]);
    setBio(bioInitial ?? '');
    setPlatforms(platformsInitial ?? []);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full md:w-1/2 bg-card h-screen flex flex-col overflow-hidden'>
        <SheetHeader>
          <SheetTitle className='text-lg font-medium text-primary'>Edit Profile</SheetTitle>
        </SheetHeader>

        <form className='p-6 flex flex-col h-full min-h-0' onSubmit={handleSubmit} noValidate>
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
              <input value={email} readOnly className='mt-1 block w-full rounded-md border bg-muted px-3 py-2 text-muted-foreground' />
            </label>

            <div>
              <span className='text-sm font-semibold block mb-2'>Avatar</span>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={localImagePreview ?? undefined} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>

                <div className='flex flex-col'>
                  <div>
                    <AppMediaUploaderInput
                      onFilesChange={handleFilesChange}
                      className='p-0!'
                      accept='image/*'
                      maxFiles={1}
                      showPreview={false}
                      layout='row'
                    />
                  </div>

                  <div className='mt-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={() => {
                        setLocalImageFile(null);
                        setLocalImagePreview(null);
                        onImageRemove?.();
                      }}
                    >
                      Remove avatar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className='text-sm font-semibold block mb-2'>Cover Photo</span>
              <div className='flex flex-col gap-3'>
                <AppMediaUploaderInput
                  onFilesChange={handleCoverFilesChange}
                  className='p-0! w-full'
                  accept='image/*'
                  maxFiles={1}
                  showPreview={true}
                  layout='col'
                />

                <div className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>Tip: use a wide image for best result.</div>
                  <div>
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={() => {
                        setLocalCoverFile(null);
                        onCoverImageRemove?.();
                      }}
                    >
                      Remove cover
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <AppTextarea
                label='About / Bio'
                value={bio}
                onChange={(v) => setBio(v)}
                placeholder='Tell people about yourself...'
                name='bio'
                id='bio'
              />
            </div>

            <div>
              <AppTagsInput label='Social Platforms' tags={platforms} onTagsChange={(t) => setPlatforms(t)} maxTags={24} />
              <p className='text-sm text-muted-foreground mt-2'>These are platform labels (no external links) shown on your profile.</p>
            </div>
          </div>

          <SheetFooter className='flex justify-end space-x-2 bg-card/95 backdrop-blur p-4 sticky bottom-0 z-10'>
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
