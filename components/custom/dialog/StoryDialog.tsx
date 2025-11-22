'use client';

import { useEffect, useMemo, useState } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AppMediaUploaderInput } from '@/components/custom/input/AppMediaUploaderInput';
import { createStoryAction } from '@/actions/social/stories/actions';
import { useSession } from '@/lib/auth/auth-client';
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/custom/empty/Empty';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StoryDialog({ open, onOpenChange }: Props) {
  const [uploaderKey, setUploaderKey] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
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

  const sanitizedCaption = sanitizeHtml(caption || '', { allowedTags: [], allowedAttributes: {} });

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
          <div className='min-h-[300px] flex items-center justify-center'>
            <Empty>
              <EmptyMedia>
                <Camera className='w-12 h-12 p-2' />
              </EmptyMedia>
              <EmptyTitle>Conectează-te pentru a adăuga povești</EmptyTitle>
              <EmptyDescription>
                Trebuie să fii conectat pentru a posta povești și a împărtăși conținut. Conectează-te pentru a începe.
              </EmptyDescription>
              <Button onClick={() => router.push('/cont')}>Conectează-te</Button>
            </Empty>
          </div>
        ) : (
          <form action={createStoryAction} className='space-y-4'>
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
                {sanitizedCaption && (
                  <div className='border border-t-0 p-3 rounded-b-lg shadow-md'>
                    <p className='text-sm font-semibold'>{sanitizedCaption}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor='caption'>Descriere</Label>
              <textarea
                id='caption'
                name='caption'
                placeholder='Spune ceva...'
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className='mt-1 w-full rounded-md p-2 bg-input text-foreground'
              />
            </div>

            <Button type='submit' className='w-full'>
              Postează Povestea
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
