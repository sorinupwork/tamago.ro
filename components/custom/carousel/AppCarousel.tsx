import Link from 'next/link';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type Category = {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type AppCarouselProps = {
  title: string;
  items: Category[];
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
};

export default function AppCarousel({ title, items, autoplay = true, interval = 3000, pauseOnHover = true }: AppCarouselProps) {
  return (
    <section className='py-8'>
      <h2 className='text-2xl font-bold text-end mb-4 text-secondary'>{title}</h2>
      <Carousel
        className='w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'
        autoplay={autoplay}
        autoplayInterval={interval}
        pauseOnHover={pauseOnHover}
      >
        <CarouselContent className='py-4 px-2'>
          {items.map((category) => {
            const Icon = category.icon as React.ComponentType<{ className?: string }>;
            return (
              <CarouselItem key={category.id} className='basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'>
                <Link href={category.href}>
                  <Card className='lift cursor-pointer'>
                    <CardContent className='flex items-center gap-2 px-2 sm:px-6'>
                      {Icon && <Icon className='w-12 h-12 text-primary shrink-0' />}
                      <div className='flex flex-col flex-1'>
                        <h3 className='font-bold text-lg truncate text-start'>{category.title}</h3>
                        <p className='text-sm text-muted-foreground line-clamp-2 text-start'>{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
