'use client';

import { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, Eye, Download, Play, Share2, ZoomIn } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

export type MediaItem = {
  type: 'image' | 'video' | 'document';
  url: string;
  alt?: string;
  title?: string;
  filename?: string;
  content?: string;
  poster?: string;
  icon?: React.ReactNode;
  id?: string | number;
};

type MediaPreviewProps = {
  mediaItems: MediaItem[];
  className?: string;
  trigger?: React.ReactNode;
  initialIndex?: number;
  aspectRatio?: number;
  maxPhotos?: number;
  showOverflow?: boolean;
  gridClassName?: string;
  imageClassName?: string;
};

export default function MediaPreview({
  mediaItems,
  className,
  trigger,
  initialIndex = 0,
  aspectRatio = 1,
  maxPhotos = 6,
  showOverflow = true,
  gridClassName,
  imageClassName,
}: MediaPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [urlStatus, setUrlStatus] = useState('pending');
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [imageSrc, setImageSrc] = useState(mediaItems[selectedIndex]?.url || '');

  const currentItem = mediaItems[selectedIndex];

  const isPdf = (() => {
    const s = String(currentItem?.filename || currentItem?.url || '').toLowerCase();
    return /\.pdf($|\?)/i.test(s) || s.endsWith('.pdf');
  })();

  useEffect(() => {
    if (!isOpen || currentItem?.type !== 'document') return;

    const checkUrl = async () => {
      if (!currentItem.url) {
        setUrlStatus('invalid');
        return;
      }

      if (isPdf) {
        setUrlStatus('valid');
        return;
      }

      if (currentItem.url.includes('sample-document') || currentItem.url.startsWith('data:') || currentItem.url.startsWith('blob:')) {
        setUrlStatus(currentItem.content ? 'invalid' : 'valid');
        return;
      }

      try {
        const resp = await fetch(currentItem.url, { method: 'HEAD' });
        const ct = resp.headers.get('content-type') || '';
        if (ct.includes('pdf') || ct.startsWith('image/') || ct.includes('text/')) {
          setUrlStatus('valid');
        } else {
          setUrlStatus('invalid');
        }
      } catch {
        setUrlStatus('invalid');
      }
    };

    checkUrl();
  }, [isOpen, currentItem, isPdf]);

  const handleImageError = (photoId: string | number) => {
    setImageLoadErrors((prev) => new Set([...prev, photoId]));
  };

  const openPreview = (index: number) => {
    setSelectedIndex(index);
    setImageSrc(mediaItems[index]?.url || '');
    setIsOpen(true);
  };

  const closePreview = () => {
    setIsOpen(false);
  };

  const handleDownload = () => {
    if (currentItem?.url) {
      const isPdf = (currentItem.filename || currentItem.url || '').toLowerCase().endsWith('.pdf');
      if (isPdf) {
        window.open(currentItem.url, '_blank', 'noopener,noreferrer');
      } else {
        const link = document.createElement('a');
        link.href = currentItem.url;
        link.download = currentItem.filename || currentItem.title || `download-${Date.now()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      console.warn('Download/Preview URL not available');
    }
  };

  const handleShare = async () => {
    if (navigator.share && currentItem?.url) {
      try {
        await navigator.share({
          title: currentItem.title || 'Imagine',
          url: currentItem.url,
        });
        toast.success('Distribuit cu succes!');
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Eroare la distribuire.');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentItem?.url || '');
        toast.success('Link copiat în clipboard!');
      } catch {
        toast.error('Eroare la copierea link-ului.');
      }
    }
  };

  const handlePreview = () => {
    if (currentItem?.url) {
      window.open(currentItem.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Preview URL not available');
    }
  };

  const renderPreview = (item: MediaItem) => {
    switch (item.type) {
      case 'video':
        return (
          <div className='w-full h-[70vh] md:h-96 overflow-hidden bg-muted/20 border rounded-md flex items-center justify-center'>
            {item.url ? (
              <video
                src={item.url}
                controls
                controlsList='nodownload noremoteplayback'
                className='max-h-full max-w-full bg-black'
                poster={item.poster}
              >
                Ne pare rău, browser-ul dumneavoastră nu suportă videoclipuri încorporate. Puteți{' '}
                <a href={item.url} target='_blank' rel='noopener noreferrer'>
                  deschide videoclipul
                </a>{' '}
                într-o filă nouă.
              </video>
            ) : (
              <div className='flex flex-col items-center justify-center p-4'>
                <Play size={48} className='mb-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>Videoclipul nu este disponibil</p>
              </div>
            )}
          </div>
        );

      case 'image':
        if (isPdf) {
          return (
            <div className='w-full h-[70vh] md:h-96 overflow-hidden bg-muted/20 border rounded-md'>
              <iframe src={item.url} title={item.title || item.filename || 'Previzualizare PDF'} className='w-full h-full' />
            </div>
          );
        }

        return (
          <div className='relative w-full h-[70vh] md:h-96 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center'>
            <div className='absolute inset-0 opacity-20'>
              <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <pattern id='checkerboard' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'>
                    <rect width='10' height='10' fill='#f3f4f6' />
                    <rect x='10' y='10' width='10' height='10' fill='#f3f4f6' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#checkerboard)' />
              </svg>
            </div>
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={3}
              centerOnInit
              limitToBounds={true}
              wheel={{ step: 0.1 }}
              panning={{ velocityDisabled: true }}
              pinch={{ disabled: true }}
            >
              <TransformComponent
                wrapperClass='!w-full !h-full overflow-hidden flex items-center justify-center'
                contentClass='!w-auto !h-full flex flex-1'
              >
                <div className='relative w-full h-full'>
                  <Image
                    src={imageSrc}
                    alt={currentItem?.alt || currentItem?.title || 'Previzualizare'}
                    fill
                    className='object-contain shadow-lg rounded'
                    onError={() => setImageSrc('/placeholder.svg')}
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
        );

      case 'document':
        return (
          <div className='relative w-full h-[70vh] md:h-96 overflow-hidden bg-muted/20 border rounded-md'>
            {urlStatus === 'valid' && item.url ? (
              isPdf ? (
                <iframe src={item.url} title={item.title || item.filename || 'Previzualizare PDF'} className='w-full h-full' />
              ) : (
                <object data={item.url} type='application/pdf' width='100%' height='100%' className='w-full h-full'>
                  <div className='h-full flex flex-col items-center justify-center text-muted-foreground dark:text-muted'>
                    <FileText size={64} className='mb-4 opacity-50' />
                    <p className='text-lg'>Imposibil de afișat documentul</p>
                    <p className='text-sm'>Browser-ul dumneavoastră poate să nu suporte vizualizarea PDF</p>
                    <Button variant='outline' size='sm' className='mt-4' onClick={handleDownload}>
                      <Download size={16} className='mr-1' />
                      Descarcă
                    </Button>
                  </div>
                </object>
              )
            ) : urlStatus === 'pending' ? (
              <div className='h-full flex flex-col items-center justify-center text-muted-foreground dark:text-muted'>
                <div className='animate-pulse flex flex-col items-center'>
                  <FileText size={64} className='mb-4 opacity-30' />
                  <p className='text-lg'>Se încarcă previzualizarea documentului...</p>
                </div>
              </div>
            ) : (
              <div className='h-full flex flex-col items-center justify-center text-muted-foreground dark:text-muted bg-muted/5'>
                <FileText size={64} className='mb-4 opacity-50' />
                <p className='text-lg'>Previzualizarea documentului nu este disponibilă</p>
                <p className='text-sm'>Documentul nu a putut fi încărcat</p>
                {item.url && (
                  <Button variant='outline' size='sm' className='mt-4' onClick={handleDownload}>
                    <Download size={16} className='mr-1' />
                    Descarcă
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className='flex items-center justify-center h-40'>
            <p>Previzualizarea nu este disponibilă pentru acest tip de conținut.</p>
          </div>
        );
    }
  };

  const renderIcon = (item: MediaItem) => {
    if (item.icon) return item.icon;
    return item.type === 'image' ? <ImageIcon size={16} /> : <FileText size={16} />;
  };

  const remainingCount = mediaItems.length - maxPhotos;

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className={cn('cursor-default', className)} onClick={() => openPreview(initialIndex)}>
            {trigger}
          </div>
        </DialogTrigger>

        <DialogContent className={cn('w-full max-w-full md:max-w-6xl p-4 md:p-6 overflow-hidden', className)}>
          <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
            <DialogTitle className='text-xl font-semibold'>
              {currentItem?.title ||
                currentItem?.filename ||
                (currentItem?.type === 'image' ? 'Previzualizare Imagine' : 'Previzualizare Document')}
            </DialogTitle>
          </DialogHeader>

          <div className='mt-2 mb-4'>
            {currentItem?.type === 'image' && (
              <div className='flex flex-wrap items-center space-x-2 mb-4 gap-2'>
                <Button variant='outline' size='sm' onClick={handleShare}>
                  <Share2 size={16} className='mr-1' />
                  <span className='hidden sm:inline'>Distribuie</span>
                </Button>
              </div>
            )}

            {currentItem?.type === 'document' && urlStatus === 'valid' && (
              <div className='flex items-center space-x-2 mb-4'>
                <Button variant='outline' size='sm' onClick={handlePreview}>
                  <Eye size={16} className='mr-1' />
                  <span>Previzualizează Document</span>
                </Button>
              </div>
            )}

            {renderPreview(currentItem)}
          </div>
          <div className='flex justify-end'>
            <Button onClick={closePreview}>Închide</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted rounded-lg bg-muted/20',
          className
        )}
      >
        <ImageIcon size={32} className='text-muted-foreground mb-2' />
        <p className='text-sm text-muted-foreground'>Nicio fotografie disponibilă</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('space-y-2', className)}>
        <div
          className={cn(
            'grid gap-2',
            mediaItems.length === 1 ? 'grid-cols-1' : mediaItems.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3',
            gridClassName
          )}
        >
          {mediaItems.map((photo, index) => (
            <div key={photo.id || index} className='relative group'>
              <AspectRatio ratio={aspectRatio}>
                <div className='relative w-full h-full overflow-hidden rounded-lg bg-muted'>
                  {photo.type === 'image' && !imageLoadErrors.has(photo.id || index) ? (
                    <Image
                      src={photo.url}
                      alt={photo.alt || photo.title || `Photo ${index + 1}`}
                      fill
                      className={cn('object-cover transition-transform group-hover:scale-105', imageClassName)}
                      onError={() => handleImageError(photo.id || index)}
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                    />
                  ) : photo.type === 'image' ? (
                    <div className='flex items-center justify-center w-full h-full bg-muted'>
                      <ImageIcon size={24} className='text-muted-foreground' />
                    </div>
                  ) : (
                    <div className='flex items-center justify-center w-full h-full bg-muted'>{renderIcon(photo)}</div>
                  )}

                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                    <div className='bg-white/90 rounded-full p-2'>
                      <ZoomIn size={16} className='text-gray-700' />
                    </div>
                  </div>
                </div>
              </AspectRatio>

              <div className='absolute inset-0 cursor-default' onClick={() => openPreview(index)} />

              {index === maxPhotos - 1 && remainingCount > 0 && showOverflow && (
                <div className='absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-semibold text-lg'>+{remainingCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn('w-full max-w-full md:max-w-6xl p-4 md:p-6 overflow-hidden', className)}>
          <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
            <DialogTitle className='text-xl font-semibold'>
              {currentItem?.title ||
                currentItem?.filename ||
                (currentItem?.type === 'image' ? 'Previzualizare Imagine' : 'Previzualizare Document')}
            </DialogTitle>
          </DialogHeader>

          <div className='mt-2 mb-4'>
            {currentItem?.type === 'image' && (
              <div className='flex flex-wrap items-center space-x-2 mb-4 gap-2'>
                <Button variant='outline' size='sm' onClick={handleShare}>
                  <Share2 size={16} className='mr-1' />
                  <span className='hidden sm:inline'>Distribuie</span>
                </Button>
              </div>
            )}

            {currentItem?.type === 'document' && urlStatus === 'valid' && (
              <div className='flex items-center space-x-2 mb-4'>
                <Button variant='outline' size='sm' onClick={handlePreview}>
                  <Eye size={16} className='mr-1' />
                  <span>Previzualizează Document</span>
                </Button>
              </div>
            )}

            {renderPreview(currentItem)}
          </div>
          <div className='flex justify-end'>
            <Button onClick={closePreview}>Închide</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
