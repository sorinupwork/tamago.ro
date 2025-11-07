import { Suspense } from 'react';
import CategoriesClient from '@/components/custom/categories/CategoriesClient';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export const dynamic = 'force-dynamic';

export default function CategoryPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoriesClient />
    </Suspense>
  );
}
