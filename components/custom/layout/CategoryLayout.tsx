'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CategorySidebar } from '@/components/custom/sidebar/CategorySidebar';

export function CategoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname !== '/categorii') return <>{children}</>;

  const childrenArray = React.Children.toArray(children);
  const mainContent = childrenArray[0] ?? null;
  const rest = childrenArray.slice(1);

  return (
    <SidebarProvider>
      <main className='flex flex-col flex-1'>
        <div className='w-full'>
          <div className='flex w-full items-start'>
            <div className='shrink-0'>
              <CategorySidebar />
            </div>

            <div className='flex-1 flex flex-col gap-6'>
              <div>{mainContent}</div>

              {rest.length > 0 && <div className='w-full'>{rest}</div>}
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
