'use client';

import { BadgeCheckIcon, ShareIcon, ArrowRightIcon } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type AppGoldenSectionProps = {
  title: string;
  posts: {
    id: number;
    title: string;
    desc: string;
    verified: boolean;
    isNew: boolean;
    imageUrl: string;
  }[];
};

export default function AppGoldenSection({ title, posts }: AppGoldenSectionProps) {
  const router = useRouter();
  const displayedPosts = posts.slice(0, 6);

  return (
    <section className='py-8 w-full'>
      <div className='w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        <h2 className='text-2xl font-bold text-center sm:text-end mb-6 text-secondary'>{title}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-5 gap-6'>
          <div className='relative sm:row-start-1 sm:row-end-3 col-span-full'>
            {displayedPosts[5]?.verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {displayedPosts[5]?.isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={displayedPosts[5]?.id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${displayedPosts[5]?.imageUrl})` }}
              onClick={() => displayedPosts[5] && router.push(`/post/${displayedPosts[5].id}`)}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-white/80 dark:bg-black/80'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/post/${displayedPosts[5]?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ShareIcon className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='bg-white/80 dark:bg-black/80 text-black dark:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    displayedPosts[5] && router.push(`/post/${displayedPosts[5].id}`);
                  }}
                >
                  Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[5]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{displayedPosts[5]?.desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative sm:row-start-3 sm:row-end-6'>
            {displayedPosts[4]?.verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {displayedPosts[4]?.isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={displayedPosts[4]?.id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${displayedPosts[4]?.imageUrl})` }}
              onClick={() => displayedPosts[4] && router.push(`/post/${displayedPosts[4].id}`)}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-white/80 dark:bg-black/80'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/post/${displayedPosts[4]?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ShareIcon className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='bg-white/80 dark:bg-black/80 text-black dark:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    displayedPosts[4] && router.push(`/post/${displayedPosts[4].id}`);
                  }}
                >
                  Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[4]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{displayedPosts[4]?.desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative sm:row-start-3 sm:row-end-5'>
            {displayedPosts[0]?.verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {displayedPosts[0]?.isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={displayedPosts[0]?.id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${displayedPosts[0]?.imageUrl})` }}
              onClick={() => displayedPosts[0] && router.push(`/post/${displayedPosts[0].id}`)}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-white/80 dark:bg-black/80'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/post/${displayedPosts[0]?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ShareIcon className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='bg-white/80 dark:bg-black/80 text-black dark:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    displayedPosts[0] && router.push(`/post/${displayedPosts[0].id}`);
                  }}
                >
                  Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[0]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{displayedPosts[0]?.desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative'>
            {displayedPosts[1]?.verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {displayedPosts[1]?.isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={displayedPosts[1]?.id}
              className='relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${displayedPosts[1]?.imageUrl})` }}
              onClick={() => displayedPosts[1] && router.push(`/post/${displayedPosts[1].id}`)}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-white/80 dark:bg-black/80'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/post/${displayedPosts[1]?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ShareIcon className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='bg-white/80 dark:bg-black/80 text-black dark:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    displayedPosts[1] && router.push(`/post/${displayedPosts[1].id}`);
                  }}
                >
                  Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[1]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{displayedPosts[1]?.desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative'>
            {displayedPosts[2]?.verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {displayedPosts[2]?.isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={displayedPosts[2]?.id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${displayedPosts[2]?.imageUrl})` }}
              onClick={() => displayedPosts[2] && router.push(`/post/${displayedPosts[2].id}`)}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-white/80 dark:bg-black/80'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/post/${displayedPosts[2]?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ShareIcon className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='bg-white/80 dark:bg-black/80 text-black dark:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    displayedPosts[2] && router.push(`/post/${displayedPosts[2].id}`);
                  }}
                >
                  Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[2]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{displayedPosts[2]?.desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative col-span-full sm:col-start-2'>
            {displayedPosts[3]?.verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {displayedPosts[3]?.isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={displayedPosts[3]?.id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${displayedPosts[3]?.imageUrl})` }}
              onClick={() => displayedPosts[3] && router.push(`/post/${displayedPosts[3].id}`)}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-white/80 dark:bg-black/80'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/post/${displayedPosts[3]?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ShareIcon className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  className='bg-white/80 dark:bg-black/80 text-black dark:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    displayedPosts[3] && router.push(`/post/${displayedPosts[3].id}`);
                  }}
                >
                  Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[3]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{displayedPosts[3]?.desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
