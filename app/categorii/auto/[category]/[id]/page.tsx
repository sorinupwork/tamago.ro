'use client';

import { useMemo, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'; // Added CarouselApi
import { Heart, Phone, Mail, MessageCircle } from 'lucide-react';
import { mockCars } from '@/lib/mockData';

export default function CarDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const id = parseInt(params.id as string);

  const car = useMemo(() => mockCars.find((c) => c.id === id && c.category === category) || null, [id, category]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleNext = () => {
    if (api && !api.canScrollNext() && isMobile) {
      if (detailsRef.current) {
        const rect = detailsRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY - 60; // offset for nav height
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      api?.scrollNext();
    }
  };

  const handlePrev = () => {
    if (api && !api.canScrollPrev() && isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      api?.scrollPrev();
    }
  };

  if (!car) return <div>Produsul nu a fost găsit</div>;

  const isAuction = car.category === 'auction';

  const handleBid = () => {
    alert(`Licitație plasată: $${bidAmount}`);
  };

  return (
    <div className='container mx-auto max-w-7xl'>
      <div className='flex items-center gap-4 p-4'>
        <Breadcrumbs
          items={[
            { label: 'Acasă', href: '/' },
            { label: 'Categorii', href: '/categorii' },
            { label: 'Auto', href: '/categorii/auto' },
            { label: car.title },
          ]}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'>
        <Card ref={carouselRef} className='relative p-0 h-fit'>
          <Carousel
            opts={{
              align: 'center',
              loop: false,
            }}
            orientation='vertical'
            className='w-full h-full overflow-visible'
            setApi={setApi}
            onNext={handleNext}
            onPrev={handlePrev}
          >
            <CarouselContent className='-mt-1 h-[777px] gap-2 p-2'>
              {car.images.map((image, index) => (
                <CarouselItem key={index} className='relative basis-1/2'>
                  <Image src={image} alt={`${car.title} ${index + 1}`} fill className='object-cover rounded-xl' />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2' />
            <CarouselNext className='absolute left-full top-1/2 -translate-y-1/2' />
          </Carousel>
        </Card>

        <div className='space-y-6'>
          <Card ref={detailsRef}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-3xl font-bold'>{car.title}</CardTitle>
                  <p className='text-lg text-muted-foreground'>
                    {car.brand} - {car.year}
                  </p>
                </div>
                <Button variant='ghost' onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant={isAuction ? 'destructive' : 'secondary'}>
                  {car.category === 'sell'
                    ? 'Vânzare'
                    : car.category === 'buy'
                    ? 'Cumpărare'
                    : car.category === 'rent'
                    ? 'Închiriere'
                    : 'Licitație'}
                </Badge>
                {isAuction && <Badge variant='outline'>Licitație Activ</Badge>}
              </div>
              <p className='text-4xl font-bold text-green-600'>${car.price.toLocaleString('en-US')}</p>
              {isAuction && <p className='text-sm text-muted-foreground'>Licitație curentă</p>}
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <p>
                  <strong>An:</strong> {car.year}
                </p>
                <p>
                  <strong>Marcă:</strong> {car.brand}
                </p>
                <p>
                  <strong>Kilometraj:</strong> {car.mileage.toLocaleString('en-US')} km
                </p>
                <p>
                  <strong>Combustibil:</strong> {car.fuel}
                </p>
                <p>
                  <strong>Transmisie:</strong> {car.transmission}
                </p>
                <p>
                  <strong>Locație:</strong> {car.location}
                </p>
                <p>
                  <strong>Tip Caroserie:</strong> {car.bodyType}
                </p>
                <p>
                  <strong>Culoare:</strong> {car.color}
                </p>
                <p>
                  <strong>Tip Vânzător:</strong> {car.sellerType}
                </p>
              </div>
              <p className='text-xs text-muted-foreground mt-4'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
            </CardContent>
          </Card>

          {isAuction && (
            <Card>
              <CardHeader>
                <CardTitle>Licitație</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>
                  Licitație curentă: <strong>${car.price.toLocaleString('en-US')}</strong>
                </p>
                <div className='flex gap-2'>
                  <Input type='number' placeholder='Suma licitației' value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                  <Button onClick={handleBid}>Licitează</Button>
                </div>
                <p className='text-xs text-muted-foreground'>Licitația se încheie în 24h</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Descriere</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{car.description || 'Descriere detaliată a produsului. Acest vehicul este în stare excelentă și gata pentru drum.'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caracteristici</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc list-inside space-y-1'>
                {car.features?.map((feature, index) => <li key={index}>{feature}</li>) || (
                  <>
                    <li>Stare excelentă</li>
                    <li>Service complet</li>
                    <li>Garanție inclusă</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contactează Vânzătorul</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4' />
                <span>{car.contactPhone}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <span>{car.contactEmail}</span>
              </div>
              <div className='flex gap-2'>
                <Button asChild>
                  <a href={`tel:${car.contactPhone}`}>
                    <Phone className='mr-2 h-4 w-4' />
                    Sună
                  </a>
                </Button>
                <Button asChild variant='outline'>
                  <a href={`mailto:${car.contactEmail}`}>
                    <Mail className='mr-2 h-4 w-4' />
                    Email
                  </a>
                </Button>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant='secondary'>
                      <MessageCircle className='mr-2 h-4 w-4' />
                      Chat
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Chat cu Vânzătorul</DrawerTitle>
                      <DrawerDescription>Trimite un mesaj direct vânzătorului pentru întrebări despre {car.title}.</DrawerDescription>
                    </DrawerHeader>
                    <div className='p-4'>
                      <Textarea placeholder='Scrie mesajul tău aici...' className='min-h-32' />
                    </div>
                    <DrawerFooter>
                      <Button>Trimite Mesaj</Button>
                      <DrawerClose asChild>
                        <Button variant='outline'>Închide</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
