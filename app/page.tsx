import AppCarousel from '@/components/custom/carousel/AppCarousel';
import AppGoldenSection from '@/components/custom/layout/AppGoldenSection';
import { posts, subcategories } from '@/lib/mockData';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center grow gap-4 text-center'>
      <AppCarousel title='Categorii Populare' items={subcategories} />
      <AppGoldenSection title='Anunțuri Verificate' posts={posts} />
    </div>
  );
}
