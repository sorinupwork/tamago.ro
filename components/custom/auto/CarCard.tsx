'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryLabels } from '@/lib/categories';
import type { Car } from '@/lib/types';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const href = `/categorii/auto/${car.category}/${car.id}${queryString ? '?' + queryString : ''}`;

  return (
    <Link key={car.id} href={href} className='cursor-default'>
      <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102 animate-in fade-in-0 slide-in-from-bottom-4'>
        <Image src={car.images[0]} alt={car.title} width={400} height={192} className='w-full h-48 object-cover' />
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <CardTitle className='text-lg font-semibold line-clamp-2'>{car.title}</CardTitle>
            <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='ml-2'>
              {categoryLabels[car.category as keyof typeof categoryLabels]}
            </Badge>
          </div>
          <p className='text-2xl font-bold text-green-600'>${car.price.toLocaleString('en-US')}</p>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='space-y-1 text-sm text-muted-foreground'>
            <p>
              An: {car.year} | Kilometraj: {car.mileage.toLocaleString('en-US')} km
            </p>
            <p>
              Combustibil: {car.fuel} | Transmisie: {car.transmission}
            </p>
            <p>
              Locație: {car.location} | Caroserie: {car.bodyType}
            </p>
            <p className='text-xs'>
              Culoare: {car.color} | Vânzător: {car.sellerType}
            </p>
          </div>
          <p className='text-xs text-muted-foreground mt-2'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
