'use client';

import { useState, useMemo, useEffect } from 'react';

import FeedCard from '../card/FeedCard';
import AppPagination from '@/components/custom/pagination/AppPagination';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { SocialEmptyState } from '@/components/custom/empty';
import type { FeedPost } from '@/lib/types';

type FeedGridProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loadingMore: boolean;
  initialItems?: FeedPost[];
  showPosts?: boolean;
  showPolls?: boolean;
  sortBy?: string;
  onView?: (item: FeedPost) => void;
  onEdit?: (item: FeedPost) => void;
  onDelete?: (item: FeedPost) => void;
  searchQuery?: string;
};

export default function FeedGrid({
  currentPage,
  totalPages,
  onPageChange,
  initialItems = [],
  showPosts = true,
  showPolls = true,
  sortBy = 'createdAt',
  onView,
  onEdit,
  onDelete,
  searchQuery = '',
  loadingMore,
}: FeedGridProps) {
  const [feedItems, setFeedItems] = useState<FeedPost[]>(initialItems);

  useEffect(() => {
    setFeedItems(initialItems);
  }, [initialItems]);

  const itemsToRender = useMemo(() => {
    let arr = feedItems.slice();

    arr = arr.filter((item) => {
      if (item.type === 'post' && !showPosts) return false;
      if (item.type === 'poll' && !showPolls) return false;
      return true;
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      arr = arr.filter((item) => {
        const text = item.text || '';
        const question = item.question || '';
        const tags = item.tags?.join(' ') || '';
        return text.toLowerCase().includes(query) || question.toLowerCase().includes(query) || tags.toLowerCase().includes(query);
      });
    }

    switch (sortBy) {
      case 'likes':
        arr.sort((a, b) => (b.reactions?.likes?.total ?? 0) - (a.reactions?.likes?.total ?? 0));
        break;
      case 'comments':
        arr.sort((a, b) => (b.reactions?.comments?.length ?? 0) - (a.reactions?.comments?.length ?? 0));
        break;
      case 'views':
        // we might add views in future, for now treat as likes
        arr.sort((a, b) => (b.reactions?.likes?.total ?? 0) - (a.reactions?.likes?.total ?? 0));
        break;
      case 'createdAt':
      default:
        arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return arr;
  }, [feedItems, sortBy, showPosts, showPolls, searchQuery]);

  return (
    <div className='w-full space-y-4'>
      {loadingMore && itemsToRender.length === 0 ? (
        <SkeletonLoading variant='feed' />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {itemsToRender.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                onView={(post) => onView?.(post)}
                onEdit={(post) => onEdit?.(post)}
                onDelete={(post) => onDelete?.(post)}
              />
            ))}
          </div>

          {itemsToRender.length === 0 && (
            <SocialEmptyState type='posts' />
          )}

          {itemsToRender.length > 0 && typeof totalPages === 'number' && typeof currentPage === 'number' && onPageChange ? (
            <div className='mt-4 flex justify-center'>
              <AppPagination currentPage={currentPage || 1} totalPages={totalPages || 1} onPageChange={onPageChange} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
