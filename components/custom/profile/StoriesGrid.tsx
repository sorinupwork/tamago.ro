'use client';

import { useState, useMemo, useEffect } from 'react';

import StoryCard from '../card/StoryCard';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import AppPagination from '@/components/custom/pagination/AppPagination';
import type { StoryPost } from '@/lib/types';

type StoriesGridProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loadingMore: boolean;
  initialItems?: StoryPost[];
  sortBy?: string;
  onView?: (story: StoryPost) => void;
  onEdit?: (story: StoryPost) => void;
  onDelete?: (story: StoryPost) => void;
};

export default function StoriesGrid({
  currentPage,
  totalPages,
  onPageChange,
  initialItems = [],
  sortBy = 'createdAt',
  onView,
  onEdit,
  onDelete,
}: StoriesGridProps) {
  const [stories, setStories] = useState<StoryPost[]>(initialItems);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setStories(initialItems);
  }, [initialItems]);

  const sorted = useMemo(() => {
    const arr = stories.slice();
    if (sortBy === 'expiresAt') arr.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    else arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return arr;
  }, [stories, sortBy]);

  if (loading) return <SkeletonLoading variant='feed' />;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='w-full space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {sorted.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onView={(s) => onView?.(s)}
            onEdit={(s) => onEdit?.(s)}
            onDelete={(s) => onDelete?.(s)}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>Nu sunt povești</p>
        </div>
      )}

      {typeof totalPages === 'number' && typeof currentPage === 'number' && onPageChange ? (
        <div className='mt-4 flex justify-center'>
          <AppPagination currentPage={currentPage || 1} totalPages={totalPages || 1} onPageChange={onPageChange} />
        </div>
      ) : null}
    </div>
  );
}
