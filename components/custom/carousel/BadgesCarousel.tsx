import React from 'react';
import { Star, Trophy } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BadgesCarouselProps = {
  badges: string[];
  title?: string;
};

export default function BadgesCarousel({ badges, title = 'Insignele Tale' }: BadgesCarouselProps) {
  return (
    <Card className='rounded-xl'>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Trophy className='h-5 w-5 mr-2' /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        <div className='flex gap-4'>
          <Carousel opts={{ loop: true, align: 'center' }} orientation='vertical' className='w-full overflow-visible'>
            <TooltipProvider>
              <CarouselContent className='-mt-1 h-[200px]'>
                {badges.map((b, i) => (
                  <CarouselItem key={i} className='pt-1 basis-1/3 px-2'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='w-full h-24 sm:h-32 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2'>
                          <Star className='h-10 w-10 sm:h-12 sm:w-12 text-secondary animate-pulse' />
                          <Badge
                            variant='secondary'
                            className='text-xs sm:text-sm font-medium px-3 py-1 block overflow-hidden text-ellipsis whitespace-nowrap max-w-full'
                          >
                            {b}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side='top' className='max-w-xs text-center'>
                        <p className='text-sm font-semibold'>{b}</p>
                        <p className='text-xs text-muted-foreground'>Insignă câștigată pentru activități pe Tamago.</p>
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
      </CardContent>
    </Card>
  );
}
