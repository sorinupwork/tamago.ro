'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FavoriteButton from '../button/FavoriteButton';
import ShareButton from '../button/ShareButton';
import QuickActionButton from '../button/QuickActionButton';
import CarDetailsAccordion from '../accordion/CarDetailsAccordion';
import { getUserById } from '@/actions/auth/actions';
import { categories, reverseCategoryMapping } from '@/lib/categories';
import type { Car, User } from '@/lib/types';

type CarCardProps = {
  car: Car;
  cardsPerPage?: number;
};

export default function CarCard({ car, cardsPerPage = 3 }: CarCardProps) {
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
                id: fetchedUser._id.toString(),
                email: fetchedUser.email,
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

      <CardHeader className='pb-3'>
        {/* Main Content: Title and Price on Left, Icons and Badge on Right */}
        <div className='flex justify-between items-start gap-3'>
          {/* Left Section: Title and Price - Main Focus */}
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg md:text-xl font-bold line-clamp-2 mb-2 text-foreground'>{car.title}</h3>

            <p className='text-xl md:text-2xl font-extrabold text-primary mb-2'>
              {car.currency}{' '}
              {car.category === 'buy'
                ? `${car.minPrice} - ${car.maxPrice}`
                : car.category === 'rent'
                  ? `${car.price}/${car.period || 'zi'}`
                  : car.price}
            </p>

            {/* Right Section: Badge, Seller Icon, and Action Icons - Vertical Stack */}
            <div className='flex items-center gap-2'>
              {/* Category Badge - Top */}
              <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='shrink-0 text-xs'>
                {categoryLabel}
              </Badge>

              {/* Seller Info - Only Avatar Icon with Hover Card */}
              {user && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className='flex items-center p-1.5 rounded-md hover:bg-muted transition-colors'>
                      <div className='relative'>
                        <Image
                          src={user.avatar || '/placeholder-avatar.png'}
                          alt={user.name || 'Seller'}
                          width={28}
                          height={28}
                          className='rounded-full'
                        />
                        {user.emailVerified && (
                          <CheckCircle2 className='absolute -bottom-0.5 -right-0.5 h-3 w-3 text-green-500 bg-white dark:bg-slate-950 rounded-full' />
                        )}
                      </div>
                    </button>
                  </HoverCardTrigger>

                  <HoverCardContent side='left' className='w-72'>
                    <div className='space-y-3'>
                      {/* Header with Avatar and Name */}
                      <div className='flex items-start gap-3'>
                        <div className='relative'>
                          <Image
                            src={user.avatar || '/placeholder-avatar.png'}
                            alt={user.name || 'Seller'}
                            width={48}
                            height={48}
                            className='rounded-full'
                          />
                          {user.emailVerified && (
                            <div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5'>
                              <CheckCircle2 className='h-4 w-4 text-white' />
                            </div>
                          )}
                        </div>
                        <div className='flex-1'>
                          <p className='font-semibold'>{user.name || 'Utilizator'}</p>
                          <p className='text-sm text-muted-foreground'>{user.email}</p>
                        </div>
                      </div>

                      {/* Verification Status */}
                      {user.emailVerified && (
                        <div className='flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded'>
                          <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                          <span className='text-sm font-medium text-green-700 dark:text-green-300'>Vânzător Verificat</span>
                        </div>
                      )}

                      {/* View Profile Link */}
                      <Link
                        href={`/profile/${user.id}`}
                        className='text-sm text-primary hover:underline flex items-center gap-1.5 pt-2 border-t'
                      >
                        Vezi profilul
                        <ExternalLink className='h-3 w-3' />
                      </Link>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>

          <div className='flex flex-col items-center gap-1.5'>
            <FavoriteButton itemId={car.id} itemTitle={car.title} itemImage={car.images[0] || ''} itemCategory={car.category} />

            <ShareButton href={href} />

            <QuickActionButton href={href} />
          </div>
        </div>
      </CardHeader>

      <CardDescription>
        {car.description && (
          <div
            className='text-sm text-muted-foreground bg-muted/50 px-6 py-2 line-clamp-4'
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        )}
      </CardDescription>

      <CardContent className='pt-4 flex-1 flex flex-col'>
        {/* Additional Info Badges - Only for non-spec items */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {car.color && (
            <Badge variant='outline' className='text-xs truncate'>
              <span
                className='inline-block w-2 h-2 rounded-full mr-1.5 shrink-0'
                style={{ backgroundColor: getColorValue(car.color) }}
              ></span>
              <span className='truncate'>{car.color}</span>
            </Badge>
          )}
          {car.traction && (
            <Badge variant='outline' className='text-xs truncate'>
              {car.traction}
            </Badge>
          )}
          {car.steeringWheelPosition && (
            <Badge variant='outline' className='text-xs truncate'>
              {car.steeringWheelPosition === 'left' ? 'Stânga' : 'Dreapta'}
            </Badge>
          )}
        </div>

        {/* All Details in One Accordion - No Duplication */}
        <CarDetailsAccordion car={car} />

        {/* Options Section - Only if present and not duplicated in accordion */}
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
