'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { ArrowRight, UserIcon, CheckCircle } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { categories } from '@/lib/categories';
import FavoriteButton from '../button/FavoriteButton';
import ShareButton from '../button/ShareButton';
import QuickActionButton from '../button/QuickActionButton';
import { getUserById } from '@/actions/auth/actions';
import type { Car } from '@/lib/types';
import CarHistoryHighlights from './CarHistoryHighlights';
import { CarDetailsAccordion } from './CarDetailsAccordion';

type CarCardProps = {
  car: Car;
  cardsPerPage?: number;
};

type User = {
  id: string;
  name?: string;
  avatar?: string;
  emailVerified?: boolean;
};

export default function CarCard({ car, cardsPerPage = 3 }: CarCardProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const categoryMap = {
    sell: 'vanzare',
    buy: 'cumparare',
    rent: 'inchiriere',
    auction: 'licitatie',
  };
  const urlCategory = categoryMap[car.category as keyof typeof categoryMap] || car.category;

  const href = `/categorii/auto/${urlCategory}/${car.id}${queryString ? '?' + queryString : ''}`;

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

  const getButtonText = () => {
    switch (car.category) {
      case 'auction':
        return 'Licitează Acum';
      case 'rent':
        return 'Închiriază Acum';
      case 'buy':
        return 'Oferă Acum';
      default:
        return 'Cumpără Acum';
    }
  };

  const buttonText = getButtonText();

  const sanitizedDescription = useMemo(() => sanitizeHtml(car.description || ''), [car.description]);
  const categoryLabel = categories.find((cat) => cat.key === car.category)?.label || car.category;

  const aspectClass = cardsPerPage === 1 ? 'aspect-4/1' : cardsPerPage === 2 ? 'aspect-4/2' : 'aspect-4/3';

  return (
    <Card className='overflow-hidden hover:shadow-md transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col pt-0'>
      <Carousel className='w-full'>
        <CarouselContent
          onPointerDown={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          {car.images.map((img, i) => (
            <CarouselItem key={i}>
              <div className={`${aspectClass} min-h-24 bg-muted relative rounded-t-md`}>
                <Image fill src={img} alt={car.title} className='object-cover object-center rounded-t-md' />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-2 h-10 w-10 rounded-full border-2 border-primary shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-black text-black dark:text-white' />
        <CarouselNext className='right-2 h-10 w-10 rounded-full border-2 border-primary shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-black text-black dark:text-white' />
      </Carousel>

      <CardHeader>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <CardTitle
              className='text-lg md:text-xl font-bold line-clamp-2 mb-2 leading-[1.2] overflow-hidden'
              style={{ minHeight: 'calc(2 * 1.2em)' }}
            >
              {car.title}
            </CardTitle>

            <div>
              <p className='text-xl md:text-2xl font-extrabold text-green-600 mb-2'>
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
          </div>

          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-1'>
              <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='shrink-0'>
                {categoryLabel}
              </Badge>
              <FavoriteButton itemId={car.id} itemTitle={car.title} itemImage={car.images[0] || ''} itemCategory={car.category} />
              <ShareButton href={href} />
              <QuickActionButton href={href} />
            </div>

            {user && (
              <div className='flex items-center gap-2'>
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
          </div>
        </div>
      </CardHeader>

      <CardDescription>
        {car.description && (
          <div
            className='text-sm text-muted-foreground bg-muted/50 pt-2 line-clamp-3 leading-[1.4] overflow-hidden px-6'
            style={{ minHeight: 'calc(3 * 1.2em)' }}
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        )}
      </CardDescription>

      <CardContent className='pt-0 flex-1 flex flex-col'>
        <CarHistoryHighlights car={car} features={car.features} items={car.history} />

        <CarDetailsAccordion car={car} />

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

        <div className='flex justify-between items-center mt-auto pt-4'>
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
