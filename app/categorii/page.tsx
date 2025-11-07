import { Suspense } from 'react';
import CategoriesClient from '@/components/custom/categories/CategoriesClient';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams?: { tip?: string; subcategory?: string };
};

export default function CategoryPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoriesClient initialCategory={searchParams?.tip ?? undefined} initialSubcategory={searchParams?.subcategory ?? undefined} />
    </Suspense>
  );
}
