import { notFound } from 'next/navigation';

import CarDetailClient from '@/components/custom/auto/CarDetailClient';
import { getCarById, getSimilarCars } from '@/actions/auto/actions';
import { getUserById } from '@/actions/auth/actions';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

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

  const [car, similarCars, session] = await Promise.all([
    getCarById(category, id),
    getSimilarCars(category, id, 4),
    auth.api.getSession({ headers: await headers() }).catch(() => null),
  ]);

  if (!car) {
    notFound();
  }

  const sellerUser = car.userId ? await getUserById(car.userId).catch(() => null) : null;

  return (
    <CarDetailClient
      car={car}
      sellerUser={sellerUser}
      similarCars={similarCars}
      queryString={queryString}
      currentUser={session?.user || null}
    />
  );
}
