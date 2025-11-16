'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Calendar, Gauge, Fuel, Settings, MapPin, Car as CarIcon, Palette, User, Star, Zap, Heart, Share } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { categoryLabels } from '@/lib/categories';
import type { Car } from '@/lib/types';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const href = `/categorii/auto/${car.category}/${car.id}${queryString ? '?' + queryString : ''}`;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Adăugat la favorite!');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href + href);
    toast.success('Link copiat!');
  };

  return (
    <Link key={car.id} href={href} className='cursor-default'>
      <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102 animate-in fade-in-0 slide-in-from-bottom-4'>
        <AspectRatio ratio={3} className='bg-muted'>
          <Image fill src={car.images[0]} alt={car.title} className='object-cover object-center rounded-t-lg' />
        </AspectRatio>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <CardTitle className='text-lg md:text-xl font-semibold line-clamp-2'>{car.title}</CardTitle>
              <p className='text-xl md:text-2xl font-bold text-green-600'>${car.price.toLocaleString('en-US')}</p>
            </div>
            <div className='flex items-center gap-1 ml-2'>
              <Button variant='ghost' size='sm' onClick={handleFavorite} className='h-8 w-8 p-0'>
                <Heart className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='sm' onClick={handleShare} className='h-8 w-8 p-0'>
                <Share className='h-4 w-4' />
              </Button>
              <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='flex-shrink-0'>
                {categoryLabels[car.category as keyof typeof categoryLabels]}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='bg-accent/50 p-3 rounded-lg mb-4'>
            <h4 className='text-sm font-semibold mb-2 flex items-center gap-1'>
              <Star className='h-4 w-4' />
              Highlights
            </h4>
            <div className='grid grid-cols-3 gap-2 text-xs'>
              <div className='text-center flex flex-col items-center gap-1'>
                <Calendar className='h-5 w-5 text-primary' />
                <p className='font-bold'>{car.year}</p>
                <p className='text-muted-foreground'>An</p>
              </div>
              <div className='text-center flex flex-col items-center gap-1'>
                <Gauge className='h-5 w-5 text-primary' />
                <p className='font-bold'>{car.mileage.toLocaleString('en-US')} km</p>
                <p className='text-muted-foreground'>Km</p>
              </div>
              <div className='text-center flex flex-col items-center gap-1'>
                <Zap className='h-5 w-5 text-primary' />
                <p className='font-bold'>{car.horsepower || 'N/A'} CP</p>
                <p className='text-muted-foreground'>Putere</p>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Fuel className='h-4 w-4 flex-shrink-0' />
              <span>Combustibil: {car.fuel}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Settings className='h-4 w-4 flex-shrink-0' />
              <span>Transmisie: {car.transmission}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <MapPin className='h-4 w-4 flex-shrink-0' />
              <span>Locație: {car.location}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <CarIcon className='h-4 w-4 flex-shrink-0' />
              <span>Caroserie: {car.bodyType}</span>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Palette className='h-4 w-4 flex-shrink-0' />
              <span>Culoare: {car.color}</span>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <User className='h-4 w-4 flex-shrink-0' />
              <span>Vânzător: {car.sellerType}</span>
            </div>
          </div>
          <p className='text-xs md:text-sm text-muted-foreground mt-4'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
