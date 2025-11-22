'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Play, Pause, X, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StoryWithUser } from '@/lib/types';
import { addLikeAction, addCommentAction } from '@/actions/social/feeds/actions';
import { useSession } from '@/lib/auth/auth-client';
import { AppInput } from '../input/AppInput';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { getUserById } from '@/actions/auth/actions';

type StoryViewerProps = {
  stories: StoryWithUser[];
  userId: string;
  initialIndex: number;
  onClose: () => void;
};

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, userId, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(10);

  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const userStories = stories.filter((story) => story.user?.id === userId);
  const currentStory = userStories[currentIndex];
  const mediaFile = currentStory?.files?.[0];
  const mediaUrl = mediaFile?.url;
  const isVideo = mediaFile?.contentType?.startsWith('video/') || false;
  const duration = isVideo ? videoDuration : 5;

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [newComment, setNewComment] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const isActiveRef = useRef(true);
  const router = useRouter();

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  useEffect(() => {
    let videoToPause: HTMLVideoElement | null = null;
    if (isVideo && videoRef.current) {
      videoToPause = videoRef.current;
      const updateProgress = () => {
        if (videoToPause!.duration > 0) {
          setProgress((videoToPause!.currentTime / videoToPause!.duration) * 100);
        }
      };
      videoToPause.addEventListener('loadedmetadata', () => {
        setVideoDuration(videoToPause!.duration);
      });
      videoToPause.addEventListener('timeupdate', updateProgress);
      videoToPause.addEventListener('ended', () => {
        const userStoriesLength = stories.filter((story) => story.user?.id === userId).length;
        if (currentIndex < userStoriesLength - 1) {
          setCurrentIndex((idx) => idx + 1);
          setProgress(0);
        } else {
          onClose();
        }
      });
      return () => {
        if (videoToPause) {
          videoToPause.removeEventListener('timeupdate', updateProgress);
          videoToPause.pause();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (!isPaused) {
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
          if (!isActiveRef.current) return;
          const elapsed = Date.now() - startTimeRef.current;
          const newProgress = (elapsed / (duration * 1000)) * 100;
          if (newProgress >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            const userStoriesLength = stories.filter((story) => story.user?.id === userId).length;
            if (currentIndex < userStoriesLength - 1) {
              setCurrentIndex((idx) => idx + 1);
              setProgress(0);
            } else {
              onClose();
            }
          } else {
            setProgress(newProgress);
          }
        }, 50);
      }
    }
  }, [isVideo, currentIndex, duration, onClose, stories, userId, isPaused]);

  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
    setIsPlaying((prev) => !prev);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else {
      if (isPlaying) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const newProgress = (elapsed / (duration * 1000)) * 100;
          if (newProgress >= 100) {
            const userStoriesLength = stories.filter((story) => story.user?.id === userId).length;
            if (currentIndex < userStoriesLength - 1) {
              setCurrentIndex((idx) => idx + 1);
              setProgress(0);
            } else {
              onClose();
            }
          } else {
            setProgress(newProgress);
          }
        }, 50);
      }
    }
  };

  const goNext = () => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null || touchCurrentX.current == null) {
      touchStartX.current = null;
      touchCurrentX.current = null;
      return;
    }
    const diff = touchStartX.current - touchCurrentX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const onOverlayClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      goNext();
    } else {
      goPrev();
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) return;
    try {
      await addLikeAction(currentStory._id, 'story');
      router.refresh();
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn || !newComment.trim()) return;
    setIsCommentLoading(true);
    try {
      await addCommentAction(currentStory._id, newComment, 'story');

      const user = await getUserById(session?.user?.id || '');
      setUserNames((prev) => ({ ...prev, [session?.user?.id || '']: user?.name || 'Unknown' }));
      setIsPaused(true);
      setIsPlaying(false);
      if (videoRef.current) videoRef.current.pause();

      router.refresh();
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleInputFocus = () => {
    setIsPaused(true);
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.pause();
    if (!isVideo && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleInputBlur = () => {
    setIsPaused(false);
    setIsPlaying(true);
    if (videoRef.current) videoRef.current.play();
    if (!isVideo && !intervalRef.current) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / (duration * 1000)) * 100;
        if (newProgress >= 100) {
          if (currentIndex < userStories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
          } else {
            onClose();
          }
        } else {
          setProgress(newProgress);
        }
      }, 50);
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const comment = currentStory?.reactions?.comments?.[0];
      if (comment && !userNames[comment.userId]) {
        try {
          const user = await getUserById(comment.userId);
          setUserNames((prev) => ({ ...prev, [comment.userId]: user?.name || 'Unknown' }));
        } catch {
          setUserNames((prev) => ({ ...prev, [comment.userId]: 'Unknown' }));
        }
      }
    };
    fetchUserName();
  }, [currentStory?.reactions?.comments, userNames]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-full max-h-full w-screen h-screen p-0 bg-black' showCloseButton={false}>
        <div className='sr-only'>
          <DialogTitle>{currentStory.user?.name || 'Unknown'}</DialogTitle>
          <DialogDescription>{currentStory.caption || 'No caption'}</DialogDescription>
        </div>

        <div className='absolute top-4 left-4 right-4 flex items-center gap-2 z-20'>
          <div className='flex-1 flex gap-1'>
            {userStories.map((_, idx) => (
              <div key={idx} className='flex-1'>
                <Progress value={idx === currentIndex ? progress : idx < currentIndex ? 100 : 0} className='h-1' />
              </div>
            ))}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            variant='ghost'
            size='sm'
            className='text-white'
          >
            <X className='w-5 h-5' />
          </Button>
        </div>

        <div
          className='relative w-full h-full flex items-center justify-center'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onOverlayClick}
          style={{ pointerEvents: isPaused ? 'none' : 'auto' }}
        >
          {mediaUrl ? (
            isVideo ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                className='w-full h-full object-cover'
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => goNext()}
                autoPlay={!isPaused}
              />
            ) : (
              <Image src={mediaUrl} alt={currentStory.user?.name || 'Unknown'} fill className='object-cover' />
            )
          ) : (
            <div className='w-full h-full bg-gray-800 flex items-center justify-center text-white'>No media available</div>
          )}

          <div className='absolute inset-0 bg-black transition-opacity duration-300' style={{ opacity: isPlaying ? 0.2 : 0.5 }} />

          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10' />

          <div className='absolute top-16 left-4 right-4 z-20'>
            <div className='text-white bg-black bg-opacity-50 rounded-lg p-2 max-w-xs'>
              <h2 className='text-sm font-bold truncate'>{currentStory.user?.name || 'Unknown'}</h2>
              <p className='text-xs opacity-80 truncate'>
                {sanitizeHtml(currentStory.caption || 'No caption', { allowedTags: [], allowedAttributes: {} })}
              </p>
            </div>
          </div>
        </div>

        <div className='absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-80 flex flex-col gap-4 z-20'>
          <div className='flex items-center justify-between'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleLike} variant='secondary' size='sm' disabled={!isLoggedIn} className=''>
                    <ThumbsUp
                      className={`w-4 h-4 ${(currentStory.reactions || { likes: { total: 0, userIds: [] } }).likes.userIds.includes(session?.user?.id || '') ? 'fill-red-500 text-red-500' : ''}`}
                    />{' '}
                    {(currentStory.reactions || { likes: { total: 0, userIds: [] } }).likes.total}
                  </Button>
                </TooltipTrigger>
                {!isLoggedIn && <TooltipContent>Conectează-te pentru a utiliza această funcție</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='flex flex-col gap-3'>
            {(currentStory.reactions || { comments: [] }).comments.length === 0 && (
              <div className='flex gap-2'>
                <AppInput
                  placeholder='Adaugă un comentariu...'
                  value={newComment}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className='flex-1 text-white'
                  disabled={!isLoggedIn}
                />
                <Button onClick={handleAddComment} size='sm' disabled={!isLoggedIn || isCommentLoading}>
                  {isCommentLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Post'}
                </Button>
              </div>
            )}
            {(currentStory.reactions || { comments: [] }).comments.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <p className='text-background dark:text-foreground text-sm flex-1'>
                    <strong>
                      {currentStory.reactions.comments[0].userId === session?.user?.id
                        ? 'Tu'
                        : userNames[currentStory.reactions.comments[0].userId] || 'Utilizator necunoscut'}
                      :
                    </strong>{' '}
                    {(currentStory.reactions || { comments: [] }).comments[0].text}
                  </p>
                  {currentStory.reactions.comments[0].userId === session?.user?.id && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                      variant='secondary'
                      size='sm'
                    >
                      {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {!isLoggedIn && <p className='text-xs text-gray-400'>Conectează-te pentru a comenta.</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
