'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/custom/empty/Empty';
import Showcase from './Showcase';
import Preview from './Preview';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import SellAutoForm from '@/components/custom/form/auto/SellAutoForm';
import BuyAutoForm from '@/components/custom/form/auto/BuyAutoForm';
import RentAutoForm from '@/components/custom/form/auto/RentAutoForm';
import AuctionAutoForm from '@/components/custom/form/auto/AuctionAutoForm';
import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/subcategories';

export type PreviewData = {
  category: string;
  title: string;
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  period?: string;
  startingBid?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  location: string;
  description: string;
  fuel: string;
  mileage?: string;
  minMileage?: string;
  maxMileage?: string;
  year?: string;
  minYear?: string;
  maxYear?: string;
  status?: string;
  brand?: string;
  color?: string;
  engineCapacity?: string;
  minEngineCapacity?: string;
  maxEngineCapacity?: string;
  carType?: string;
  horsePower?: string;
  transmission?: string;
  traction?: string;
  history?: { title: string; description?: string; icon?: string }[];
  features: string;
  options: string[];
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  uploadedFiles: string[];
};

type CategoriesClientProps = {
  initialCategory?: string;
  initialSubcategory?: string;
};

const categoryMapping = {
  oferta: 'sell',
  cerere: 'buy',
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

  const [previewData, setPreviewData] = useState<PreviewData>(() => ({
    title: '',
    description: '',
    price: '',
    minPrice: '',
    maxPrice: '',
    currency: 'EUR',
    startingBid: '',
    location: '',
    category: selectedCategory,
    uploadedFiles: [],
    fuel: '',
    status: '',
    mileage: '',
    minMileage: '',
    maxMileage: '',
    year: '',
    minYear: '',
    maxYear: '',
    features: '',
    options: [],
    traction: undefined,
  }));

  const onPreviewUpdate = useCallback((data: PreviewData) => {
    setPreviewData(data);
  }, []);

  const getForm = () => {
    const props = { onPreviewUpdate, subcategory: selectedSubcategory };
    if (selectedSubcategory === 'auto') {
      switch (selectedCategory) {
        case 'sell':
          return <SellAutoForm key={selectedCategory} {...props} />;
        case 'buy':
          return <BuyAutoForm key={selectedCategory} {...props} />;
        case 'rent':
          return <RentAutoForm key={selectedCategory} {...props} />;
        case 'auction':
          return <AuctionAutoForm key={selectedCategory} {...props} />;
        default:
          return <SellAutoForm {...props} />;
      }
    } else {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Formularul nu este disponibil</EmptyTitle>
            <EmptyDescription>pentru această subcategorie.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
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

      <div className='flex lg:items-start flex-1 flex-col lg:flex-row'>
        <div className='flex-1'>
          {selectedSubcategory ? (
            <div className='p-4'>
              <Card className='overflow-hidden max-w-full animate-in fade-in-0 slide-in-from-bottom-4 shadow-md w-full'>
                <CardHeader className='shrink-0'>
                  <CardTitle className='text-2xl font-bold text-center'>
                    Formular {categories.find((c) => c.key === selectedCategory)?.label} -{' '}
                    {subcategories.find((s) => s.title.toLowerCase().replace(' ', '-') === selectedSubcategory)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-1 min-w-0'>{getForm()}</CardContent>
              </Card>
            </div>
          ) : (
            <div className='overflow-hidden overflow-x-hidden max-w-full animate-in fade-in-0 slide-in-from-bottom-4 w-full'>
              <Showcase category={selectedCategory} />
            </div>
          )}
        </div>

        {selectedSubcategory === 'auto' && (
          <div className='flex-1 p-4 sticky top-28'>
            <div className='w-full min-w-0'>
              <Preview key={selectedCategory} {...previewData} />
            </div>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
