'use client';

import { Suspense, useState, useCallback, use } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Preview } from '@/components/custom/Preview';
import { AppSidebar } from '@/components/custom/sidebar/AppSidebar';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';

const SellForm = dynamic(() => import('@/components/custom/forms/SellForm').then((mod) => ({ default: mod.SellForm })), { ssr: false });
const BuyForm = dynamic(() => import('@/components/custom/forms/BuyForm').then((mod) => ({ default: mod.BuyForm })), { ssr: false });
const RentForm = dynamic(() => import('@/components/custom/forms/RentForm').then((mod) => ({ default: mod.RentForm })), { ssr: false });
const AuctionForm = dynamic(() => import('@/components/custom/forms/AuctionForm').then((mod) => ({ default: mod.AuctionForm })), {
  ssr: false,
});

const categories = [
  { key: 'sell', label: 'Vânzare', icon: 'ShoppingCart' },
  { key: 'buy', label: 'Cumpărare', icon: 'HandHeart' },
  { key: 'rent', label: 'Închiriere', icon: 'Calendar' },
  { key: 'auction', label: 'Licitație', icon: 'Gavel' },
];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default function CategoriiPage({ searchParams }: PageProps) {
  const router = useRouter();
  const params = use(searchParams);
  const selectedCategory = (params.category as 'sell' | 'buy' | 'rent' | 'auction') || 'sell';
  const [previewData, setPreviewData] = useState<{
    title: string;
    description: string;
    price: number;
    location: string;
    category: string;
    uploadedFiles: string[];
  }>({
    title: '',
    description: '',
    price: 0,
    location: '',
    category: 'sell',
    uploadedFiles: [],
  });

  const onPreviewUpdate = useCallback((data: typeof previewData) => {
    setPreviewData(data);
  }, []);

  const getForm = () => {
    const props = { onPreviewUpdate };
    switch (selectedCategory) {
      case 'sell':
        return <SellForm {...props} />;
      case 'buy':
        return <BuyForm {...props} />;
      case 'rent':
        return <RentForm {...props} />;
      case 'auction':
        return <AuctionForm {...props} />;
      default:
        return <SellForm {...props} />;
    }
  };

  return (
    <>
      <AppSidebar selectedCategory={selectedCategory} onCategoryChange={(cat) => router.push(`/categorii?category=${cat}`)} />
      <SidebarInset className='flex-1 overflow-auto'>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <div className='flex-1' />
        </header>
        <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: 'Categorii' }]} />
        <main className='flex flex-1 flex-col lg:flex-row gap-4 p-4'>
          <div className='flex-1'>
            <Card className='animate-in fade-in-0 slide-in-from-bottom-4 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>
                  Formular pentru {categories.find((c) => c.key === selectedCategory)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading...</div>}>{getForm()}</Suspense>
              </CardContent>
            </Card>
          </div>
          <div className='w-full lg:w-1/3'>
            <Preview {...previewData} />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
