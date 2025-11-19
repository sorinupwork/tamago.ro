import PostCard from './PostCard';

import { Button } from '@/components/ui/button';
import SkeletonLoading from '../loading/SkeletonLoading';

type Post = {
  id: string;
  title: string;
  category: string;
  price?: string | null;
  currency?: string;
  images?: string[];
  status?: 'active' | 'sold' | 'draft';
  views?: number;
};

export default function PostsGrid({
  posts,
  onEdit,
  onDelete,
  onToggle,
  onView,
  hasMore,
  onLoadMore,
  loadingMore,
}: {
  posts: Post[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, current?: Post['status']) => void;
  onView: (post: Post) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
}) {
  if (!posts?.length) {
    return <SkeletonLoading variant='profile' />;
  }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onView={onView} />
      ))}
      {hasMore && (
        <div className='col-span-full flex justify-center mt-4'>
          <Button onClick={onLoadMore} disabled={loadingMore} variant='outline'>
            {loadingMore ? 'Se încarcă...' : 'Încarcă Mai Multe'}
          </Button>
        </div>
      )}
    </div>
  );
}
