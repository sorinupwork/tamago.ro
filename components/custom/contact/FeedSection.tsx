import Image from 'next/image';
import { Heart, Share } from 'lucide-react';
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FeedPost } from '@/lib/types';

type FeedSectionProps = {
  mockPosts: FeedPost[];
};

export const FeedSection: React.FC<FeedSectionProps> = ({ mockPosts }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className='flex-1 min-w-0 min-h-0'
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={(e) => {
        setIsDragging(true);
        setStartY(e.clientY);
        const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
        if (viewport) setScrollTop(viewport.scrollTop);
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        e.preventDefault();
        const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
        if (viewport) {
          const walk = (e.clientY - startY) * 2; // Adjust speed multiplier as needed
          viewport.scrollTop = scrollTop - walk;
        }
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className='space-y-2 pr-4'>
        {mockPosts.map((post) => (
          <Card key={post.id} className='transition-all duration-300 hover:shadow-lg'>
            <CardHeader className='flex flex-row items-center gap-2'>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className='w-80'>
                  <div className='flex justify-between gap-4'>
                    <Avatar>
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>{post.user.name}</h4>
                      <p className='text-sm'>{post.user.status}</p>
                      <div className='text-muted-foreground text-xs'>Categoria: {post.user.category}</div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <span className='font-semibold'>{post.user.name}</span>
            </CardHeader>
            <CardContent>
              <p>{post.text}</p>
              {post.image && (
                <div className='relative w-full h-48 mt-2 rounded'>
                  <Image src={post.image} alt='Post' fill className='object-cover rounded' />
                </div>
              )}
              <ButtonGroup className='mt-2'>
                <Button variant='ghost' size='sm'>
                  <Heart className='w-4 h-4' /> {post.likes}
                </Button>
                <Button variant='ghost' size='sm'>
                  <Share className='w-4 h-4' />
                </Button>
              </ButtonGroup>
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};
