'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BadgeCheckIcon, ArrowRightIcon } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShareButton from '../button/ShareButton';
import { Post } from '@/lib/types';
import { reverseCategoryMapping } from '@/lib/categories';

type AppGoldenSectionProps = {
  title: string;
  posts: Post[];
};

export default function AppGoldenSection({ title, posts }: AppGoldenSectionProps) {
  const sanitizedDescs = useMemo(() => {
    return posts.map((p) => sanitizeHtml(p?.description || ''));
  }, [posts]);

  const isPostVerified = (post: Post): boolean => {
    if (!post.userId) return false;
    return post.verified ?? false;
  };

  const isPostNew = (post: Post): boolean => {
    if (!post.createdAt) return false;
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const hoursAgo = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    return hoursAgo < 24;
  };

  const renderCard = (post: Post | undefined, index: number, className: string) => {
    if (!post) return null;
    const isVerified = isPostVerified(post);
    const isNew = isPostNew(post);

    return (
      <div
        className={`relative ring-4 ring-primary/20 hover:ring-primary/40 focus:ring-primary/40 transition rounded-xl backdrop-blur-sm shadow-lg ${className}`}
      >
        {isVerified && (
          <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
            <BadgeCheckIcon className='w-4 h-4 mr-1' />
            Verificat
          </Badge>
        )}
        {isNew && (
          <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
            Nou
          </Badge>
        )}
        <Card
          key={post.id}
          className='h-full relative bg-cover bg-center cursor-default'
          style={{ backgroundImage: `url(${post.images[0]})` }}
        >
          <div className='absolute bottom-2 right-2 flex gap-2 z-20'>
            <ShareButton
              href={`/categorii/auto/${reverseCategoryMapping[post.category as keyof typeof reverseCategoryMapping]}/${post.id}`}
            />
            <Link href={`/categorii/auto/${reverseCategoryMapping[post.category as keyof typeof reverseCategoryMapping]}/${post.id}`}>
              <Button variant='outline' className='bg-white/80 dark:bg-black/80 text-black dark:text-white'>
                Detalii <ArrowRightIcon className='w-4 h-4 ml-1' />
              </Button>
            </Link>
          </div>
          <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
            <CardTitle className='text-white dark:text-black line-clamp-2'>{post.title}</CardTitle>
            <CardDescription className='text-white dark:text-black'>
              <div className='line-clamp-4' dangerouslySetInnerHTML={{ __html: sanitizedDescs[index] || '' }} />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  };

  return (
    <section className='w-full'>
      <div className='w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        <h2 className='text-2xl font-bold text-center sm:text-end text-secondary'>{posts.length > 0 ? title : ''}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-5 gap-4 py-4'>
          {renderCard(posts[0], 0, 'sm:row-start-1 sm:row-end-3 col-span-full ')}
          {renderCard(posts[1], 1, 'sm:row-start-3 sm:row-end-6 ')}
          {renderCard(posts[2], 2, 'sm:row-start-3 sm:row-end-5 ')}
          {renderCard(posts[3], 3, 'relative ')}
          {renderCard(posts[4], 4, 'relative ')}
          {renderCard(posts[5], 5, 'col-span-full sm:col-start-2 ')}
        </div>
      </div>
    </section>
  );
}
