'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BadgeCheckIcon, ArrowRightIcon } from 'lucide-react';
import DOMPurify from 'dompurify';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShareButton from '../button/ShareButton';

type Post = {
  id: string;
  title: string;
  desc?: string;
  verified?: boolean;
  isNew?: boolean;
  imageUrl?: string;
  category: string;
};

type AppGoldenSectionProps = {
  title: string;
  posts: Post[];
};

export default function AppGoldenSection({ title, posts }: AppGoldenSectionProps) {
  const displayedPosts = posts.slice(0, 6);
  const sanitizedDescs = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return displayedPosts.map((p) => DOMPurify.sanitize(p?.desc || ''));
  }, [displayedPosts]);

  return (
    <section className='py-8 w-full'>
      <div className='w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        <h2 className='text-2xl font-bold text-center sm:text-end mb-6 text-secondary'>{title}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-5 gap-6'>
          <div className='relative sm:row-start-1 sm:row-end-3 col-span-full ring-2 ring-white rounded-xl backdrop-blur-sm shadow-lg'>
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
              className='h-full relative bg-cover bg-center pinch cursor-default'
              style={{ backgroundImage: `url(${displayedPosts[5]?.imageUrl})` }}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <ShareButton href={displayedPosts[5] ? `/categorii/auto/${displayedPosts[5].category}/${displayedPosts[5].id}` : '#'} />
                <Link href={displayedPosts[5] ? `/categorii/auto/${displayedPosts[5].category}/${displayedPosts[5].id}` : '#'}>
                  <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                    Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[5]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescs[5] || '' }} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative sm:row-start-3 sm:row-end-6 ring-2 ring-white rounded-xl backdrop-blur-sm shadow-lg'>
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
              className='h-full relative bg-cover bg-center pinch cursor-default'
              style={{ backgroundImage: `url(${displayedPosts[4]?.imageUrl})` }}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <ShareButton href={displayedPosts[4] ? `/categorii/auto/${displayedPosts[4].category}/${displayedPosts[4].id}` : '#'} />
                <Link href={displayedPosts[4] ? `/categorii/auto/${displayedPosts[4].category}/${displayedPosts[4].id}` : '#'}>
                  <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                    Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[4]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescs[4] || '' }} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative sm:row-start-3 sm:row-end-5 ring-2 ring-white rounded-xl backdrop-blur-sm shadow-lg'>
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
              className='h-full relative bg-cover bg-center pinch cursor-default'
              style={{ backgroundImage: `url(${displayedPosts[0]?.imageUrl})` }}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <ShareButton href={displayedPosts[0] ? `/categorii/auto/${displayedPosts[0].category}/${displayedPosts[0].id}` : '#'} />
                <Link href={displayedPosts[0] ? `/categorii/auto/${displayedPosts[0].category}/${displayedPosts[0].id}` : '#'}>
                  <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                    Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[0]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescs[0] || '' }} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative ring-2 ring-white rounded-xl backdrop-blur-sm shadow-lg'>
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
              className='relative bg-cover bg-center pinch cursor-default'
              style={{ backgroundImage: `url(${displayedPosts[1]?.imageUrl})` }}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <ShareButton href={displayedPosts[1] ? `/categorii/auto/${displayedPosts[1].category}/${displayedPosts[1].id}` : '#'} />
                <Link href={displayedPosts[1] ? `/categorii/auto/${displayedPosts[1].category}/${displayedPosts[1].id}` : '#'}>
                  <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                    Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[1]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescs[1] || '' }} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative ring-2 ring-white rounded-xl backdrop-blur-sm shadow-lg'>
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
              className='h-full relative bg-cover bg-center pinch cursor-default'
              style={{ backgroundImage: `url(${displayedPosts[2]?.imageUrl})` }}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <ShareButton href={displayedPosts[2] ? `/categorii/auto/${displayedPosts[2].category}/${displayedPosts[2].id}` : '#'} />
                <Link href={displayedPosts[2] ? `/categorii/auto/${displayedPosts[2].category}/${displayedPosts[2].id}` : '#'}>
                  <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                    Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[2]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescs[2] || '' }} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative col-span-full sm:col-start-2 ring-2 ring-white rounded-xl backdrop-blur-sm shadow-lg'>
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
              className='h-full relative bg-cover bg-center pinch cursor-default'
              style={{ backgroundImage: `url(${displayedPosts[3]?.imageUrl})` }}
            >
              <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
                <ShareButton href={displayedPosts[3] ? `/categorii/auto/${displayedPosts[3].category}/${displayedPosts[3].id}` : '#'} />
                <Link href={displayedPosts[3] ? `/categorii/auto/${displayedPosts[3].category}/${displayedPosts[3].id}` : '#'}>
                  <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                    Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
                  </Button>
                </Link>
              </div>
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{displayedPosts[3]?.title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescs[3] || '' }} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
