'use client';

import { Suspense, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import { Showcase } from './Showcase';
import { Preview } from './Preview';
import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/mockData';
const SellAutoForm = dynamic(() => import('@/components/custom/form/auto/SellAutoForm').then((mod) => ({ default: mod.SellAutoForm })), {
  ssr: false,
});
const BuyAutoForm = dynamic(() => import('@/components/custom/form/auto/BuyAutoForm').then((mod) => ({ default: mod.BuyAutoForm })), {
  ssr: false,
});
const RentAutoForm = dynamic(() => import('@/components/custom/form/auto/RentAutoForm').then((mod) => ({ default: mod.RentAutoForm })), {
  ssr: false,
});
const AuctionAutoForm = dynamic(
  () => import('@/components/custom/form/auto/AuctionAutoForm').then((mod) => ({ default: mod.AuctionAutoForm })),
  { ssr: false }
);

export type PreviewData = {
  title: string;
  description: string;
  price?: number;
  startingBid?: number;
  location: string;
  category: string;
  uploadedFiles: string[];
  duration?: string;
};

type CategoriesClientProps = {
  initialCategory?: string;
  initialSubcategory?: string;
};

const categoryMapping = {
  vanzare: 'sell',
  cumparare: 'buy',
  inchiriere: 'rent',
  licitatie: 'auction',
} as const;

export default function CategoriesClient({ initialCategory, initialSubcategory }: CategoriesClientProps) {
  const selectedCategory = (
    initialCategory && initialCategory in categoryMapping ? categoryMapping[initialCategory as keyof typeof categoryMapping] : 'sell'
  ) as 'sell' | 'buy' | 'rent' | 'auction';
  const selectedSubcategory = initialSubcategory ?? undefined;

  const [previewData, setPreviewData] = useState<PreviewData>({
    title: '',
    description: '',
    price: 0,
    location: '',
    category: 'sell',
    uploadedFiles: [],
  });

  const onPreviewUpdate = useCallback((data: PreviewData) => {
    setPreviewData(data);
  }, []);

  const getForm = () => {
    const props = { onPreviewUpdate, subcategory: selectedSubcategory };
    if (selectedSubcategory === 'auto') {
      switch (selectedCategory) {
        case 'sell':
          return <SellAutoForm {...props} />;
        case 'buy':
          return <BuyAutoForm {...props} />;
        case 'rent':
          return <RentAutoForm {...props} />;
        case 'auction':
          return <AuctionAutoForm {...props} />;
        default:
          return <SellAutoForm {...props} />;
      }
    } else {
      return <div className='text-center text-gray-500'>Formularul nu este disponibil pentru această subcategorie.</div>;
    }
  };

  return (
    <SidebarInset className='flex-1 overflow-auto'>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-1'>
        <SidebarTrigger className='-ml-1' />
        <Breadcrumbs
          items={[
            { label: 'Acasă', href: '/' },
            { label: 'Categorii' },
            ...(selectedSubcategory
              ? [
                  {
                    label: categories.find((c) => c.key === selectedCategory)?.label || '',
                    href: `/categorii?tip=${initialCategory}`,
                  },
                  { label: subcategories.find((s) => s.title.toLowerCase().replace(' ', '-') === selectedSubcategory)?.title || '' },
                ]
              : []),
          ]}
        />
      </header>
      <main className='flex flex-1 flex-col lg:flex-row gap-2 overflow-hidden'>
        <div className='flex-1 p-4 overflow-hidden'>
          {selectedSubcategory ? (
            <Card className='h-full overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg'>
              <CardHeader className='shrink-0'>
                <CardTitle className='text-2xl font-bold text-center'>
                  Formular pentru {categories.find((c) => c.key === selectedCategory)?.label} -{' '}
                  {subcategories.find((s) => s.title.toLowerCase().replace(' ', '-') === selectedSubcategory)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-1 overflow-auto'>
                <Suspense fallback={<div>Loading...</div>}>{getForm()}</Suspense>
              </CardContent>
            </Card>
          ) : (
            <Showcase category={selectedCategory} />
          )}
        </div>
        {selectedSubcategory && (
          <div className='flex-1 p-4 overflow-hidden'>
            <div className='h-full'>
              <Preview {...previewData} price={previewData.price || previewData.startingBid || 0} />
            </div>
          </div>
        )}
      </main>
    </SidebarInset>
  );
}
