'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Calendar, Gauge, Fuel, Settings, MapPin, Car as CarIcon, Palette, User, Star, Zap, Heart, Share, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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

  // Dynamically set highlights as creative remarks/features based on category
  const getHighlights = () => {
    switch (car.category) {
      case 'auction':
        return [
          { icon: Star, value: 'Licitație Activă', label: 'Status' },
          { icon: Zap, value: `$${car.price}`, label: 'Bid Curent' }, // Removed toLocaleString to show raw string
          { icon: Calendar, value: 'În Desfășurare', label: 'Perioadă' },
        ];
      case 'rent':
        return [
          { icon: Star, value: 'Disponibil', label: 'Status' },
          { icon: Zap, value: `$${car.price}/zi`, label: 'Tarif' },
          { icon: Calendar, value: car.year, label: 'An' },
        ];
      default: // sell or buy
        return [
          { icon: Star, value: 'Stare Excelentă', label: 'Condiție' },
          { icon: Gauge, value: `${car.mileage.toLocaleString('en-US')} km`, label: 'Km' },
          { icon: Zap, value: `${car.horsepower || 'N/A'} CP`, label: 'Putere' },
        ];
    }
  };

  const highlights = getHighlights();

  // Dynamic button text based on category
  const getButtonText = () => {
    switch (car.category) {
      case 'auction':
        return 'Licitează Acum';
      case 'rent':
        return 'Închiriază Acum';
      default: // sell or buy
        return 'Cumpără Acum';
    }
  };

  const buttonText = getButtonText();

  return (
    <Link key={car.id} href={href} className='cursor-default'>
      <Card className='overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 border-2 border-transparent hover:border-primary/20'>
        <Carousel className='w-full'>
          <CarouselContent>
            {car.images.map((img, i) => (
              <CarouselItem key={i}>
                <div className='aspect-[5/1] bg-muted relative rounded-t-md'>
                  <Image fill src={img} alt={car.title} className='object-cover object-center rounded-t-md' />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='left-2' />
          <CarouselNext className='right-2' />
        </Carousel>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <CardTitle className='text-lg md:text-xl font-semibold line-clamp-2'>{car.title}</CardTitle>
              <p className='text-xl md:text-2xl font-bold text-green-600'>${car.price}</p> {/* Now displays raw string (e.g., "12.800") */}
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
              {highlights.map((h, i) => (
                <div key={i} className='text-center flex flex-col items-center gap-1'>
                  <h.icon className='h-5 w-5 text-primary' />
                  <p className='font-bold'>{h.value}</p>
                  <p className='text-muted-foreground'>{h.label}</p>
                </div>
              ))}
            </div>
          </div>
          {car.description && (
            <p className='text-sm text-muted-foreground mb-4 line-clamp-2'>{car.description}</p>
          )}
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
          <div className='flex justify-between items-center mt-4'>
            <p className='text-xs md:text-sm text-muted-foreground'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
            <Button variant='link' className='w-auto'>
              {buttonText} <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
