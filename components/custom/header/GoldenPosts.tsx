import { Car, Home, Briefcase, Smartphone, Zap, Wrench, BadgeCheckIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function GoldenPosts() {
  const Icon5 = posts[5].icon;
  const Icon4 = posts[4].icon;
  const Icon0 = posts[0].icon;
  const Icon1 = posts[1].icon;
  const Icon2 = posts[2].icon;
  const Icon3 = posts[3].icon;

  return (
    <section className='py-8 w-full'>
      <h2 className='text-2xl font-bold text-center mb-6 text-secondary'>Anunțuri Verificate</h2>
      <div className='w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'>
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-4 gap-6'>
          <div className='relative sm:row-start-1 sm:row-end-2 col-span-full'>
            {posts[5].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[5].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10'>
                Nou
              </Badge>
            )}
            <Card key={posts[5].id} className='h-full'>
              <CardHeader>
                <CardTitle>{posts[5].title}</CardTitle>
                <CardDescription>{posts[5].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Icon5 className='w-16 h-16 mx-auto text-primary' />
              </CardContent>
            </Card>
          </div>

          <div className='relative sm:row-start-2 sm:row-end-5'>
            {posts[4].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[4].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10'>
                Nou
              </Badge>
            )}
            <Card key={posts[4].id} className='h-full'>
              <CardHeader>
                <CardTitle>{posts[4].title}</CardTitle>
                <CardDescription>{posts[4].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Icon4 className='w-16 h-16 mx-auto text-primary' />
              </CardContent>
            </Card>
          </div>

          <div className='relative sm:row-start-2 sm:row-end-4'>
            {posts[0].verified && (
              <Badge variant='secondary' className='absolute -top-2 left-2 z-10'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            )}
            {posts[0].isNew && (
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10'>
                Nou
              </Badge>
            )}
            <Card key={posts[0].id} className='h-full'>
              <CardHeader>
                <CardTitle>{posts[0].title}</CardTitle>
                <CardDescription>{posts[0].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Icon0 className='w-16 h-16 mx-auto text-primary' />
              </CardContent>
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
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10'>
                Nou
              </Badge>
            )}
            <Card key={posts[1].id} className='h-full'>
              <CardHeader>
                <CardTitle>{posts[1].title}</CardTitle>
                <CardDescription>{posts[1].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Icon1 className='w-16 h-16 mx-auto text-primary' />
              </CardContent>
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
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10'>
                Nou
              </Badge>
            )}
            <Card key={posts[2].id} className='h-full'>
              <CardHeader>
                <CardTitle>{posts[2].title}</CardTitle>
                <CardDescription>{posts[2].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Icon2 className='w-16 h-16 mx-auto text-primary' />
              </CardContent>
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
              <Badge variant='destructive' className='absolute -top-2 right-2 z-10'>
                Nou
              </Badge>
            )}
            <Card key={posts[3].id} className='h-full'>
              <CardHeader>
                <CardTitle>{posts[3].title}</CardTitle>
                <CardDescription>{posts[3].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Icon3 className='w-16 h-16 mx-auto text-primary' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
