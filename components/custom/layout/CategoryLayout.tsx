'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { SidebarProvider } from '@/components/ui/sidebar';
import CategorySidebar from '@/components/custom/sidebar/CategorySidebar';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname !== '/categorii') return <>{children}</>;

  const childrenArray = React.Children.toArray(children);
  const mainContent = childrenArray[0] ?? null;
  const rest = childrenArray.slice(1);

  return (
    <SidebarProvider>
      <main className='flex flex-col flex-1'>
        <div className='flex w-full items-start h-full'>
          <div className='shrink-0'>
            <Suspense fallback={<LoadingIndicator />}>
              <CategorySidebar />
            </Suspense>
          </div>

          <div className='flex-1 flex flex-col justify-between gap-6 h-full'>
            <div className='flex flex-1'>{mainContent}</div>

            {rest.length > 0 && <div className='w-full'>{rest}</div>}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
