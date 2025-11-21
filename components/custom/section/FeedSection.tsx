import Image from 'next/image';
import { ThumbsUp, Share, ChevronUp, MessageSquare, MoreVertical, MapPin, Star } from 'lucide-react';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth/auth-client';
import sanitizeHtml from 'sanitize-html';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FeedPost, FeedItem } from '@/lib/types';
import { AppInput } from '../input/AppInput';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { Progress } from '@/components/ui/progress';
import { addLikeAction, addCommentAction, addReplyAction, voteOnPollAction, getFeedPosts } from '@/actions/social/feeds/actions';
import { getUserById } from '@/actions/auth/actions';

type FeedSectionProps = {
  feedItems: FeedItem[];
  setFeedItems: React.Dispatch<React.SetStateAction<FeedItem[]>>;
};

export const FeedSection: React.FC<FeedSectionProps> = ({ feedItems, setFeedItems }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [replyingTo, setReplyingTo] = useState<{ itemId: string; commentId: string } | null>(null);
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const fetchedUserIdsRef = useRef<Set<string>>(new Set());

  const isTouchDevice = useIsMobile();
  const [activeProfile, setActiveProfile] = useState<FeedPost['user'] | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'post' | 'poll'>('all');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

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

  const loadMore = async () => {
    setLoading(true);
    try {
      const newData = await getFeedPosts({ limit: 20, page: 1 });
      const enrichedItems = await Promise.all(
        newData.items.map(async (item) => {
          if (!item.user && item.userId) {
            const user = await getUserById(item.userId);
            const normalizedUser = user
              ? {
                  id: user._id.toString(),
                  name: user.name || 'Unknown',
                  avatar: user.image || '/avatars/default.jpg',
                  status: user.status || 'Online',
                  category: user.category || 'Prieteni',
                  email: user.email || '',
                  provider: user.provider || 'credentials',
                  createdAt: user.createdAt?.toISOString(),
                  updatedAt: user.updatedAt?.toISOString(),
                  location: user.location || [0, 0],
                }
              : null;
            return { ...item, user: normalizedUser, reactions: item.reactions || { likes: { total: 0, userIds: [] }, comments: [] } };
          }
          return item;
        })
      );
      setFeedItems(enrichedItems);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const voteOnPoll = async (postId: string, optionIndex: number) => {
    if (!isLoggedIn) return;
    try {
      await voteOnPollAction(postId, optionIndex);
      setFeedItems((prev) =>
        prev.map((item) =>
          item._id === postId && item.type === 'poll'
            ? {
                ...item,
                votes: item.votes
                  ? item.votes.map((v, idx) => (idx === optionIndex ? v + 1 : v))
                  : item.options?.map((_, idx) => (idx === optionIndex ? 1 : 0)),
                votedUsers: [...(item.votedUsers || []), session?.user?.id || ''],
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleLike = async (itemId: string) => {
    if (!isLoggedIn) return;
    try {
      await addLikeAction(itemId, 'feed');
      setFeedItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? {
                ...item,
                reactions: {
                  ...item.reactions,
                  likes: {
                    total: item.reactions.likes.userIds.includes(session?.user?.id || '')
                      ? item.reactions.likes.total - 1
                      : item.reactions.likes.total + 1,
                    userIds: item.reactions.likes.userIds.includes(session?.user?.id || '')
                      ? item.reactions.likes.userIds.filter((id) => id !== session?.user?.id)
                      : [...item.reactions.likes.userIds, session?.user?.id || ''],
                  },
                },
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const handleAddComment = async (itemId: string) => {
    if (!isLoggedIn || !newComment[itemId]?.trim()) return;
    try {
      await addCommentAction(itemId, newComment[itemId], 'feed');
      setNewComment((prev) => ({ ...prev, [itemId]: '' }));
      setFeedItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? {
                ...item,
                reactions: {
                  ...item.reactions,
                  comments: [
                    ...item.reactions.comments,
                    {
                      id: Date.now().toString(),
                      text: newComment[itemId],
                      userId: session?.user?.id || '',
                      createdAt: new Date().toISOString(),
                      replies: [],
                    },
                  ],
                },
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (itemId: string, commentId: string) => {
    if (!isLoggedIn || !newReply[commentId]?.trim()) return;
    try {
      await addReplyAction(itemId, commentId, newReply[commentId], 'feed');
      setNewReply((prev) => ({ ...prev, [commentId]: '' }));
      setReplyingTo(null);
      setFeedItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? {
                ...item,
                reactions: {
                  ...item.reactions,
                  comments: item.reactions.comments.map((c) =>
                    c.id === commentId
                      ? {
                          ...c,
                          replies: [
                            ...c.replies,
                            {
                              id: Date.now().toString(),
                              text: newReply[commentId],
                              userId: session?.user?.id || '',
                              createdAt: new Date().toISOString(),
                            },
                          ],
                        }
                      : c
                  ),
                },
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = new Set<string>();
      feedItems.forEach((item) => {
        item.reactions?.comments?.forEach((comment) => {
          userIds.add(comment.userId);
          comment.replies?.forEach((reply) => userIds.add(reply.userId));
        });
      });
      const names: { [key: string]: string } = {};
      const idsToFetch = Array.from(userIds).filter((id) => !fetchedUserIdsRef.current.has(id));
      for (const id of idsToFetch) {
        try {
          const user = await getUserById(id);
          names[id] = user?.name || 'Unknown';
        } catch {
          names[id] = 'Unknown';
        }
        fetchedUserIdsRef.current.add(id);
      }
      if (Object.keys(names).length > 0) {
        setUserNames((prev) => ({ ...prev, ...names }));
      }
    };
    fetchUserNames();
  }, [feedItems]);

  const filteredItems = feedItems.filter((item) => filterType === 'all' || item.type === filterType);

  return (
    <Card className='flex flex-col min-h-0 p-4 h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' /> Feed
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
          {filteredItems.length > 0 && !loading ? (
            filteredItems.map((item) => (
              <Card key={item._id} className='transition-all duration-300 hover:shadow-lg'>
                <CardHeader className='flex flex-row items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    {!isTouchDevice ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Avatar className='cursor-default'>
                            <AvatarImage src={item.user?.avatar || '/avatars/default.jpg'} />
                            <AvatarFallback>{item.user?.name?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className='w-80 max-w-xs'>
                          <div className='flex flex-col gap-3'>
                            <div className='flex items-start gap-3'>
                              <Avatar>
                                <AvatarImage src={item.user?.avatar || '/avatars/default.jpg'} />
                                <AvatarFallback>{item.user?.name?.[0] || '?'}</AvatarFallback>
                              </Avatar>
                              <div className='flex-1'>
                                <h4 className='text-sm font-semibold'>{item.user?.name || 'Unknown'}</h4>{' '}
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
                          setActiveProfile(item.user);
                        }}
                      >
                        <AvatarImage src={item.user?.avatar || '/avatars/default.jpg'} />
                        <AvatarFallback>{item.user?.name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className='font-semibold'>{item.user?.name || 'Unknown'}</span>
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
                  {item.type === 'post' ? (
                    <>
                      <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.text || '') }} />
                      {item.files?.[0] && (
                        <div className='relative w-full h-96 mt-2 rounded'>
                          <Image src={item.files[0].url} alt='Post' fill className='object-cover rounded' />
                        </div>
                      )}
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
                    <>
                      <p className='font-semibold'>{item.question}</p>
                      <TooltipProvider>
                        <div className='mt-2 space-y-2'>
                          {item.options?.map((option, idx) => {
                            const totalVotes = (item.votes || []).reduce((a, b) => a + b, 0);
                            const optionVotes = item.votes?.[idx] || 0;
                            const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                            return (
                              <div key={idx} className='flex flex-col gap-1'>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='w-full justify-start'
                                      onClick={() => voteOnPoll(item._id, idx)}
                                      disabled={!isLoggedIn || (item.votedUsers || []).includes(session?.user?.id || '')}
                                    >
                                      {option}
                                    </Button>
                                  </TooltipTrigger>
                                  {isLoggedIn && !(item.votedUsers || []).includes(session?.user?.id || '') && (
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
                  <ButtonGroup className='mt-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='sm' onClick={() => handleLike(item._id)} disabled={!isLoggedIn}>
                            <ThumbsUp
                              className={`w-4 h-4 ${(item.reactions || { likes: { total: 0, userIds: [] } }).likes.userIds.includes(session?.user?.id || '') ? 'fill-secondary text-secondary' : ''}`}
                            />{' '}
                            {(item.reactions || { likes: { total: 0, userIds: [] } }).likes.total}
                          </Button>
                        </TooltipTrigger>
                        {!isLoggedIn && <TooltipContent>Conectează-te pentru a utiliza această funcție</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                    <Button variant='ghost' size='sm' onClick={() => toggleComments(item._id)}>
                      <MessageSquare className='w-4 h-4' /> Comments ({(item.reactions || { comments: [] }).comments.length})
                    </Button>
                  </ButtonGroup>
                  {showComments[item._id] && (
                    <div className='mt-4 space-y-2'>
                      {(item.reactions || { comments: [] }).comments.map((comment) => (
                        <div key={comment.id} className='border-l-2 pl-2'>
                          <p>
                            <strong>{comment.userId === session?.user?.id ? 'Tu' : userNames[comment.userId] || 'User'}:</strong>{' '}
                            {comment.text}
                          </p>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              if (replyingTo?.commentId === comment.id) {
                                setReplyingTo(null);
                              } else {
                                setReplyingTo({ itemId: item._id, commentId: comment.id });
                              }
                            }}
                            disabled={!isLoggedIn}
                          >
                            Reply
                          </Button>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className='ml-4 border-l-2 pl-2'>
                              <p>
                                <strong>{reply.userId === session?.user?.id ? 'Tu' : userNames[reply.userId] || 'User'}:</strong>{' '}
                                {reply.text}
                              </p>
                            </div>
                          ))}
                          {replyingTo?.commentId === comment.id && (
                            <div className='flex gap-2 mt-2'>
                              <AppInput
                                placeholder='Adaugă un răspuns...'
                                value={newReply[comment.id] || ''}
                                onChange={(e) => setNewReply((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddReply(item._id, comment.id)}
                                className='flex-1'
                                disabled={!isLoggedIn}
                              />
                              <Button onClick={() => handleAddReply(item._id, comment.id)} size='sm' disabled={!isLoggedIn}>
                                Post
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className='flex gap-2'>
                        <AppInput
                          placeholder='Adaugă un comentariu...'
                          value={newComment[item._id] || ''}
                          onChange={(e) => setNewComment((prev) => ({ ...prev, [item._id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(item._id)}
                          className='flex-1'
                          disabled={!isLoggedIn}
                        />
                        <Button onClick={() => handleAddComment(item._id)} size='sm' disabled={!isLoggedIn}>
                          Post
                        </Button>
                      </div>
                      {!isLoggedIn && <p className='text-xs text-muted-foreground'>Conectează-te pentru a comenta.</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <SkeletonLoading variant='feed' />
          )}
          <div className='flex justify-center mt-4'>
            <Button
              onClick={loadMore}
              variant='outline'
              size='lg'
              className='rounded-full shadow-lg bg-background hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
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
