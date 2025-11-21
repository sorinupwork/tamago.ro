'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Car as CarIcon,
  Palette,
  Star,
  Zap,
  ArrowRight,
  UserIcon,
  CheckCircle,
  UserCog,
} from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { categoryLabels } from '@/lib/categories';
import FavoriteButton from '../button/FavoriteButton';
import ShareButton from '../button/ShareButton';
import QuickActionButton from '../button/QuickActionButton';
import { getUserById } from '@/actions/auth/actions';
import type { Car } from '@/lib/types';

type CarCardProps = {
  car: Car;
};

type User = {
  id: string;
  name?: string;
  avatar?: string;
  emailVerified?: boolean;
};

export function CarCard({ car }: CarCardProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  // Map category to Romanian URL
  const categoryMap = {
    sell: 'vanzare',
    buy: 'cumparare',
    rent: 'inchiriere',
    auction: 'licitatie',
  };
  const urlCategory = categoryMap[car.category as keyof typeof categoryMap] || car.category;

  const href = `/categorii/auto/${urlCategory}/${car.id}${queryString ? '?' + queryString : ''}`;

  // Fetch user data
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (car.userId) {
      getUserById(car.userId).then((fetchedUser) => {
        setUser(
          fetchedUser
            ? {
                id: fetchedUser._id.toString(),
                name: fetchedUser.name,
                avatar: fetchedUser.image,
                emailVerified: fetchedUser.emailVerified,
              }
            : null
        );
      });
    }
  }, [car.userId]);

  // Dynamically set highlights as creative remarks/features based on category
  const getHighlights = () => {
    switch (car.category) {
      case 'auction':
        return [
          { icon: Star, value: 'Licitație Activă', label: 'Status' },
          { icon: Zap, value: `${car.price} ${car.currency}`, label: 'Bid Curent' },
          { icon: Calendar, value: 'În Desfășurare', label: 'Perioadă' },
        ];
      case 'rent':
        return [
          { icon: Star, value: 'Disponibil', label: 'Status' },
          { icon: Zap, value: `${car.price} ${car.currency}/${car.period || 'zi'}`, label: 'Tarif' },
          { icon: Calendar, value: car.year, label: 'An' },
        ];
      case 'buy':
        return [
          { icon: Star, value: 'Cerere Activă', label: 'Status' },
          {
            icon: Zap,
            value: car.minPrice && car.maxPrice ? `${car.minPrice} - ${car.maxPrice} ${car.currency}` : `${car.price} ${car.currency}`,
            label: 'Buget',
          },
          { icon: Calendar, value: car.year, label: 'An' },
        ];
      default: // sell
        return [
          { icon: Star, value: 'Stare Excelentă', label: 'Condiție' },
          { icon: Gauge, value: `${car.mileage} km`, label: 'Km' },
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
      case 'buy':
        return 'Oferă Acum';
      default: // sell
        return 'Cumpără Acum';
    }
  };

  const buttonText = getButtonText();

  const sanitizedDescription = useMemo(() => sanitizeHtml(car.description || ''), [car.description]);

  return (
    <Card className='overflow-hidden hover:shadow-md transition-all duration-300  animate-in fade-in-0 slide-in-from-bottom-4 border-2 border-transparent hover:border-primary/20'>
      <Carousel className='w-full'>
        <CarouselContent>
          {car.images.map((img, i) => (
            <CarouselItem key={i}>
              <div className='aspect-[5/1] bg-muted relative rounded-t-md'>
                <Image fill src={img} alt={car.title} className='object-cover object-center rounded-t-md ' />
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
            <p className='text-xl md:text-2xl font-bold text-green-600'>
              {car.currency}{' '}
              {car.category === 'buy'
                ? car.minPrice && car.maxPrice
                  ? `${car.minPrice} - ${car.maxPrice}`
                  : car.price
                : car.category === 'rent'
                  ? `${car.price}/${car.period || 'zi'}`
                  : car.price}
            </p>
          </div>
          <div className='flex items-center gap-1 ml-2'>
            <FavoriteButton itemId={car.id} />
            <ShareButton href={href} />
            <QuickActionButton href={href} />
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
          <div className='text-sm text-muted-foreground mb-4' dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
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
            <UserCog className='h-4 w-4 flex-shrink-0' />
            <span>Vânzător: {car.sellerType}</span>
          </div>
          {car.brand && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <CarIcon className='h-4 w-4 flex-shrink-0' />
              <span>Brand: {car.brand}</span>
            </div>
          )}
          {car.year && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Calendar className='h-4 w-4 flex-shrink-0' />
              <span>An: {car.year}</span>
            </div>
          )}
          {car.mileage && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Gauge className='h-4 w-4 flex-shrink-0' />
              <span>Km: {car.mileage}</span>
            </div>
          )}
          {car.engineCapacity && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Settings className='h-4 w-4 flex-shrink-0' />
              <span>Capacitate Motor: {car.engineCapacity} cc</span>
            </div>
          )}
          {car.horsepower && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Zap className='h-4 w-4 flex-shrink-0' />
              <span>Putere: {car.horsepower} CP</span>
            </div>
          )}
          {car.is4x4 && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <CarIcon className='h-4 w-4 flex-shrink-0' />
              <span>4x4: Da</span>
            </div>
          )}
        </div>
        {car.features && (
          <div className='mt-4'>
            <h5 className='text-sm font-semibold mb-2'>Caracteristici:</h5>
            <p className='text-sm text-muted-foreground'>{car.features}</p>
          </div>
        )}
        {car.options && car.options.length > 0 && (
          <div className='mt-4'>
            <h5 className='text-sm font-semibold mb-2'>Opțiuni:</h5>
            <div className='flex flex-wrap gap-2'>
              {car.options.map((option, i) => (
                <Badge key={i} variant='outline'>
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {user && (
          <div className='mt-4 flex items-center gap-2'>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link href={`/profile/${user.id}`} className='flex items-center gap-2 text-sm text-primary hover:underline'>
                  <UserIcon className='h-4 w-4' />
                  {user.name || 'Utilizator'}
                  {user.emailVerified && <CheckCircle className='h-4 w-4 text-green-500' />}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className='w-80'>
                <div className='flex items-center gap-3'>
                  <Image
                    src={user.avatar || '/placeholder-avatar.png'}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div>
                    <p className='font-semibold'>{user.name || 'Utilizator'}</p>
                    <p className='text-sm text-muted-foreground'>Vezi profilul</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            {user.emailVerified && (
              <Badge variant='secondary' className='text-xs'>
                Vânzător Verificat
              </Badge>
            )}
          </div>
        )}
        <div className='flex justify-between items-center mt-4'>
          <p className='text-xs md:text-sm text-muted-foreground'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
          <Link key={car.id} href={href} className='cursor-default'>
            <Button variant='link' className='w-auto'>
              {buttonText} <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
