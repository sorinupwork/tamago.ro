import AppCarousel from '@/components/custom/carousel/AppCarousel';
import AppGoldenSection from '@/components/custom/section/AppGoldenSection';
import { subcategories } from '@/lib/subcategories';
import { getGoldenSectionPosts } from '@/actions/auto/actions';

export default async function Home() {
  const posts = await getGoldenSectionPosts();

  return (
    <div className='flex flex-col items-center justify-center grow text-center gap-4 py-4'>
      <AppCarousel title='Categorii Populare' items={subcategories} />
      <AppGoldenSection title='Anunțuri Verificate' posts={posts} />
    </div>
  );
}
