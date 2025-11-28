'use client';

import Image from 'next/image';
import { Fuel, Car, Palette, Zap, Gauge, Power, Cog, Axe, LoaderPinwheel, Calendar } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import  SafeHtml  from '@/components/custom/text/SafeHtml';
import CarHistoryHighlights from '@/components/custom/accordion/CarHistoryHighlights';
import type { PreviewData } from './CategoriesClient';

export default function Preview({
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
  model,
  color,
  engineCapacity,
  minEngineCapacity,
  maxEngineCapacity,
  carType,
  horsePower,
  transmission,
  traction,
  steeringWheelPosition,
  history,
}: PreviewData) {
  return (
    <Card className='shadow-md w-full'>
      <CardHeader className='flex items-center justify-between grow'>
        <CardTitle className='text-xl font-bold'>Previzualizare Anunț</CardTitle>
        <Badge variant={category === 'auction' ? 'destructive' : 'secondary'} className='self-start'>
          {category === 'sell' ? 'Ofertă' : category === 'buy' ? 'Cerere' : category === 'rent' ? 'Închiriere' : 'Licitație'}
        </Badge>
      </CardHeader>

      <CardContent className='space-y-4 overflow-auto' style={{ maxHeight: 'calc(100vh - 56px)' }}>
        <div className='flex flex-col md:flex-row gap-2'>
          <h3 className='min-w-0 text-lg font-semibold break-all overflow-wrap-break-word'>{title || 'Titlu Postare'}</h3>
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
        {category === 'sell' && status && <p className='text-sm text-muted-foreground'>Status: {status}</p>}
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
                    <video controls className='w-full h-64Z object-cover rounded'>
                      <source src={file} />
                    </video>
                  ) : (
                    <Image src={file} alt={`Media ${index + 1}`} width={300} height={200} className='w-full h-64 object-cover rounded' />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <SafeHtml html={description || 'Descriere...'} className='w-full text-sm text-muted-foreground' />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
          <div className='text-sm flex items-center gap-2'>
            <Fuel size={16} className='text-blue-500 shrink-0' />
            <span><strong>Combustibil:</strong> {fuel || 'Nespecificat'}</span>
          </div>
          <div className='text-sm flex items-center gap-2'>
            <Car size={16} className='text-purple-500 shrink-0' />
            <span><strong>Marca:</strong> {brand || 'Nespecificat'}</span>
          </div>

          {model && (
            <div className='text-sm flex items-center gap-2'>
              <Car size={16} className='text-purple-600 shrink-0' />
              <span><strong>Model:</strong> {model}</span>
            </div>
          )}

          <div className='text-sm flex items-center gap-2'>
            <Palette size={16} className='text-pink-500 shrink-0' />
            <span><strong>Culoare:</strong> {color || 'Nespecificat'}</span>
          </div>
          <div className='text-sm flex items-center gap-2'>
            <Zap size={16} className='text-yellow-500 shrink-0' />
            <span><strong>Capacitate Cilindrică:</strong>{' '}
            {category === 'buy'
              ? minEngineCapacity && maxEngineCapacity
                ? `${minEngineCapacity} - ${maxEngineCapacity} L`
                : minEngineCapacity
                  ? `De la ${minEngineCapacity} L`
                  : maxEngineCapacity
                    ? `Până la ${maxEngineCapacity} L`
                    : 'Nespecificat'
              : `${engineCapacity || 'Nespecificat'} L`}</span>
          </div>

          <div className='text-sm flex items-center gap-2'>
            <Gauge size={16} className='text-orange-500 shrink-0' />
            <span><strong>Tip Mașină:</strong> {carType || 'Nespecificat'}</span>
          </div>
          <div className='text-sm flex items-center gap-2'>
            <Power size={16} className='text-red-500 shrink-0' />
            <span><strong>Putere:</strong> {horsePower ? `${horsePower} CP` : 'Nespecificat'}</span>
          </div>

          <div className='text-sm flex items-center gap-2'>
            <Cog size={16} className='text-gray-500 shrink-0' />
            <span><strong>Transmisie:</strong> {transmission || 'Nespecificat'}</span>
          </div>
          <div className='text-sm flex items-center gap-2'>
            <Axe size={16} className='text-brown-500 shrink-0' />
            <span><strong>Tracțiune:</strong>{' '}
            {traction ? (traction === 'integrala' ? 'Integrala (4x4)' : traction === 'fata' ? 'Față' : 'Spate') : 'Nespecificat'}</span>
          </div>

          {steeringWheelPosition && (
            <div className='text-sm flex items-center gap-2'>
              <LoaderPinwheel size={16} className='text-indigo-500 shrink-0' />
              <span><strong>Volan:</strong> {steeringWheelPosition === 'left' ? 'Stânga' : 'Dreapta'}</span>
            </div>
          )}

          <div className='text-sm flex items-center gap-2 break-all overflow-wrap-break-word w-full min-w-0'>
            <Gauge size={16} className='text-green-500 shrink-0' />
            <span><strong>Kilometraj:</strong>{' '}
            {category === 'buy'
              ? minMileage && maxMileage
                ? `${minMileage} - ${maxMileage} km`
                : minMileage
                  ? `De la ${minMileage} km`
                  : maxMileage
                    ? `Până la ${maxMileage} km`
                    : 'Nespecificat'
              : `${mileage ?? 'Nespecificat'} km`}</span>
          </div>
          <div className='text-sm flex items-center gap-2 wrap-break-word overflow-wrap-break-word'>
            <Calendar size={16} className='text-teal-500 shrink-0' />
            <span><strong>An Fabricație:</strong>{' '}
            {category === 'buy'
              ? minYear && maxYear
                ? `${minYear} - ${maxYear}`
                : minYear
                  ? `Din ${minYear}`
                  : maxYear
                    ? `Până în ${maxYear}`
                    : 'Nespecificat'
              : year || 'Nespecificat'}</span>
          </div>
        </div>

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

        {history && history.length > 0 && <CarHistoryHighlights items={history} features={features ? features.split(',') : []} />}

        <p className='text-xs text-muted-foreground'>Adăugat: {new Date().toLocaleDateString('ro-RO')}</p>
      </CardContent>
    </Card>
  );
}
