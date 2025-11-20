import { Camera } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';
import { StoryViewer } from './StoryViewer';

type StoriesSectionProps = {
  mockStories: User[];
  title?: string;
};

export const StoriesSection: React.FC<StoriesSectionProps> = ({ mockStories, title = 'Stories' }) => {
  const baseId = useId();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedStory, setSelectedStory] = useState<{ stories: User[]; index: number } | null>(null);

  const handleStoryClick = (index: number) => {
    setSelectedStory({ stories: mockStories, index });
  };

  return (
    <>
      <Card className='flex flex-col transition-all duration-300 hover:shadow-lg w-full max-w-full px-2'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Camera className='w-5 h-5' /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 min-w-0'>
          <ScrollArea
            ref={scrollAreaRef}
            className='w-full min-w-0 whitespace-nowrap'
            orientation='horizontal'
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
                const walk = (e.clientX - startX) * 2;
                viewport.scrollLeft = scrollLeft - walk;
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div className='flex space-x-4 p-4'>
              {mockStories.map((story, index) => (
                <div
                  key={`${baseId}-${index}`}
                  className='flex flex-col items-center gap-2 hover:scale-105 transition-transform shrink-0 cursor-default'
                  onClick={() => handleStoryClick(index)}
                >
                  <Avatar className='w-12 h-12 ring-2 ring-primary'>
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className='text-xs'>{story.name}</span>
                </div>
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CardContent>
      </Card>
      {selectedStory && (
        <StoryViewer
          stories={selectedStory.stories}
          initialIndex={selectedStory.index}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
};
