'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/subcategories';
import AppSeparator from '../separator/AppSeparator';
import { AppInvertedCarousel } from '../carousel/AppInvertedCarousel';

export function Showcase({ category }: { category: string }) {
  const router = useRouter();

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

  const reverseMapping: Record<string, string> = { sell: 'oferta', buy: 'cerere', rent: 'inchiriere', auction: 'licitatie' };
  const navigateTo = (catKey: string, sub?: string) => {
    const tip = reverseMapping[catKey] ?? catKey;
    const url = `/categorii?tip=${tip}${sub ? `&subcategorie=${sub}` : ''}`;
    router.push(url);
  };

  const extendedSubcategories = [...subcategories];

  const rowAItems = extendedSubcategories;
  const rowBItems = extendedSubcategories;

  const cat = categories.find((c) => c.key === category);
  if (!cat) return null;

  return (
    <div className='flex-1 relative w-full mx-auto animate-fade-in overflow-hidden'>
      <div className={`relative w-full max-w-screen h-64 sm:h-80 md:h-96 mb-8 overflow-hidden shadow-lg`}>
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
          <div className='text-center max-w-full'>
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg wrap-break-word'>{cat.label}</h1>
            <p className='text-sm sm:text-base md:text-lg text-gray-200 mt-1 drop-shadow wrap-break-word'>
              {`Explorează opțiunile pentru ${cat.label.toLowerCase()}.`}
            </p>
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
