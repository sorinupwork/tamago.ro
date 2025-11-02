import { Suspense } from 'react';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export default function CategoriiLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      {children}
    </Suspense>
  );
}
