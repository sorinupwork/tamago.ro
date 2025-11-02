import Image from 'next/image';

import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/mockData';

export function Showcase({ category }: { category: string }) {
  const cat = categories.find((c) => c.key === category);
  if (!cat) return null;
  const Icon = cat.icon;

  const heroImages: Record<string, string> = {
    sell: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
    buy: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
    rent: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
    auction: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60',
  };

  return (
    <div className='max-w-7xl mx-auto w-full p-4 rounded-lg shadow-md bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 animate-fade-in'>
      <div className='text-center mb-6'>
        <div className='flex items-center justify-start gap-4 mb-4'>
          <Icon className='w-16 h-16 animate-bounce' />
          <div>
            <h1 className='text-4xl font-bold'>{cat.label}</h1>
            <p className='text-lg mt-2 text-muted-foreground'>Explorează opțiunile pentru {cat.label.toLowerCase()}.</p>
          </div>
        </div>
      </div>
      <div className='relative w-full h-64 mb-6 rounded-lg overflow-hidden shadow-sm'>
        <Image src={heroImages[category]} alt={`${cat.label} showcase`} fill className='object-cover' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() =>
              (window.location.href = `/categorii?category=${category}&subcategory=${
                sub.title ? sub.title.toLowerCase().replace(' ', '-') : ''
              }`)
            }
            className='bg-card p-4 rounded-lg shadow-sm lift cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left'
          >
            <div className='w-8 h-8 mb-2'>
              <sub.icon />
            </div>
            <h3 className='text-lg font-semibold'>{sub.title || ''}</h3>
            <p className='text-sm text-muted-foreground mt-2'>{sub.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
