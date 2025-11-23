import React from 'react';
import { Star, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type BadgesCarouselProps = {
  badges: string[];
  title?: string;
  className?: string;
};

export default function BadgesCarousel({ badges, title = 'Insignele Tale', className }: BadgesCarouselProps) {
  return (
    <Card className={cn('rounded-xl', className)}>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Trophy className='h-5 w-5 mr-2' /> {title}
        </CardTitle>
      </CardHeader>

      <CardContent className='p-4'>
        <TooltipProvider>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-72 overflow-auto'>
            {badges.map((b, i) => (
              <div
                key={i}
                className='p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center space-y-2'
              >
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
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
