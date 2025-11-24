import { Star, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

type BadgesCarouselProps = {
  badges: string[];
  title?: string;
  className?: string;
};

export default function BadgesCarousel({ badges, title = 'Insignele Tale', className }: BadgesCarouselProps) {
  return (
    <Card className={cn('rounded-xl relative', className)}>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Trophy className='h-5 w-5 mr-2' /> {title}
        </CardTitle>
      </CardHeader>

      <CardContent className='p-4'>
        <TooltipProvider>
          <Carousel opts={{ align: 'start', slidesToScroll: 1 }} autoplay autoplayInterval={4000} pauseOnHover className='relative'>
            <CarouselPrevious variant='ghost' size='icon' className='bg-white/90 dark:bg-gray-800/90' />
            <CarouselNext variant='ghost' size='icon' className='bg-white/90 dark:bg-gray-800/90' />

            <CarouselContent containerClassName=''>
              {badges.map((b, i) => (
                <CarouselItem key={i} className='w-[90%] sm:basis-1/2 xl:basis-1/4 flex justify-center'>
                  <div className='w-full max-w-[220px] p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center space-y-2'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='flex items-center justify-center'>
                          <Star className='h-8 w-8 text-secondary' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side='top' className='max-w-xs text-center'>
                        <p className='text-sm font-semibold'>{b}</p>
                        <p className='text-xs text-muted-foreground'>Insignă câștigată pentru activități pe Tamago.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Badge variant='secondary' className='text-xs font-medium px-3 py-1 block truncate text-center max-w-full'>
                      {b}
                    </Badge>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
