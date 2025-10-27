import { Car, Home, Briefcase, Smartphone, Zap, Wrench } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const posts = [
  {
    id: 1,
    title: 'Mașină de vânzare - BMW X3',
    desc: 'Mașină second-hand verificată, preț negociabil.',
    icon: Car,
  },
  {
    id: 2,
    title: 'Apartament în București',
    desc: 'Apartament 3 camere, verificat și promovat.',
    icon: Home,
  },
  {
    id: 3,
    title: 'Job Freelance - Dezvoltator Web',
    desc: 'Oportunitate verificată pentru dezvoltatori.',
    icon: Briefcase,
  },
  {
    id: 4,
    title: 'Telefon Samsung Galaxy',
    desc: 'Electronic nou, verificat și la preț bun.',
    icon: Smartphone,
  },
  {
    id: 5,
    title: 'Frigider LG',
    desc: 'Electrocasnic verificat, promoție specială.',
    icon: Zap,
  },
  {
    id: 6,
    title: 'Piese Auto pentru Dacia',
    desc: 'Piese originale, verificate.',
    icon: Wrench,
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
    <section className='py-8 w-full max-w-7xl mx-auto'>
      <h2 className='text-2xl font-bold text-center mb-6 text-secondary'>Anunțuri Promovate Verificate</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-6 min-h-[600px]'>
        <Card key={posts[5].id} className='row-start-1 row-end-2 col-span-full'>
          <CardHeader>
            <CardTitle>{posts[5].title}</CardTitle>
            <CardDescription>{posts[5].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Icon5 className='w-16 h-16 mx-auto text-primary' />
          </CardContent>
        </Card>

        <Card key={posts[4].id} className='row-start-2 row-end-5'>
          <CardHeader>
            <CardTitle>{posts[4].title}</CardTitle>
            <CardDescription>{posts[4].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Icon4 className='w-16 h-16 mx-auto text-primary' />
          </CardContent>
        </Card>

        <Card key={posts[0].id} className='row-start-2 row-end-4'>
          <CardHeader>
            <CardTitle>{posts[0].title}</CardTitle>
            <CardDescription>{posts[0].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Icon0 className='w-16 h-16 mx-auto text-primary' />
          </CardContent>
        </Card>

        <Card key={posts[1].id} className=''>
          <CardHeader>
            <CardTitle>{posts[1].title}</CardTitle>
            <CardDescription>{posts[1].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Icon1 className='w-16 h-16 mx-auto text-primary' />
          </CardContent>
        </Card>

        <Card key={posts[2].id} className=''>
          <CardHeader>
            <CardTitle>{posts[2].title}</CardTitle>
            <CardDescription>{posts[2].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Icon2 className='w-16 h-16 mx-auto text-primary' />
          </CardContent>
        </Card>

        <Card key={posts[3].id} className='col-span-full col-start-2'>
          <CardHeader>
            <CardTitle>{posts[3].title}</CardTitle>
            <CardDescription>{posts[3].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Icon3 className='w-16 h-16 mx-auto text-primary' />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
