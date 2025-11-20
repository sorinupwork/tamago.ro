import { Camera } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { StoryWithUser, User } from '@/lib/types';
import { StoryViewer } from './StoryViewer';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { MapPin, Star } from 'lucide-react';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';

type StoriesSectionProps = {
  stories?: StoryWithUser[];
  users?: User[];
  mode?: 'stories' | 'users';
  title?: string;
};

export const StoriesSection: React.FC<StoriesSectionProps> = ({ stories = [], users = [], mode = 'stories', title = 'Stories' }) => {
  const baseId = useId();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedStory, setSelectedStory] = useState<{ stories: StoryWithUser[]; index: number } | null>(null);
  const [activeProfile, setActiveProfile] = useState<User | null>(null);

  const isMobile = useIsMobile();
  const isStoriesMode = mode === 'stories';
  const items = isStoriesMode ? stories : users.map(user => ({ user }));

  // Group stories by userId to get unique users if stories
  const uniqueUsers = isStoriesMode ? stories.reduce((acc, story) => {
    const userId = story.user?.id;
    if (userId && !acc.some(u => u.user?.id === userId)) {
      acc.push(story);
    }
    return acc;
  }, [] as StoryWithUser[]) : items;

  const handleStoryClick = (userId: string, clickedIndex: number) => {
    if (!isStoriesMode) return; // No viewer for users mode
    // Get all stories for this user
    const userStories = stories.filter(story => story.user?.id === userId);
    // Find the index of the clicked story within the user's stories
    const initialIndex = userStories.findIndex(story => story._id === stories[clickedIndex]._id);
    setSelectedStory({ stories: userStories, index: initialIndex });
  };

  const handleUserClick = (user: User) => {
    if (isMobile) {
      setActiveProfile(user);
    }
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
            <div className='flex space-x-4 p-4 min-h-[120px]'>
              {uniqueUsers.length > 0 ? (
                uniqueUsers.map((item, index) => {
                  const user = isStoriesMode ? item.user : item.user;
                  return (
                    <div
                      key={`${baseId}-${index}`}
                      className='flex flex-col items-center gap-2 hover:scale-105 transition-transform shrink-0 cursor-default'
                      onClick={() => isStoriesMode ? handleStoryClick(user?.id || '', index) : handleUserClick(user!)}
                    >
                      {!isMobile && !isStoriesMode ? (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Avatar className='w-12 h-12 ring-2 ring-primary'>
                              <AvatarImage src={user?.avatar || '/avatars/default.jpg'} />
                              <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                          </HoverCardTrigger>
                          <HoverCardContent className='w-80 max-w-xs'>
                            <div className='flex flex-col gap-3'>
                              <div className='flex items-start gap-3'>
                                <Avatar>
                                  <AvatarImage src={user?.avatar || '/avatars/default.jpg'} />
                                  <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                  <h4 className='text-sm font-semibold'>{user?.name || 'Unknown'}</h4>
                                  <p className='text-sm text-muted-foreground truncate'>{user?.status}</p>
                                  <p className='text-sm text-muted-foreground truncate'>{user?.email}</p>
                                  <p className='text-sm text-muted-foreground truncate'>Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                  <div className='mt-2 flex flex-wrap gap-2'>
                                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full'>{user?.category}</span>
                                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1'>
                                      <Star className='w-3 h-3' /> Top
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
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        <Avatar className='w-12 h-12 ring-2 ring-primary'>
                          <AvatarImage src={user?.avatar || '/avatars/default.jpg'} />
                          <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                      )}
                      <span className='text-xs'>{user?.name || 'Unknown'}</span>
                    </div>
                  );
                })
              ) : (
                <SkeletonLoading variant='story' />
              )}
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
      {/* Mobile dialog for user profile */}
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
                  <p className='text-sm text-muted-foreground truncate'>Joined: {activeProfile.createdAt ? new Date(activeProfile.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full'>{activeProfile.category}</span>
                    <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1'>
                      <Star className='w-3 h-3' /> Top
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
    </>
  );
};
