'use client';

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import AppPagination from '@/components/custom/pagination/AppPagination';

type Story = {
  id: string;
  caption?: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  createdAt: string;
  expiresAt: string;
};

type StoriesGridProps = {
  userId?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loadingMore: boolean;
  initialItems?: Story[];
};

export default function StoriesGrid({ userId, currentPage, totalPages, onPageChange, loadingMore, initialItems = [] }: StoriesGridProps) {
  const [stories, setStories] = useState<Story[]>(initialItems);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');

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
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h3 className='text-lg font-semibold'>Your Stories</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='createdAt'>Newest First</SelectItem>
            <SelectItem value='expiresAt'>Expiring Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {sorted.map((story) => (
          <Card key={story.id} className='overflow-hidden'>
            <CardContent>
              {story.files.length > 0 && (
                <div className='relative w-full h-48 mb-2'>
                  {story.files[0].contentType?.startsWith('image/') ? (
                    <Image src={story.files[0].url} alt='Story' fill className='object-cover rounded' />
                  ) : (
                    <video src={story.files[0].url} className='w-full h-full object-cover rounded' controls />
                  )}
                </div>
              )}
              {story.caption && <p className='text-sm'>{story.caption}</p>}
              <p className='text-xs text-muted-foreground'>Expires: {new Date(story.expiresAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {typeof totalPages === 'number' && typeof currentPage === 'number' && onPageChange ? (
        <div className='mt-4 flex justify-center'>
          <AppPagination currentPage={currentPage || 1} totalPages={totalPages || 1} onPageChange={onPageChange} />
        </div>
      ) : null}
    </div>
  );
}
