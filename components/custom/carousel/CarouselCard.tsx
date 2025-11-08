import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type CarouselCardProps = {
  origIndex: number;
  isActive: boolean;
  categoryColors: Record<string, { text: string; icon: string; arrow: string }>;
  category: string;
  sub: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  onClick: () => void;
};

export function CarouselCard({ categoryColors, category, sub, onClick }: CarouselCardProps) {
  return (
    <Card className='aspect-square lift relative'>
      <CardContent className='flex flex-col relative h-full'>
        <div className='absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full'>
          <div
            className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
              categoryColors[category]?.icon ?? 'text-primary'
            }`}
          >
            <sub.icon />
          </div>
        </div>
        <div className='text-center flex-1 px-2 pt-8'>
          <h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight'>
            {sub.title}
          </h3>
          <p className='text-xs sm:text-sm text-muted-foreground mt-1 leading-snug line-clamp-2'>{sub.description}</p>
        </div>
        <div className='absolute bottom-4 right-4'>
          <Button
            variant='link'
            size='sm'
            className={`${categoryColors[category]?.text ?? 'text-primary'} hover:opacity-80 p-0`}
            onClick={onClick}
          >
            Explorează{' '}
            <ArrowRight className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 ${categoryColors[category]?.arrow ?? 'text-primary'}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
