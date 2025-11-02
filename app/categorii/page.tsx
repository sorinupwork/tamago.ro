import { Suspense } from 'react';
import CategoriesClient from '@/components/custom/categories/CategoriesClient';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

type PageProps = {
  searchParams?: { category?: string; subcategory?: string };
};

export default function CategoryPage({ searchParams }: PageProps) {
  const params = searchParams ?? {};
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoriesClient initialCategory={params.category} initialSubcategory={params.subcategory} />
    </Suspense>
  );
}
