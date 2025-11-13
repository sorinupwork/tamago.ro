'use client';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

interface PreviewProps {
  title: string;
  description: string;
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  currency?: string;
  period?: string;
  startingBid?: string;
  location: string;
  category: string;
  uploadedFiles: string[];
  duration?: string;
  startDate?: string;
  endDate?: string;
  fuel: string;
  status?: string;
  mileage?: string;
  minMileage?: string;
  maxMileage?: string;
  year?: string;
  minYear?: string;
  maxYear?: string;
  features: string;
  options: string[];
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  brand?: string;
  color?: string;
  engineCapacity?: string;
  minEngineCapacity?: string;
  maxEngineCapacity?: string;
  carType?: string;
  horsePower?: string;
  transmission?: string;
  is4x4?: boolean;
}

export function Preview({
  title,
  description,
  price,
  minPrice,
  maxPrice,
  currency,
  period,
  startingBid,
  location,
  category,
  uploadedFiles,
  startDate,
  endDate,
  fuel,
  status,
  mileage,
  minMileage,
  maxMileage,
  year,
  minYear,
  maxYear,
  features,
  options,
  withDriver,
  driverName,
  driverContact,
  driverTelephone,
  brand,
  color,
  engineCapacity,
  minEngineCapacity,
  maxEngineCapacity,
  carType,
  horsePower,
  transmission,
  is4x4,
}: PreviewProps) {
  return (
    <Card className='animate-in fade-in-0 slide-in-from-right-4 shadow-md w-full'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Previzualizare Postare</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 overflow-auto'>
        <div className='flex flex-col md:flex-row gap-2'>
          <h3 className='min-w-0 text-lg font-semibold break-all overflow-wrap-break-word'>{title || 'Titlu Postare'}</h3>
          <Badge variant={category === 'auction' ? 'destructive' : 'secondary'} className='self-start'>
            {category === 'sell' ? 'Ofertă' : category === 'buy' ? 'Cerere' : category === 'rent' ? 'Închiriere' : 'Licitație'}
          </Badge>
        </div>
        <p className='text-2xl font-bold text-primary break-all overflow-wrap-break-word max-w-full'>
          {category === 'buy'
            ? minPrice && maxPrice
              ? `${minPrice} - ${maxPrice} ${currency || ''}`
              : minPrice
              ? `De la ${minPrice} ${currency || ''}`
              : maxPrice
              ? `Până la ${maxPrice} ${currency || ''}`
              : 'Buget nespecificat'
            : category === 'auction'
            ? `Licitație de start: ${startingBid} ${currency || ''}`
            : category === 'rent'
            ? `${price} ${currency || ''} pe ${
                period === 'day' ? 'zi' : period === 'week' ? 'săptămână' : period === 'month' ? 'lună' : 'zi'
              }`
            : `${price} ${currency || ''}`}
        </p>
        <p className='text-sm text-muted-foreground'>Locație: {location || 'Necunoscută'}</p>
        {category === 'rent' && status && <p className='text-sm text-muted-foreground'>Status: {status}</p>}
        {category === 'rent' && startDate && endDate && (
          <p className='text-sm text-muted-foreground'>
            Perioada: {startDate} - {endDate}
          </p>
        )}
        {category === 'auction' && status && <p className='text-sm text-muted-foreground'>Status: {status}</p>}
        {category === 'auction' && endDate && <p className='text-sm text-muted-foreground'>Data sfârșit: {endDate}</p>}

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

        <div
          className='prose prose-sm max-w-none w-full wrap-break-word overflow-wrap-break-word min-w-0'
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: description || 'Descriere...' }}
        />

        <div className='space-y-2'>
          <p className='text-sm'>
            <strong>Combustibil:</strong> {fuel || 'Nespecificat'}
          </p>
          <p className='text-sm'>
            <strong>Marca:</strong> {brand || 'Nespecificat'}
          </p>
          <p className='text-sm'>
            <strong>Culoare:</strong> {color || 'Nespecificat'}
          </p>
          <p className='text-sm'>
            <strong>Capacitate Cilindrică:</strong>{' '}
            {category === 'buy'
              ? minEngineCapacity && maxEngineCapacity
                ? `${minEngineCapacity} - ${maxEngineCapacity} L`
                : minEngineCapacity
                ? `De la ${minEngineCapacity} L`
                : maxEngineCapacity
                ? `Până la ${maxEngineCapacity} L`
                : 'Nespecificat'
              : `${engineCapacity} L`}
          </p>
          <p className='text-sm'>
            <strong>Tip Mașină:</strong> {carType || 'Nespecificat'}
          </p>
          <p className='text-sm'>
            <strong>Putere:</strong> {horsePower ? `${horsePower} CP` : 'Nespecificat'}
          </p>
          <p className='text-sm'>
            <strong>Transmisie:</strong> {transmission || 'Nespecificat'}
          </p>
          <p className='text-sm'>
            <strong>4x4:</strong> {is4x4 ? 'Da' : 'Nu'}
          </p>
          <p className='text-sm break-all overflow-wrap-break-word w-full min-w-0'>
            <strong>Kilometraj:</strong>{' '}
            {category === 'buy'
              ? minMileage && maxMileage
                ? `${minMileage} - ${maxMileage} km`
                : minMileage
                ? `De la ${minMileage} km`
                : maxMileage
                ? `Până la ${maxMileage} km`
                : 'Nespecificat'
              : `${mileage} km`}
          </p>
          <p className='text-sm wrap-break-word overflow-wrap-break-word'>
            <strong>An Fabricație:</strong>{' '}
            {category === 'buy'
              ? minYear && maxYear
                ? `${minYear} - ${maxYear}`
                : minYear
                ? `Din ${minYear}`
                : maxYear
                ? `Până în ${maxYear}`
                : 'Nespecificat'
              : year}
          </p>
          <div
            className='prose prose-sm max-w-none w-full wrap-break-word overflow-wrap-break-word break-all min-w-0'
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: `<strong>Caracteristici:</strong> ${features || 'Nespecificate'}` }}
          />
          {options && options.length > 0 && (
            <div className='text-sm'>
              <strong>Opțiuni Adiționale:</strong>
              <div className='flex flex-wrap gap-1 mt-1'>
                {options.map((opt, index) => (
                  <Badge key={index} variant='outline'>
                    {opt}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {withDriver && (
            <div className='text-sm mt-2'>
              <strong>Șofer Inclus:</strong>
              <p>Nume: {driverName || 'Nespecificat'}</p>
              <p>Contact: {driverContact || 'Nespecificat'}</p>
              <p>Telefon: {driverTelephone || 'Nespecificat'}</p>
            </div>
          )}
        </div>

        <p className='text-xs text-muted-foreground'>Adăugat: {new Date().toLocaleDateString('ro-RO')}</p>
      </CardContent>
    </Card>
  );
}
