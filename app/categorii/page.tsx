import { Suspense } from 'react';
import CategoriesClient from '@/components/custom/categories/CategoriesClient';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export default function CategoryPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const tip = typeof searchParams.tip === 'string' ? searchParams.tip : undefined;
  const subcategorie = typeof searchParams.subcategorie === 'string' ? searchParams.subcategorie : undefined;

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoriesClient initialCategory={tip} initialSubcategory={subcategorie} />
    </Suspense>
  );
}
