'use client';

import { useEffect, useMemo, useState } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppMediaUploaderInput from '@/components/custom/input/AppMediaUploaderInput';
import AppTextarea from '@/components/custom/input/AppTextarea';
import AuthEmptyState from '@/components/custom/empty/AuthEmptyState';
import { createStoryAction } from '@/actions/social/stories/actions';
import { useSession } from '@/lib/auth/auth-client';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StoryDialog({ open, onOpenChange }: Props) {
  const [uploaderKey, setUploaderKey] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [captionError, setCaptionError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const handleRemoveFile = () => {
    setFiles([]);
    setUploaderKey((p) => p + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (caption.trim().length === 0 && files.length === 0) {
      return setCaptionError('Trebuie să adaugi o descriere sau cel puțin un fișier');
    }
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      await createStoryAction(fd);
      setCaption('');
      setFiles([]);
      setUploaderKey((p) => p + 1);
      onOpenChange(false);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setCaption('');
          setFiles([]);
          setUploaderKey((p) => p + 1);
        }
      }}
    >
      <DialogContent className='max-w-md' onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Camera className='h-5 w-5 mr-2' />
            Adaugă o Poveste
          </DialogTitle>
        </DialogHeader>

        {!session ? (
          <AuthEmptyState
            icon={Camera}
            title='Conectează-te pentru a adăuga povești'
            description='Trebuie să fii conectat pentru a posta povești și a împărtăși conținut. Conectează-te pentru a începe.'
          />
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label>Încarcă Media</Label>
              <AppMediaUploaderInput
                name='files'
                uploaderKey={uploaderKey}
                onFilesChange={(f) => {
                  setFiles(f.slice(0, 1));
                }}
                accept='image/*,video/*'
                maxFiles={1}
                className='mt-1'
                showPreview={false}
                disabled={files.length > 0}
              />
            </div>

            {previews.length > 0 && (
              <div>
                <div className='relative w-full h-64 rounded-t-lg overflow-hidden border'>
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
                {caption && (
                  <div className='border border-t-0 p-3 rounded-b-lg shadow-md'>
                    <p className='text-sm font-semibold'>{caption}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <AppTextarea
                name='caption'
                label='Descriere'
                placeholder='Spune ceva...'
                value={caption}
                onChange={(v: string) => {
                  setCaption(v);
                  if (v.trim().length > 0 || files.length > 0) {
                    setCaptionError(null);
                  } else {
                    setCaptionError('Trebuie să adaugi o descriere sau cel puțin un fișier');
                  }
                }}
              />
              {captionError && <p className='text-sm text-destructive mt-1'>{captionError}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              Postează Povestea
            </Button>
            {loading && <p className='text-sm text-muted-foreground mt-1'>Se postează povestea…</p>}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
