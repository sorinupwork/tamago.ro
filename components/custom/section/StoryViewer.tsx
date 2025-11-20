import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, X } from 'lucide-react';
import { User, StoryWithUser } from '@/lib/types';

type StoryViewerProps = {
  stories: StoryWithUser[]; // CHANGED: From User[] to StoryWithUser[]
  initialIndex: number;
  onClose: () => void;
};

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // touch/swipe refs
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const TAP_THRESHOLD = 10; // px to differentiate tap vs swipe
  const SWIPE_THRESHOLD = 50; // px to count as swipe

  const currentStory = stories[currentIndex]; // CHANGED: Use stories
  const mediaFile = currentStory.files?.[0]; // NEW: Get first file
  const mediaUrl = mediaFile?.url; // CHANGED: Use file URL
  const isVideo = mediaFile?.contentType?.startsWith('video/') || false; // CHANGED: Check contentType for video
  const duration = isVideo ? 10 : 5; // Mock duration: 10s for video, 5s for image

  useEffect(() => {
    // Reset on index change
    setProgress(0);
    startTimeRef.current = Date.now();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / (duration * 1000)) * 100;
        if (newProgress >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
          } else {
            onClose();
          }
        } else {
          setProgress(newProgress);
        }
      }, 100);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentIndex, duration, stories.length, onClose]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // navigation helpers
  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      // restart current if first
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  };

  // touch handlers for swipe and tap
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
      // swipe left -> next, swipe right -> prev
      if (diff > 0) goNext(); // left swipe
      else goPrev(); // right swipe
    } else {
      // treat as tap: find where tapped (left or right half)
      // we don't have the tap x here, fallback to toggling play/pause or next/prev by click handler on overlay
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  // click overlay handler: tap right half = next, left half = prev
  const onOverlayClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      goNext();
    } else {
      goPrev();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-full max-h-full w-screen h-screen p-0 bg-black' showCloseButton={false}>
        <div className='sr-only'>
          <DialogTitle>{currentStory.user?.name || 'Unknown'}</DialogTitle>
        </div>
        {/* Progress Bars */}
        <div className='absolute top-4 left-4 right-16 flex gap-1 z-20'>
          {stories.map((_, idx) => (
            <div key={idx} className='flex-1 h-1 bg-gray-600 rounded cursor-pointer' onClick={() => setCurrentIndex(idx)}>
              <div
                className='h-full bg-white rounded transition-all duration-100'
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        {/* Media */}
        <div
          className='relative w-full h-full flex items-center justify-center'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onOverlayClick}
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
                autoPlay
              />
            ) : (
              <img src={mediaUrl} alt={currentStory.user?.name} className='w-full h-full object-cover' />
            )
          ) : (
            <div className='w-full h-full bg-gray-800 flex items-center justify-center text-white'>No media available</div>
          )}
          {/* Overlay */}
          <div className='absolute inset-0 bg-black transition-opacity duration-300' style={{ opacity: isPlaying ? 0.2 : 0.5 }} />
          {/* Play/Pause Button */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10'>
            <Button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} variant='secondary' size='lg'>
              {isPlaying ? <Pause className='w-6 h-6' /> : <Play className='w-6 h-6' />}
            </Button>
          </div>
          {/* Story Info and close */}
          <div className='absolute top-4 right-4 z-20 flex items-center gap-2'>
            <div className='text-white mr-2'>
              <h2 className='text-lg font-bold'>{currentStory.user?.name || 'Unknown'}</h2>
              <p className='text-sm'>{currentStory.caption || 'No caption'}</p>
            </div>
            <Button onClick={(e) => { e.stopPropagation(); onClose(); }} variant='ghost' size='sm' className='text-white'>
              <X className='w-5 h-5' />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
