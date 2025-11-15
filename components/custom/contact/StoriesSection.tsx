import { Camera } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';

type StoriesSectionProps = {
  mockStories: User[];
};

export const StoriesSection: React.FC<StoriesSectionProps> = ({ mockStories }) => {
  const baseId = useId();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  return (
    <Card className='flex flex-col transition-all duration-300 hover:shadow-lg'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Camera className='w-5 h-5' /> Stories
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-1 min-w-0'>
        <ScrollArea
          ref={scrollAreaRef}
          className='w-full min-w-0 whitespace-nowrap'
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => {
            setIsDragging(true);
            setStartX(e.clientX);
            const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
            if (viewport) setScrollLeft(viewport.scrollLeft);
          }}
          onMouseMove={(e) => {
            if (!isDragging) return;
            e.preventDefault();
            const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
            if (viewport) {
              const walk = (e.clientX - startX) * 2; // Adjust speed multiplier as needed
              viewport.scrollLeft = scrollLeft - walk;
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div className='inline-flex min-w-max space-x-4 p-4'>
            {mockStories.map((story, index) => (
              <HoverCard key={`${baseId}-${index}`}>
                <HoverCardTrigger asChild>
                  <div className='flex flex-col items-center gap-2 hover:scale-105 transition-transform shrink-0'>
                    <Avatar className='w-12 h-12 ring-2 ring-primary'>
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className='text-xs'>{story.name}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className='w-80'>
                  <div className='flex justify-between gap-4'>
                    <Avatar>
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>{story.name}</h4>
                      <p className='text-sm'>{story.status}</p>
                      <div className='text-muted-foreground text-xs'>Categoria: {story.category}</div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
