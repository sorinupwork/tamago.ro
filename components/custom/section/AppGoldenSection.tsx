import { BadgeCheckIcon } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/lib/types';

type AppGoldenSectionProps = {
  title: string;
  posts: Post[];
};

export default function AppGoldenSection({ title, posts }: AppGoldenSectionProps) {
  const displayedPosts = posts.slice(0, 6);

  return (
    <section className='py-8 w-full'>
      <div className='w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        <h2 className='text-2xl font-bold text-end mb-6 text-secondary'>{title}</h2>
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
              className='h-full relative bg-cover bg-center pinch'
              style={{ backgroundImage: `url(${displayedPosts[5]?.imageUrl})` }}
            >
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
              className='h-full relative bg-cover bg-center pinch'
              style={{ backgroundImage: `url(${displayedPosts[4]?.imageUrl})` }}
            >
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
              className='h-full relative bg-cover bg-center pinch'
              style={{ backgroundImage: `url(${displayedPosts[0]?.imageUrl})` }}
            >
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
              className='relative bg-cover bg-center pinch'
              style={{ backgroundImage: `url(${displayedPosts[1]?.imageUrl})` }}
            >
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
              className='h-full relative bg-cover bg-center pinch'
              style={{ backgroundImage: `url(${displayedPosts[2]?.imageUrl})` }}
            >
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
              className='h-full relative bg-cover bg-center pinch'
              style={{ backgroundImage: `url(${displayedPosts[3]?.imageUrl})` }}
            >
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
