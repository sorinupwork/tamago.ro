import { Suspense } from 'react';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';
import CategoriesClient from '@/components/custom/categories/CategoriesClient';

type PageProps = {
  searchParams?: { tip?: string; subcategory?: string };
};

export default function CategoryPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoriesClient initialCategory={searchParams?.tip} initialSubcategory={searchParams?.subcategory} />
    </Suspense>
  );
}
