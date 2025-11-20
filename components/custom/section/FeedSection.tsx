import Image from 'next/image';
import { Heart, Share, ChevronUp, MessageSquare, MoreVertical, MapPin, Star } from 'lucide-react';
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth/auth-client'; // CHANGED: Use Better Auth instead of NextAuth
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // NEW: Import for tooltip

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FeedPost, User, FeedItem } from '@/lib/types';
import { AppInput } from '../input/AppInput';
// add dialog for mobile profile view
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
// NEW: use centralized hook for mobile detection
import { useIsMobile } from '@/hooks/use-mobile';
// NEW: Add select for filtering
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// NEW: Add SkeletonLoading
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { Progress } from '@/components/ui/progress'; // NEW: Import for progress bars

type FeedSectionProps = {
  feedItems: FeedItem[];
  // REMOVED: isLoggedIn prop, now using session
};

export const FeedSection: React.FC<FeedSectionProps> = ({ feedItems }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [comments, setComments] = useState<{ [key: string]: { id: number; text: string; user: string }[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  // NEW: State for poll votes (array of counts per option)
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set()); // NEW: Track voted polls

  // Use shared hook (handles SSR-safe detection and window.matchMedia)
  const isTouchDevice = useIsMobile();

  const [activeProfile, setActiveProfile] = useState<FeedPost['user'] | null>(null);

  // NEW: State for filter
  const [filterType, setFilterType] = useState<'all' | 'post' | 'poll'>('all');

  const { data: session } = useSession(); // NEW: Get session data
  const isLoggedIn = !!session?.user; // NEW: Derive logged-in status from session

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

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const addComment = (postId: string) => {
    if (newComment[postId]?.trim()) {
      const comment = { id: Date.now(), text: newComment[postId], user: 'You' };
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  // NEW: Initialize poll votes from feedItems if available
  const initialVotes = useMemo(() => {
    const votes: { [key: string]: number[] } = {};
    feedItems.forEach((item) => {
      if (item.type === 'poll') {
        votes[item._id] = item.options?.map(() => 0) || [];
      }
    });
    return votes;
  }, [feedItems]);

  const [pollVotes, setPollVotes] = useState<{ [key: string]: number[] }>(initialVotes);

  // NEW: Function to handle voting (updated to use isLoggedIn)
  const voteOnPoll = (postId: string, optionIndex: number) => {
    if (!isLoggedIn || votedPolls.has(postId)) return;
    setPollVotes((prev) => {
      const current = prev[postId];
      if (!current) {
        const item = feedItems.find((i) => i._id === postId);
        if (!item || item.type !== 'poll') return prev;
        const newVotes = item.options?.map(() => 0) || [];
        return {
          ...prev,
          [postId]: newVotes.map((count, idx) => (idx === optionIndex ? count + 1 : count)),
        };
      }
      return {
        ...prev,
        [postId]: current.map((count, idx) => (idx === optionIndex ? count + 1 : count)),
      };
    });
    setVotedPolls((prev) => new Set(prev).add(postId));
  };

  // NEW: Filter feedItems based on filterType
  const filteredItems = feedItems.filter((item) => filterType === 'all' || item.type === filterType);

  return (
    <Card className='flex flex-col min-h-0 p-4 h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' /> Feed
          {/* NEW: Add filter select */}
          <Select value={filterType} onValueChange={(value: 'all' | 'post' | 'poll') => setFilterType(value)}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='post'>Posts</SelectItem>
              <SelectItem value='poll'>Polls</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <ScrollArea
        ref={scrollAreaRef}
        className='flex-1 overflow-y-auto relative'
        orientation='vertical'
        onScrollViewport={checkScrollPosition}
      >
        <div className='space-y-4 pb-6 px-2 min-h-[400px]'>
          {' '}
          {/* NEW: Add min-height to prevent layout shift */}
          {filteredItems.length > 0 ? ( // NEW: Conditional rendering for items
            filteredItems.map(
              (
                item // CHANGED: Use filteredItems
              ) => (
                <Card key={item._id} className='transition-all duration-300 hover:shadow-lg'>
                  {' '}
                  {/* CHANGED: Use item._id */}
                  <CardHeader className='flex flex-row items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      {/* Desktop: HoverCard, Mobile: open dialog on click */}
                      {!isTouchDevice ? (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Avatar className='cursor-default'>
                              <AvatarImage src={item.user?.avatar || '/avatars/default.jpg'} /> {/* CHANGED: Use item.user.avatar */}
                              <AvatarFallback>{item.user?.name?.[0] || '?'}</AvatarFallback> {/* CHANGED: Use item.user.name */}
                            </Avatar>
                          </HoverCardTrigger>
                          <HoverCardContent className='w-80 max-w-xs'>
                            <div className='flex flex-col gap-3'>
                              <div className='flex items-start gap-3'>
                                <Avatar>
                                  <AvatarImage src={item.user?.avatar || '/avatars/default.jpg'} /> {/* CHANGED: Use item.user.avatar */}
                                  <AvatarFallback>{item.user?.name?.[0] || '?'}</AvatarFallback> {/* CHANGED: Use item.user.name */}
                                </Avatar>
                                <div className='flex-1'>
                                  <h4 className='text-sm font-semibold'>{item.user?.name || 'Unknown'}</h4>{' '}
                                  {/* CHANGED: Use item.user.name */}
                                  <p className='text-sm text-muted-foreground truncate'>{item.user?.status}</p>
                                  <p className='text-sm text-muted-foreground truncate'>{item.user?.email}</p>
                                  <p className='text-sm text-muted-foreground truncate'>
                                    Joined: {item.user?.createdAt ? new Date(item.user.createdAt).toLocaleDateString() : 'N/A'}
                                  </p>
                                  <div className='mt-2 flex flex-wrap gap-2'>
                                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full'>
                                      {item.user?.category}
                                    </span>
                                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1'>
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
                                  <span className='flex items-center gap-1'>
                                    <MapPin className='w-3 h-3' /> Nearby
                                  </span>
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
                            setActiveProfile(item.user); // CHANGED: Use item.user
                          }}
                        >
                          <AvatarImage src={item.user?.avatar || '/avatars/default.jpg'} /> {/* CHANGED: Use item.user.avatar */}
                          <AvatarFallback>{item.user?.name?.[0] || '?'}</AvatarFallback> {/* CHANGED: Use item.user.name */}
                        </Avatar>
                      )}
                      <span className='font-semibold'>{item.user?.name || 'Unknown'}</span> {/* CHANGED: Use item.user.name */}
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
                    {item.type === 'post' ? ( // NEW: Conditional rendering for post
                      <>
                        <p>{item.text}</p> {/* CHANGED: Use item.text */}
                        {item.files?.[0] && ( // CHANGED: Use item.files[0] for image
                          <div className='relative w-full h-96 mt-2 rounded'>
                            <Image src={item.files[0].url} alt='Post' fill className='object-cover rounded' />
                          </div>
                        )}
                        {/* NEW: Display tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className='mt-2 flex flex-wrap gap-1'>
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className='text-xs bg-muted px-2 py-1 rounded-full'>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      // NEW: Conditional rendering for poll
                      <>
                        <p className='font-semibold'>{item.question}</p>
                        <TooltipProvider>
                          {' '}
                          {/* NEW: Wrap polls in TooltipProvider */}
                          <div className='mt-2 space-y-2'>
                            {item.options?.map((option, idx) => {
                              const totalVotes = pollVotes[item._id]?.reduce((a, b) => a + b, 0) || 0;
                              const optionVotes = pollVotes[item._id]?.[idx] || 0;
                              const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                              return (
                                <div key={idx} className='flex flex-col gap-1'>
                                  <Tooltip>
                                    {' '}
                                    {/* NEW: Add tooltip for voting */}
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='outline'
                                        size='sm'
                                        className='w-full justify-start'
                                        onClick={() => voteOnPoll(item._id, idx)}
                                        disabled={!isLoggedIn || votedPolls.has(item._id)}
                                      >
                                        {option}
                                      </Button>
                                    </TooltipTrigger>
                                    {isLoggedIn &&
                                      !votedPolls.has(item._id) && ( // NEW: Show tooltip only if logged in and not voted
                                        <TooltipContent>
                                          <p>Vote!</p>
                                        </TooltipContent>
                                      )}
                                  </Tooltip>
                                  <div className='flex items-center gap-2'>
                                    <Progress value={percentage} className='flex-1' />
                                    <span className='text-xs text-muted-foreground'>{percentage.toFixed(1)}%</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TooltipProvider>
                        {!isLoggedIn && <p className='text-xs text-muted-foreground mt-2'>Log in to vote.</p>}
                      </>
                    )}
                    {/* CHANGED: Likes/comments remain mocked, but tied to item._id */}
                    <ButtonGroup className='mt-2'>
                      <Button variant='ghost' size='sm'>
                        <Heart className='w-4 h-4' /> 42 {/* Mock likes */}
                      </Button>
                      <Button variant='ghost' size='sm' onClick={() => toggleComments(item._id)}>
                        <MessageSquare className='w-4 h-4' /> Comments
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <Share className='w-4 h-4' />
                      </Button>
                    </ButtonGroup>
                    {showComments[item._id] && ( // CHANGED: Use item._id
                      <div className='mt-4 space-y-2'>
                        {/* Mock comments, can enhance later */}
                        <div className='flex gap-2'>
                          <AppInput
                            placeholder='Add a comment...'
                            value={newComment[item._id] || ''} // CHANGED: Use item._id
                            onChange={(e) => setNewComment((prev) => ({ ...prev, [item._id]: e.target.value }))} // CHANGED: Use item._id
                            onKeyDown={(e) => e.key === 'Enter' && addComment(item._id)} // CHANGED: Use item._id
                            className='flex-1'
                          />
                          <Button onClick={() => addComment(item._id)} size='sm'>
                            {' '}
                            {/* CHANGED: Use item._id */}
                            Post
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            )
          ) : (
            // NEW: Show skeleton if no items
            <SkeletonLoading variant='feed' />
          )}
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
                  <p className='text-sm text-muted-foreground truncate'>{activeProfile.email}</p>
                  <p className='text-sm text-muted-foreground truncate'>
                    Joined: {activeProfile.createdAt ? new Date(activeProfile.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full'>
                      {activeProfile.category}
                    </span>
                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1'>
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
                  <span className='flex items-center gap-1'>
                    <MapPin className='w-3 h-3' /> Nearby
                  </span>
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
