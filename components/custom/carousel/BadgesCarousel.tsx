import React from 'react';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type BadgesCarouselProps = { badges: string[] };

export default function BadgesCarousel({ badges }: BadgesCarouselProps) {
  return (
    <div className='w-fit max-w-2xl mx-auto px-4 sm:px-8 lg:px-12'>
      <Carousel opts={{ loop: true, align: 'center' }} className='w-full'>
        <TooltipProvider>
          <CarouselContent className='flex gap-2 sm:gap-4 p-4'>
            {badges.map((b, i) => (
              <CarouselItem key={i} className='basis-auto'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='w-24 h-24 sm:w-32 sm:h-32 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:scale-105 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2'>
                      <Star className='h-10 w-10 sm:h-12 sm:w-12 text-secondary animate-pulse' />
                      <Badge variant='secondary' className='text-xs sm:text-sm font-medium px-3 py-1 block overflow-hidden text-ellipsis whitespace-nowrap max-w-full'>
                        {b}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{b}</p>
                  </TooltipContent>
                </Tooltip>
              </CarouselItem>
            ))}
          </CarouselContent>
        </TooltipProvider>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
