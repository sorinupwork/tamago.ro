'use client';

import { Suspense, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import { Showcase } from './Showcase';
import { Preview } from './Preview';
import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/subcategories';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingIndicator from '../loading/LoadingIndicator';
import { SellAutoForm } from '@/components/custom/form/auto/SellAutoForm';
import { BuyAutoForm } from '@/components/custom/form/auto/BuyAutoForm';
import { RentAutoForm } from '@/components/custom/form/auto/RentAutoForm';
import { AuctionAutoForm } from '@/components/custom/form/auto/AuctionAutoForm';

export type PreviewData = {
  title: string;
  description: string;
  price: string;
  currency: string;
  startingBid?: number;
  location: string;
  category: string;
  uploadedFiles: string[];
  duration?: string;
  fuel: string;
  mileage: string;
  year: string;
  features: string;
  options: string[];
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
  const searchParams = useSearchParams();
  const tipParam = useMemo(() => searchParams?.get('tip') ?? initialCategory ?? undefined, [searchParams, initialCategory]);
  const subParam = useMemo(() => searchParams?.get('subcategorie') ?? initialSubcategory ?? undefined, [searchParams, initialSubcategory]);

  const selectedCategory = useMemo(() => {
    return tipParam && tipParam in categoryMapping
      ? (categoryMapping[tipParam as keyof typeof categoryMapping] as 'sell' | 'buy' | 'rent' | 'auction')
      : 'sell';
  }, [tipParam]);

  const selectedSubcategory = subParam ?? undefined;

  const [previewData, setPreviewData] = useState<PreviewData>({
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    location: '',
    category: 'sell',
    uploadedFiles: [],
    fuel: '',
    mileage: '',
    year: '',
    features: '',
    options: [],
  });

  const onPreviewUpdate = useCallback((data: PreviewData) => {
    setPreviewData(data);
  }, []);

  const getForm = () => {
    const props = { onPreviewUpdate, subcategory: selectedSubcategory };
    if (selectedSubcategory === 'auto') {
      switch (selectedCategory) {
        case 'sell':
          return (
            <Suspense fallback={<LoadingIndicator />}>
              <SellAutoForm {...props} />
            </Suspense>
          );
        case 'buy':
          return (
            <Suspense fallback={<LoadingIndicator />}>
              <BuyAutoForm {...props} />
            </Suspense>
          );
        case 'rent':
          return (
            <Suspense fallback={<LoadingIndicator />}>
              <RentAutoForm {...props} />
            </Suspense>
          );
        case 'auction':
          return (
            <Suspense fallback={<LoadingIndicator />}>
              <AuctionAutoForm {...props} />
            </Suspense>
          );
        default:
          return (
            <Suspense fallback={<LoadingIndicator />}>
              <SellAutoForm {...props} />
            </Suspense>
          );
      }
    } else {
      return <div className='text-center text-gray-500'>Formularul nu este disponibil pentru această subcategorie.</div>;
    }
  };

  return (
    <SidebarInset className='flex-1 overflow-x-clip'>
      <header className='sticky top-14 z-10 bg-background border-b flex h-16 items-center gap-2 px-2 overflow-x-hidden'>
        <SidebarTrigger className='-ml-1' />
        <Breadcrumbs
          items={[
            { label: 'Acasă', href: '/' },
            { label: 'Categorii' },
            ...(selectedSubcategory
              ? [
                  {
                    label: categories.find((c) => c.key === selectedCategory)?.label || '',
                    href: `/categorii?tip=${tipParam ?? ''}`,
                  },
                  { label: subcategories.find((s) => s.title.toLowerCase().replace(' ', '-') === selectedSubcategory)?.title || '' },
                ]
              : []),
          ]}
          className='wrap-break-word overflow-hidden'
        />
      </header>
      <ScrollArea className='flex-1 overflow-x-hidden'>
        <main className='flex flex-1 flex-col lg:flex-row gap-2 overflow-auto overflow-x-hidden'>
          <div className='flex-1 overflow-visible min-w-0'>
            {selectedSubcategory ? (
              <Card className='overflow-hidden max-w-full animate-in fade-in-0 slide-in-from-bottom-4 shadow-md w-full'>
                <CardHeader className='shrink-0'>
                  <CardTitle className='text-2xl font-bold text-center'>
                    Formular pentru {categories.find((c) => c.key === selectedCategory)?.label} -{' '}
                    {subcategories.find((s) => s.title.toLowerCase().replace(' ', '-') === selectedSubcategory)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-1 overflow-auto min-w-0'>
                  <Suspense fallback={<LoadingIndicator />}>{getForm()}</Suspense>
                </CardContent>
              </Card>
            ) : (
              <div className='overflow-hidden overflow-x-hidden max-w-full animate-in fade-in-0 slide-in-from-bottom-4 shadow-md w-full'>
                <Showcase category={selectedCategory} />
              </div>
            )}
          </div>
          {selectedSubcategory === 'auto' && (
            <div className='flex-1 overflow-visible w-full md:w-auto min-w-0'>
              <div className='w-full min-w-0'>
                <Preview {...previewData} price={previewData.price} />
              </div>
            </div>
          )}
        </main>
      </ScrollArea>
    </SidebarInset>
  );
}
