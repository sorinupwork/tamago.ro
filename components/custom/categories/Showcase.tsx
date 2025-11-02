import Image from 'next/image';
import { categories, subcategories } from '@/lib/categories';

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
    <div className='jumbotron bg-linear-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg animate-fade-in'>
      <div className='flex items-center gap-4'>
        <Icon className='w-16 h-16 animate-bounce' />
        <div>
          <h1 className='text-4xl font-bold'>{cat.label}</h1>
          <p className='text-lg mt-2'>Explorează opțiunile pentru {cat.label.toLowerCase()}.</p>
        </div>
      </div>
      <div className='mt-4 relative w-full h-64'>
        <Image
          src={heroImages[category] || '/images/default-hero.jpg'}
          alt={`${cat.label} showcase`}
          fill
          className='object-cover rounded'
        />
      </div>
      <div className='mt-4 grid grid-cols-2 gap-4'>
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() =>
              (window.location.href = `/categorii?category=${category}&subcategory=${
                sub.title ? sub.title.toLowerCase().replace(' ', '-') : ''
              }`)
            }
            className='bg-white text-black p-4 rounded hover:bg-gray-200'
          >
            <div className='w-8 h-8'>
              <sub.icon />
            </div>
            <h3>{sub.title || ''}</h3>
            <p>{sub.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
