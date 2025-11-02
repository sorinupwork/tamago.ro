'use client';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

type PreviewProps = {
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  uploadedFiles: string[];
};

export function Preview({ title, description, price, location, category, uploadedFiles }: PreviewProps) {
  return (
    <Card className='animate-in fade-in-0 slide-in-from-right-4 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Previzualizare Postare</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-between items-start'>
          <h3 className='text-lg font-semibold'>{title || 'Titlu Postare'}</h3>
          <Badge variant={category === 'auction' ? 'destructive' : 'secondary'}>
            {category === 'sell' ? 'Vânzare' : category === 'buy' ? 'Cumpărare' : category === 'rent' ? 'Închiriere' : 'Licitație'}
          </Badge>
        </div>
        <p className='text-2xl font-bold text-green-600'>${price?.toLocaleString('en-US') || '0'}</p>
        <p className='text-sm text-muted-foreground'>Locație: {location || 'Necunoscută'}</p>

        {uploadedFiles.length > 0 && (
          <Carousel className='w-full'>
            <CarouselContent>
              {uploadedFiles.map((file, index) => (
                <CarouselItem key={index}>
                  {file.includes('.mp4') || file.includes('.avi') ? (
                    <video controls className='w-full h-32 object-cover rounded'>
                      <source src={file} />
                    </video>
                  ) : (
                    <Image src={file} alt={`Media ${index + 1}`} width={300} height={200} className='w-full h-32 object-cover rounded' />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <div className='prose prose-sm max-w-none' dangerouslySetInnerHTML={{ __html: description || 'Descriere...' }} />

        <p className='text-xs text-muted-foreground'>Adăugat: {new Date().toLocaleDateString('ro-RO')}</p>
      </CardContent>
    </Card>
  );
}
