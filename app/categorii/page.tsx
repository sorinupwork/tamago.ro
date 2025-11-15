import { Suspense } from 'react';

import CategoriesClient from '@/components/custom/categories/CategoriesClient';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export default async function CategoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tip = typeof params.tip === 'string' ? params.tip : undefined;
  const subcategorie = typeof params.subcategorie === 'string' ? params.subcategorie : undefined;

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoriesClient initialCategory={tip} initialSubcategory={subcategorie} />
    </Suspense>
  );
}
