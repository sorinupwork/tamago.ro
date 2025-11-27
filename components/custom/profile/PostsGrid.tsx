import PostCard from '../card/PostCard';
import AppPagination from '@/components/custom/pagination/AppPagination';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import type { Post } from '@/lib/types';

export default function PostsGrid({
  posts,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
  loadingMore = false,
}: {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loadingMore?: boolean;
}) {
  return (
    <div className='w-full space-y-4'>
      {loadingMore && posts.length === 0 ? (
        <SkeletonLoading variant='feed' />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} onEdit={onEdit} onDelete={onDelete} onView={onView} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>Nu sunt anunțuri postare</p>
            </div>
          )}

          {typeof totalPages === 'number' && typeof currentPage === 'number' && onPageChange ? (
            <div className='mt-4 flex justify-center'>
              <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
