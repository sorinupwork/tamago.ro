'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/mockData';
import AppSeparator from '../separator/AppSeparator';
import { AppInvertedCarousel } from '../carousel/AppInvertedCarousel';

export function Showcase({ category }: { category: string }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 0);
  }, []);

  const heroImages: Record<string, string> = {
    sell: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
    buy: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
    rent: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
    auction: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
  };

  const categoryColors: Record<string, { text: string; icon: string; arrow: string }> = {
    sell: { text: 'text-primary', icon: 'text-primary', arrow: 'text-primary' },
    buy: { text: 'text-secondary', icon: 'text-secondary', arrow: 'text-secondary' },
    rent: { text: 'text-destructive', icon: 'text-destructive', arrow: 'text-destructive' },
    auction: { text: 'text-purple-600', icon: 'text-purple-600', arrow: 'text-purple-600' },
  };

  // navigation helper: category key -> tip param
  const reverseMapping: Record<string, string> = { sell: 'vanzare', buy: 'cumparare', rent: 'inchiriere', auction: 'licitatie' };
  const navigateTo = (catKey: string, sub?: string) => {
    const tip = reverseMapping[catKey] ?? catKey;
    const url = `/categorii?tip=${tip}${sub ? `&subcategory=${sub}` : ''}`;
    router.push(url);
  };

  // Duplicate subcategories for more items to test rendering (e.g., 14 total)
  const extendedSubcategories = [...subcategories, ...subcategories];

  const total = extendedSubcategories.length;
  const mid = Math.ceil(total / 2);

  const rowAItems = extendedSubcategories.slice(0, mid); // top row: items 0..mid-1
  const rowBItems = extendedSubcategories.slice(mid); // bottom row: items mid..total-1

  const cat = categories.find((c) => c.key === category);
  if (!cat) return null;

  return (
    <div className='flex-1 relative w-full mx-auto px-4 sm:px-8 md:px-0 animate-fade-in overflow-hidden'>
      {/*hero section */}
      <div
        className={`relative w-full h-64 sm:h-80 md:h-96 mb-8 overflow-hidden shadow-lg transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={heroImages[category]}
          alt={`${cat.label} showcase`}
          fill
          priority
          quality={95}
          className='object-cover brightness-105 contrast-105'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent backdrop-blur-sm' />

        <div className='absolute inset-0 flex items-center justify-center px-4'>
          <div className='text-center'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg'>{cat.label}</h1>
            <p className='text-sm sm:text-lg text-gray-200 mt-1 drop-shadow'>{`Explorează opțiunile pentru ${cat.label.toLowerCase()}.`}</p>
          </div>
        </div>
      </div>

      <AppSeparator overlapClass='-mt-4 sm:-mt-6' />

      <AppInvertedCarousel
        category={category}
        rowAItems={rowAItems}
        rowBItems={rowBItems}
        navigateTo={navigateTo}
        categoryColors={categoryColors}
      />
    </div>
  );
}
