'use client';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

type PreviewProps = {
  title: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  category: string;
  uploadedFiles: string[];
  fuel: string;
  mileage: number;
  year: number;
  features: string;
  options: string[];
};

export function Preview({ title, description, price, currency, location, category, uploadedFiles, fuel, mileage, year, features, options }: PreviewProps) {
  return (
    <Card className='animate-in fade-in-0 slide-in-from-right-4 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 shadow-md'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Previzualizare Postare</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 overflow-hidden'>
        <div className='flex justify-between items-start'>
          <h3 className='text-lg font-semibold'>{title || 'Titlu Postare'}</h3>
          <Badge variant={category === 'auction' ? 'destructive' : 'secondary'}>
            {category === 'sell' ? 'Vânzare' : category === 'buy' ? 'Cumpărare' : category === 'rent' ? 'Închiriere' : 'Licitație'}
          </Badge>
        </div>
        <p className='text-2xl font-bold text-green-600'>{price || '0'} {currency || 'EUR'}</p>
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

        <div className='prose prose-sm max-w-none wrap-break-word' dangerouslySetInnerHTML={{ __html: description || 'Descriere...' }} />

        <div className='space-y-2'>
          <p className='text-sm'><strong>Combustibil:</strong> {fuel || 'Nespecificat'}</p>
          <p className='text-sm'><strong>Kilometraj:</strong> {mileage || 0} km</p>
          <p className='text-sm'><strong>An Fabricație:</strong> {year || 'Nespecificat'}</p>
          <p className='text-sm'><strong>Caracteristici:</strong> {features || 'Nespecificate'}</p>
          {options && options.length > 0 && (
            <div className='text-sm'>
              <strong>Opțiuni Adiționale:</strong>
              <div className='flex flex-wrap gap-1 mt-1'>
                {options.map((opt, index) => (
                  <Badge key={index} variant='outline'>{opt}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className='text-xs text-muted-foreground'>Adăugat: {new Date().toLocaleDateString('ro-RO')}</p>
      </CardContent>
    </Card>
  );
}
