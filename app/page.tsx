import AppCarousel from '@/components/custom/carousel/AppCarousel';
import AppGoldenSection from '@/components/custom/section/AppGoldenSection';
import { subcategories } from '@/lib/subcategories';
import { getGoldenSectionPosts } from '@/actions/auto/actions'; // New import

export default async function Home() {
  const posts = await getGoldenSectionPosts();

  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    desc: post.desc,
    verified: post.verified,
    isNew: post.isNew,
    imageUrl: post.imageUrl,
    category: post.category,
  }));

  return (
    <div className='flex flex-col items-center justify-center grow gap-4 text-center'>
      <AppCarousel title='Categorii Populare' items={subcategories} />
      <AppGoldenSection title='Anunțuri Verificate' posts={serializedPosts} />
    </div>
  );
}
