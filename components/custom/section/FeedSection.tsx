import Image from 'next/image';
import { Heart, Share, ChevronUp, MessageSquare, MoreVertical, MapPin, Star } from 'lucide-react';
import React, { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FeedPost } from '@/lib/types';
import { AppInput } from '../input/AppInput';
// add dialog for mobile profile view
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
// NEW: use centralized hook for mobile detection
import { useIsMobile } from '@/hooks/use-mobile';

type FeedSectionProps = {
  mockPosts: FeedPost[];
};

export const FeedSection: React.FC<FeedSectionProps> = ({ mockPosts }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [comments, setComments] = useState<{ [key: number]: { id: number; text: string; user: string }[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});

  // Use shared hook (handles SSR-safe detection and window.matchMedia)
  const isTouchDevice = useIsMobile();

  const [activeProfile, setActiveProfile] = useState<FeedPost['user'] | null>(null);

  const checkScrollPosition = useCallback(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (viewport) {
      const { scrollTop: currentScrollTop } = viewport;
      const opacity = currentScrollTop > 0 ? 1 : 0;
      setButtonOpacity(opacity);
    }
  }, []);

  const scrollToTop = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loadMore = () => {
    toast.info('Loading more posts...');
  };

  const toggleComments = (postId: number) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const addComment = (postId: number) => {
    if (newComment[postId]?.trim()) {
      const comment = { id: Date.now(), text: newComment[postId], user: 'You' };
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <Card className='flex flex-col min-h-0 p-4 h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' /> Feed
        </CardTitle>
      </CardHeader>
      <ScrollArea
        ref={scrollAreaRef}
        className='flex-1 overflow-y-auto relative'
        orientation='vertical'
        onScrollViewport={checkScrollPosition}
      >
        <div className='space-y-4 pb-6 px-2'>
          {mockPosts.map((post) => (
            <Card key={post.id} className='transition-all duration-300 hover:shadow-lg'>
              <CardHeader className='flex flex-row items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  {/* Desktop: HoverCard, Mobile: open dialog on click */}
                  {!isTouchDevice ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Avatar className='cursor-default'>
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className='w-80 max-w-xs'>
                        <div className='flex flex-col gap-3'>
                          <div className='flex items-start gap-3'>
                            <Avatar>
                              <AvatarImage src={post.user.avatar} />
                              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <h4 className='text-sm font-semibold'>{post.user.name}</h4>
                              <p className='text-sm text-muted-foreground truncate'>{post.user.status}</p>
                              <div className='mt-2 flex flex-wrap gap-2'>
                                {/* category badge */}
                                <span className='text-xs bg-muted px-2 py-1 rounded-full'>{post.user.category}</span>
                                {/* example extra badge */}
                                <span className='text-xs bg-accent/10 text-accent px-2 py-1 rounded-full flex items-center gap-1'>
                                  <Star className='w-3 h-3' /> Top Seller
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* compact stats / progress */}
                          <div className='flex items-center justify-between gap-3'>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between text-xs mb-1'>
                                <span className='text-muted-foreground'>Profile</span>
                                <span className='font-medium'>78%</span>
                              </div>
                              <div className='w-full bg-muted/20 h-2 rounded overflow-hidden'>
                                <div className='h-2 bg-primary' style={{ width: '78%' }} />
                              </div>
                            </div>
                            <div className='flex flex-col items-end text-xs text-muted-foreground'>
                              <span className='flex items-center gap-1'><MapPin className='w-3 h-3' /> Nearby</span>
                              <span>5km</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <Avatar
                      className='cursor-default'
                      onClick={() => {
                        setActiveProfile(post.user);
                      }}
                    >
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                   <span className='font-semibold'>{post.user.name}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => toast.info('Shared!')}>
                      <Share className='w-4 h-4 mr-2' /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Reported!')}>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p>{post.text}</p>
                {post.image && (
                  <div className='relative w-full h-96 mt-2 rounded'>
                    <Image src={post.image} alt='Post' fill className='object-cover rounded' />
                  </div>
                )}
                <ButtonGroup className='mt-2'>
                  <Button variant='ghost' size='sm'>
                    <Heart className='w-4 h-4' /> {post.likes}
                  </Button>
                  <Button variant='ghost' size='sm' onClick={() => toggleComments(post.id)}>
                    <MessageSquare className='w-4 h-4' /> Comments
                  </Button>
                  <Button variant='ghost' size='sm'>
                    <Share className='w-4 h-4' />
                  </Button>
                </ButtonGroup>
                {showComments[post.id] && (
                  <div className='mt-4 space-y-2'>
                    {(comments[post.id] || []).map((comment) => (
                      <div key={comment.id} className='flex gap-2'>
                        <Avatar className='w-6 h-6'>
                          <AvatarFallback>{comment.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className='font-semibold'>{comment.user}</span>: {comment.text}
                        </div>
                      </div>
                    ))}
                    <div className='flex gap-2'>
                      <AppInput
                        placeholder='Add a comment...'
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                        className='flex-1'
                      />
                      <Button onClick={() => addComment(post.id)} size='sm'>
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className='flex justify-center mt-4'>
            <Button
              onClick={loadMore}
              variant='outline'
              size='lg'
              className='rounded-full shadow-lg bg-background hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95'
            >
              Load More
            </Button>
          </div>
        </div>
        <div className='absolute bottom-6 left-4 transition-opacity duration-300' style={{ opacity: buttonOpacity }}>
          <Button
            onClick={scrollToTop}
            variant='outline'
            size='lg'
            className='rounded-full shadow-lg bg-background hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95'
          >
            <ChevronUp className='w-5 h-5' />
          </Button>
        </div>
        <ScrollBar />
      </ScrollArea>

      {/* Mobile dialog that mirrors the hover card content when avatar is tapped */}
      <Dialog open={!!activeProfile} onOpenChange={() => setActiveProfile(null)}>
        <DialogContent className='max-w-sm w-full'>
          <DialogTitle>{activeProfile?.name}</DialogTitle>
          {activeProfile && (
            <div className='flex flex-col gap-3'>
              <div className='flex items-start gap-3'>
                <Avatar>
                  <AvatarImage src={activeProfile.avatar} />
                  <AvatarFallback>{activeProfile.name[0]}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h4 className='text-sm font-semibold'>{activeProfile.name}</h4>
                  <p className='text-sm text-muted-foreground truncate'>{activeProfile.status}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    <span className='text-xs bg-muted px-2 py-1 rounded-full'>{activeProfile.category}</span>
                    <span className='text-xs bg-accent/10 text-accent px-2 py-1 rounded-full flex items-center gap-1'>
                      <Star className='w-3 h-3' /> Top Seller
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center justify-between text-xs mb-1'>
                    <span className='text-muted-foreground'>Profile</span>
                    <span className='font-medium'>78%</span>
                  </div>
                  <div className='w-full bg-muted/20 h-2 rounded overflow-hidden'>
                    <div className='h-2 bg-primary' style={{ width: '78%' }} />
                  </div>
                </div>
                <div className='flex flex-col items-end text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'><MapPin className='w-3 h-3' /> Nearby</span>
                  <span>5km</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
