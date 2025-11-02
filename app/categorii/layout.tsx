import { Suspense } from 'react';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';
import { CategoryLayout } from '@/components/custom/sidebar/CategorySidebar';

export default function CategoriiLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CategoryLayout>{children}</CategoryLayout>
    </Suspense>
  );
}
