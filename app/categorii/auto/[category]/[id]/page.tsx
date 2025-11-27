import { notFound } from 'next/navigation';

import CarDetailClient from '@/components/custom/auto/CarDetailClient';
import { getCarById, getSimilarCars } from '@/actions/auto/actions';
import type { Car } from '@/lib/types';

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

  const [car, similarCars] = await Promise.all([
    getCarById(category, id),
    getSimilarCars(category, id, 3),
  ]);

  if (!car) {
    notFound();
  }

  return <CarDetailClient car={car} similarCars={similarCars} queryString={queryString} />;
}
