'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Star } from 'lucide-react';
import { User } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

type Props = {
  user?: User | null;
  className?: string;
  interactive?: boolean;
  contentOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  storyPreview?: string;
};

function UserProfileContent({ user }: { user?: User | null }) {
  if (!user) return null;
  // use stable, deterministic date format (YYYY-MM-DD) to avoid SSR/client locale mismatch
  const joined = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A';

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-start gap-3'>
        <Avatar>
          <AvatarImage src={user.avatar || '/avatars/default.jpg'} />
          <AvatarFallback>{user.name?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <h4 className='text-sm font-semibold'>{user.name || 'Unknown'}</h4>
          <p className='text-sm text-muted-foreground truncate'>{user.status}</p>
          <p className='text-sm text-muted-foreground truncate'>{user.email}</p>
          <p className='text-sm text-muted-foreground truncate'>Joined: {joined}</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full'>{user.category}</span>
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
  );
}

export default function UserProfileCard({
  user,
  className = '',
  interactive = true,
  contentOnly = false,
  size = 'md',
  showName = false,
  storyPreview,
}: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  if (contentOnly) {
    return (
      <div className={className}>
        <UserProfileContent user={user} />
      </div>
    );
  }

  const sizeClass = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';
  const avatarSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  if (storyPreview) {
    const cardEl = (
      // keep the same DOM + classes across server & client (fallback + stable overlay)
      <div className={`relative ${sizeClass} rounded-lg overflow-hidden bg-gray-200 cursor-default ${className}`}>
        {/* use a plain img for external thumbnails/fallbacks to avoid Next/Image domain/hydration issues */}
        <img
          src={storyPreview || user?.avatar || '/avatars/default.jpg'}
          alt='Story preview'
          className='absolute inset-0 w-full h-full object-cover'
        />

        {/* stable overlay: include gradient and fallback solid overlay to avoid mismatches */}
        <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent bg-black bg-opacity-20 opacity-20' />

        <div className={`absolute top-2 left-2 ${avatarSize} rounded-full border-2 border-white overflow-hidden`}>
          <Avatar className='w-full h-full'>
            <AvatarImage src={user?.avatar || '/avatars/default.jpg'} />
            <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );

    return (
      <div className='flex flex-col items-center gap-1'>
        {cardEl}
        {showName && <span className='text-xs font-semibold'>{user?.name || 'Unknown'}</span>}
      </div>
    );
  }

  const avatarEl = (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        role={interactive ? 'button' : undefined}
        onClick={(e) => {
          if (!interactive) return;
          if (isMobile) {
            e.stopPropagation();
            setOpen(true);
          }
        }}
        className={`cursor-${interactive ? 'pointer' : 'default'}`}
      >
        <Avatar className={size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}>
          <AvatarImage src={user?.avatar || '/avatars/default.jpg'} />
          <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
        </Avatar>
      </div>
      {showName && <span className='font-semibold text-sm'>{user?.name || 'Unknown'}</span>}
    </div>
  );

  if (!interactive) {
    return avatarEl;
  }

  if (!isMobile) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>{avatarEl}</HoverCardTrigger>
        <HoverCardContent className='w-80 max-w-xs'>
          <UserProfileContent user={user} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <>
      {avatarEl}
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className='max-w-sm w-full'>
          <DialogTitle>{user.name}</DialogTitle>
          <UserProfileContent user={user} />
        </DialogContent>
      </Dialog>
    </>
  );
}
