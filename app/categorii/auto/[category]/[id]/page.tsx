import { notFound } from 'next/navigation';

import CarDetailClient from '@/components/custom/auto/CarDetailClient';
import { getCarById, getSimilarCars } from '@/actions/auto/actions';
import type { Car, RawCarDoc } from '@/lib/types';

function mapRawCarToCarType(doc: RawCarDoc, category: 'oferta' | 'cerere' | 'inchiriere' | 'licitatie'): Car {
  return {
    id: doc._id.toString(),
    title: doc.title || '',
    price: String(doc.price || '0'),
    currency: doc.currency || 'RON',
    period: doc.period || '',
    startDate: doc.startDate || '',
    endDate: doc.endDate || '',
    year: parseInt(doc.year || '2020') || 2020,
    brand: doc.brand || 'Unknown',
    category: category === 'oferta' ? 'sell' : category === 'cerere' ? 'buy' : category === 'inchiriere' ? 'rent' : 'auction',
    mileage: parseInt(doc.mileage || '0') || 0,
    fuel: doc.fuel || 'Petrol',
    transmission: doc.transmission || 'Manual',
    location: typeof doc.location === 'string' ? doc.location : doc.location?.address || '',
    images:
      doc.images && doc.images.length > 0
        ? doc.images
        : doc.uploadedFiles && doc.uploadedFiles.length > 0
          ? doc.uploadedFiles
          : ['/placeholder.svg'],
    dateAdded: doc.dateAdded || new Date().toISOString(),
    sellerType: (doc.sellerType as 'private' | 'firm') || 'private',
    contactPhone: doc.contactPhone || doc.driverTelephone || '123456789',
    contactEmail: doc.contactEmail || 'email@example.com',
    bodyType: doc.carType || 'Sedan',
    color: doc.color || 'Alb',
    engineCapacity: doc.engineCapacity ? parseFloat(String(doc.engineCapacity)) : undefined,
    horsepower: doc.horsepower ? parseInt(String(doc.horsepower)) : doc.horsePower ? parseInt(String(doc.horsePower)) : undefined,
    status: doc.status || 'used',
    description: doc.description,
    features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
    withDriver: doc.withDriver || false,
    driverName: doc.driverName || '',
    driverContact: doc.driverContact || '',
    driverTelephone: doc.driverTelephone || '',
    options: doc.options || [],
    minPrice: doc.minPrice,
    maxPrice: doc.maxPrice,
    userId: doc.userId ? doc.userId.toString() : '',
    lat: typeof doc.location === 'object' && doc.location?.lat ? doc.location.lat : 44.4268,
    lng: typeof doc.location === 'object' && doc.location?.lng ? doc.location.lng : 26.1025,
    traction: doc.traction || undefined,
    history: doc.history || [],
  };
}

export default async function CarDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category, id } = await params;
  const resolvedSearchParams = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams).reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.join(',');
        } else if (value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  const validCategories = ['oferta', 'cerere', 'inchiriere', 'licitatie'];
  if (!validCategories.includes(category)) {
    notFound();
  }

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    notFound();
  }

  const [rawCar, similarRawCars] = await Promise.all([getCarById(category, id), getSimilarCars(category, id, 3)]);

  if (!rawCar) {
    notFound();
  }

  const car = mapRawCarToCarType(rawCar, category as 'oferta' | 'cerere' | 'inchiriere' | 'licitatie');
  const similarCars = similarRawCars.map((doc) => mapRawCarToCarType(doc, category as 'oferta' | 'cerere' | 'inchiriere' | 'licitatie'));

  return <CarDetailClient car={car} similarCars={similarCars} queryString={queryString} />;
}
