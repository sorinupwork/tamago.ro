import { Car, Home, Briefcase, Smartphone, Zap, Wrench, BadgeCheckIcon } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const posts = [
  {
    id: 1,
    title: 'Mașină de vânzare - BMW X3',
    desc: 'Mașină second-hand verificată, preț negociabil.',
    icon: Car,
    verified: true,
    isNew: true,
  },
  {
    id: 2,
    title: 'Apartament în București',
    desc: 'Apartament 3 camere, verificat și promovat.',
    icon: Home,
    verified: true,
    isNew: false,
  },
  {
    id: 3,
    title: 'Job Freelance - Dezvoltator Web',
    desc: 'Oportunitate verificată pentru dezvoltatori.',
    icon: Briefcase,
    verified: true,
    isNew: true,
  },
  {
    id: 4,
    title: 'Telefon Samsung Galaxy',
    desc: 'Electronic nou, verificat și la preț bun.',
    icon: Smartphone,
    verified: true,
    isNew: false,
  },
  {
    id: 5,
    title: 'Frigider LG',
    desc: 'Electrocasnic verificat, promoție specială.',
    icon: Zap,
    verified: true,
    isNew: true,
  },
  {
    id: 6,
    title: 'Piese Auto pentru Dacia',
    desc: 'Piese originale, verificate.',
    icon: Wrench,
    verified: true,
    isNew: false,
  },
];

const imageUrls: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  2: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  3: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  4: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  5: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  6: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
};

export default function GoldenPosts() {
  return (
    <section className='py-8 w-full'>
      <h2 className='text-2xl font-bold text-center mb-6 text-secondary'>Anunțuri Verificate</h2>
      <div className='w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-5 gap-6'>
          <div className='relative sm:row-start-1 sm:row-end-3 col-span-full'>
            {posts[5].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[5].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={posts[5].id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${imageUrls[posts[5].id]})` }}
            >
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{posts[5].title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{posts[5].desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative sm:row-start-3 sm:row-end-6'>
            {posts[4].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[4].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={posts[4].id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${imageUrls[posts[4].id]})` }}
            >
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{posts[4].title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{posts[4].desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative sm:row-start-3 sm:row-end-5'>
            {posts[0].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[0].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={posts[0].id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${imageUrls[posts[0].id]})` }}
            >
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{posts[0].title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{posts[0].desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative'>
            {posts[1].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[1].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={posts[1].id}
              className='relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${imageUrls[posts[1].id]})` }}
            >
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{posts[1].title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{posts[1].desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative'>
            {posts[2].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[2].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={posts[2].id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${imageUrls[posts[2].id]})` }}
            >
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{posts[2].title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{posts[2].desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='relative col-span-full sm:col-start-2'>
            {posts[3].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[3].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10 wiggle'>
                Nou
              </Badge>
            )}
            <Card
              key={posts[3].id}
              className='h-full relative bg-cover bg-center pinch cursor-pointer'
              style={{ backgroundImage: `url(${imageUrls[posts[3].id]})` }}
            >
              <CardHeader className='relative z-10 px-6 py-4 bg-black/50 dark:bg-white/50'>
                <CardTitle className='text-white dark:text-black'>{posts[3].title}</CardTitle>
                <CardDescription className='text-white dark:text-black'>{posts[3].desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
