'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { mockCars } from '@/lib/mockData';

export default function CarDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const id = parseInt(params.id as string);

  const car = useMemo(() => mockCars.find((c) => c.id === id && c.category === category) || null, [id, category]);

  if (!car) return <div>Car not found</div>;

  return (
    <div className='container mx-auto p-4'>
      {/* Breadcrumbs */}
      <Breadcrumb className='mb-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Acasă</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/categorii'>Categorii</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/categorii/auto'>Auto</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{car.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className='max-w-4xl mx-auto'>
        {/* Carousel for images */}
        <Carousel className='w-full'>
          <CarouselContent>
            {car.images.map((image, index) => (
              <CarouselItem key={index}>
                <img src={image} alt={`${car.title} ${index + 1}`} className='w-full h-64 object-cover' />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>{car.title}</CardTitle>
          <p className='text-4xl font-bold text-green-600'>${car.price.toLocaleString('en-US')}</p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
              <strong>Categorie:</strong>{' '}
              {car.category === 'sell'
                ? 'Vânzare'
                : car.category === 'buy'
                ? 'Cumpărare'
                : car.category === 'rent'
                ? 'Închiriere'
                : 'Licitație'}
            </p>
            <p>
              <strong>Tip Vânzător:</strong> {car.sellerType}
            </p>
          </div>
          <p className='text-sm text-muted-foreground'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
          <div className='border-t pt-4'>
            <h3 className='text-xl font-semibold mb-2'>Contactează Vânzătorul</h3>
            <p>
              <strong>Telefon:</strong> {car.contactPhone}
            </p>
            <p>
              <strong>Email:</strong> {car.contactEmail}
            </p>
            <div className='flex gap-2 mt-2'>
              <Button asChild>
                <a href={`tel:${car.contactPhone}`}>Sună</a>
              </Button>
              <Button asChild variant='outline'>
                <a href={`mailto:${car.contactEmail}`}>Trimite Email</a>
              </Button>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant='secondary'>Chat cu Vânzătorul</Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
