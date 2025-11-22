'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { FileText, Smile } from 'lucide-react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AppTextarea from '@/components/custom/input/AppTextarea';
import { AppMediaUploaderInput } from '@/components/custom/input/AppMediaUploaderInput';
import { AppTagsInput } from '@/components/custom/input/AppTagsInput';
import { createFeedAction } from '@/actions/social/feeds/actions';
import { useSession } from '@/lib/auth/auth-client';
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/custom/empty/Empty';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FeedDialog({ open, onOpenChange }: Props) {
  const [uploaderKey, setUploaderKey] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setUploaderKey((p) => p + 1);
  };

  const sanitizedText = sanitizeHtml(text || '', { allowedTags: [], allowedAttributes: {} });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setText('');
          setFiles([]);
          setTags([]);
        }
      }}
    >
      <DialogContent className='max-w-lg' onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <FileText className='h-5 w-5 mr-2' />
            Creează o Postare
          </DialogTitle>
        </DialogHeader>

        {!session ? (
          <div className='min-h-[300px] flex items-center justify-center'>
            <Empty>
              <EmptyMedia>
                <FileText className='w-12 h-12 p-2' />
              </EmptyMedia>
              <EmptyTitle>Conectează-te pentru a crea postări</EmptyTitle>
              <EmptyDescription>
                Trebuie să fii conectat pentru a posta pe feed și a împărtăși gânduri. Conectează-te pentru a începe.
              </EmptyDescription>
              <Button onClick={() => router.push('/cont')}>Conectează-te</Button>
            </Empty>
          </div>
        ) : (
          <form action={createFeedAction} className='space-y-4'>
            <div>
              <AppTextarea
                label='Ce ai pe suflet?'
                placeholder='Împărtășește-ți gândurile...'
                value={text}
                onChange={(valueOrEvent: string | ChangeEvent<HTMLTextAreaElement>) => {
                  const v = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value;
                  setText(v);
                }}
                icon={Smile}
              />
              <input type='hidden' name='text' value={text} />
            </div>

            <div>
              <AppTagsInput label='Tag-uri (pentru căutare)' tags={tags} onTagsChange={(ts: string[]) => setTags(ts)} />
              {tags.map((t, i) => (
                <input key={i} type='hidden' name='tags' value={t} />
              ))}
            </div>

            <div>
              <AppMediaUploaderInput
                id='feed-media'
                name='files'
                uploaderKey={uploaderKey}
                onFilesChange={(f: File[]) => setFiles(f.slice(0, 5))}
                accept='image/*,video/*'
                maxFiles={5}
                className='mt-1'
                showPreview={false}
                disabled={files.length >= 5}
              />
            </div>

            {previews.length > 0 && (
              <div className='space-y-2'>
                {previews.length === 1 ? (
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
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      className='absolute top-2 right-2'
                      onClick={() => handleRemoveFile(0)}
                    >
                      X
                    </Button>
                  </div>
                ) : (
                  <Carousel opts={{ loop: true, align: 'start' }} className='w-full'>
                    <CarouselContent className='-ml-4'>
                      {previews.map((preview, index) => (
                        <CarouselItem key={index} className='pl-4 md:basis-1/2 lg:basis-1/3'>
                          <div className='relative w-full h-64 rounded-lg overflow-hidden border'>
                            {files[index]?.type.startsWith('image/') ? (
                              <Image
                                src={preview}
                                alt={`Feed preview ${index + 1}`}
                                width={400}
                                height={256}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <video
                                src={preview}
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
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              className='absolute top-2 right-2'
                              onClick={() => handleRemoveFile(index)}
                            >
                              X
                            </Button>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
                {sanitizedText && (
                  <div className='bg-muted p-3 rounded-lg'>
                    <p className='text-sm'>{sanitizedText}</p>
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

            <Button type='submit' className='w-full'>
              Postează pe Feed
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
