import GoldenCategories from '@/components/custom/header/GoldenCategories';
import GoldenPosts from '@/components/custom/header/GoldenPosts';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center grow gap-4 text-center min-w-0'>
      <GoldenCategories />
      <GoldenPosts />
    </div>
  );
}
