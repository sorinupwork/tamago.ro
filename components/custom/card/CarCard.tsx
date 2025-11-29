'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import FavoriteButton from '../button/FavoriteButton';
import ShareButton from '../button/ShareButton';
import QuickActionButton from '../button/QuickActionButton';
import CarDetailsAccordion from '../accordion/CarDetailsAccordion';
import UserProfileCard from './UserProfileCard';
import { getUserById } from '@/actions/auth/actions';
import { categories, reverseCategoryMapping } from '@/lib/categories';
import type { Car, User } from '@/lib/types';
import SafeHtml from '../text/SafeHtml';

type CarCardProps = {
  car: Car;
  cardsPerPage?: number;
  watchDrag?: boolean;
};

export default function CarCard({ car, cardsPerPage = 3, watchDrag = true }: CarCardProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const urlCategory = reverseCategoryMapping[car.category as keyof typeof reverseCategoryMapping] || car.category;
  const href = `/categorii/auto/${urlCategory}/${car.id}${queryString ? '?' + queryString : ''}`;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (car.userId) {
      getUserById(car.userId).then((fetchedUser) => {
        setUser(
          fetchedUser
            ? {
                ...fetchedUser,
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
  const categoryLabel = categories.find((cat) => cat.key === car.category)?.label || car.category;
  const aspectClass = cardsPerPage === 1 ? 'aspect-4/1' : cardsPerPage === 2 ? 'aspect-4/2' : 'aspect-4/3';

  return (
    <Card className='overflow-hidden hover:shadow-md transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col pt-0'>
      <Carousel
        className='w-full'
        opts={{
          watchDrag: watchDrag,
        }}
      >
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
        <div className='flex justify-between items-start gap-3'>
          <div className='flex flex-col flex-1 items-start gap-1.5'>
            <h3 className='text-lg md:text-xl font-bold line-clamp-2 mb-1 text-foreground'>{car.title}</h3>

            <p className='text-xl md:text-2xl font-extrabold text-primary mb-2'>
              {car.currency}{' '}
              {car.category === 'buy'
                ? `${car.minPrice} - ${car.maxPrice}`
                : car.category === 'rent'
                  ? `${car.price}/${car.period || 'zi'}`
                  : car.price}
            </p>

            <div className='flex items-center gap-2'>
              <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='shrink-0 text-xs'>
                {categoryLabel}
              </Badge>

              {user && <UserProfileCard user={user} size='sm' />}
            </div>
          </div>

          <div className='flex flex-col items-center gap-1.5'>
            <FavoriteButton itemId={car.id} itemTitle={car.title} itemImage={car.images[0] || ''} itemCategory={car.category} />

            <ShareButton href={href} />

            <QuickActionButton href={href} />
          </div>
        </div>
      </CardHeader>

      {car.description && (
        <CardDescription>
          <SafeHtml html={car.description} className='text-sm text-muted-foreground bg-muted/50 px-6 py-2 line-clamp-4' />
        </CardDescription>
      )}

      <CardContent className='pt-4 flex-1 flex flex-col'>
        <CarDetailsAccordion car={car} />

        {car.options && car.options.length > 0 && (
          <div className='my-2'>
            <h5 className='text-sm font-semibold mb-2'>Opțiuni:</h5>
            <div className='flex flex-wrap gap-2'>
              {car.options.map((option, i) => (
                <Badge key={i} variant='outline' className='text-xs truncate'>
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className='flex justify-between items-center mt-auto pt-2 border-t'>
          <p className='text-xs text-muted-foreground'>Adăugat: {new Date(car.createdAt).toLocaleDateString('ro-RO')}</p>
          <Link href={href}>
            <Button variant='ghost' size='sm' className='h-auto py-1 px-2 text-xs md:text-sm gap-1'>
              {buttonText}
              <ArrowRight className='h-3 w-3 md:h-4 md:w-4' />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    Alb: '#ffffff',
    Negru: '#000000',
    Gri: '#808080',
    Albastru: '#0000ff',
    Rosu: '#ff0000',
    Verde: '#008000',
    Galben: '#ffff00',
    Portocaliu: '#ffa500',
    Violet: '#800080',
    Maro: '#a52a2a',
    Argintiu: '#c0c0c0',
    Auriu: '#ffd700',
    Alta: '#d3d3d3',
  };
  return colorMap[colorName] || '#d3d3d3';
}
