import Link from 'next/link';
import React from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
      <h2 className='text-2xl text-secondary font-bold mb-4 text-center sm:text-end w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        {title}
      </h2>
      <Carousel
        className='w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-full'
        autoplay={autoplay}
        autoplayInterval={interval}
        pauseOnHover={pauseOnHover}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className='py-4 px-2'>
          {items.map((category) => {
            const Icon = category.icon as React.ComponentType<{ className?: string }>;
            return (
              <CarouselItem key={category.id} className='basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'>
                <Card className='lift hover:shadow-lg transition-shadow duration-300 h-64 cursor-default'>
                  <CardContent className='flex flex-col items-center gap-2 px-2 sm:px-4 h-full'>
                    {Icon && <Icon className='w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0 mt-2 sm:mt-4' />}
                    <div className='flex flex-col flex-1 text-center'>
                      <h3 className='font-bold text-base sm:text-lg truncate'>{category.title}</h3>
                      <p className='text-xs sm:text-sm text-muted-foreground line-clamp-3'>{category.description}</p>
                    </div>
                    <Link href={category.href} className='cursor-default'>
                      <Button variant='outline' size='sm' className='mt-2 mb-2 sm:mb-4 hover:bg-primary hover:text-white transition-colors'>
                        Alege acum <ArrowRight className='ml-1 h-3 w-3 sm:h-4 sm:w-4' />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
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
