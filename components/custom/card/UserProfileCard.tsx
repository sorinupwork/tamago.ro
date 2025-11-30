'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getUserById } from '@/actions/auth/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/ui/use-mobile';
import { User } from '@/lib/types';

type Props = {
  user?: User | null;
  userId?: string;
  className?: string;
  interactive?: boolean;
  contentOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  storyPreview?: string;
};

function UserProfileContent({ user }: { user?: User | null }) {
  if (!user) return null;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-start gap-3'>
        <Avatar>
          <AvatarImage src={user.image || user.avatar} />
          <AvatarFallback>{user.name?.[0] || '?'}</AvatarFallback>
        </Avatar>

        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='text-sm font-semibold'>{user.name || 'Unknown'}</h4>
            {user.emailVerified && <CheckCircle2 className=' h-3 w-3 text-green-500 bg-white dark:bg-slate-950 rounded-full' />}
          </div>
          <p className='text-sm text-muted-foreground truncate'>{user.status}</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            <Link href={`/profile/${user.id}`} className='text-sm text-primary hover:underline flex items-center gap-1.5 pt-2 border-t'>
              Vezi profilul
              <ExternalLink className='h-3 w-3' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfileCard({
  user,
  userId,
  showName = false,
  size = 'md',
  className = '',
  contentOnly = false,
  storyPreview,
  interactive = true,
}: Props) {
  const isMobile = useIsMobile();
  const [resolvedUser, setResolvedUser] = useState<User | null | undefined>(user);
  const [isLoading, setIsLoading] = useState(!user && !!userId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user && userId) {
      getUserById(userId)
        .then((fetchedUser) => {
          setResolvedUser(fetchedUser);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setResolvedUser(null);
          setIsLoading(false);
        });
    }
  }, [userId, user]);

  if (isLoading) {
    return <div className='w-12 h-12 bg-gray-200 rounded-full animate-pulse' />;
  }

  if (!resolvedUser) return null;

  if (contentOnly) {
    return (
      <div className={className}>
        <UserProfileContent user={resolvedUser} />
      </div>
    );
  }

  const sizeClass = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';
  const avatarSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  if (storyPreview) {
    const cardEl = (
      <div className={`relative ${sizeClass} rounded-lg overflow-hidden bg-gray-200 cursor-default ${className}`}>
        <Image
          fill
          src={storyPreview || resolvedUser?.image || resolvedUser?.avatar || '/avatars/default.jpg'}
          alt='Story preview'
          className='w-full h-full object-cover'
        />

        <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent bg-black bg-opacity-20 opacity-20' />

        <div className={`absolute top-2 left-2 ${avatarSize} rounded-full border-2 border-white overflow-hidden`}>
          <Avatar className='w-full h-full'>
            <AvatarImage src={resolvedUser?.image || resolvedUser?.avatar} />
            <AvatarFallback>{resolvedUser?.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );

    return (
      <div className='flex flex-col items-center gap-1'>
        {cardEl}
        {showName && <span className='text-xs font-semibold'>{resolvedUser?.name || 'Unknown'}</span>}
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
          <AvatarImage src={resolvedUser?.image || resolvedUser?.avatar} />
          <AvatarFallback>{resolvedUser?.name?.[0] || '?'}</AvatarFallback>
        </Avatar>
      </div>
      {showName && <span className='font-semibold text-sm'>{resolvedUser?.name || 'Unknown'}</span>}
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
          <UserProfileContent user={resolvedUser} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <>
      {avatarEl}
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className='max-w-sm w-full'>
          <DialogTitle>{resolvedUser.name}</DialogTitle>
          <UserProfileContent user={resolvedUser} />
        </DialogContent>
      </Dialog>
    </>
  );
}
