'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { getStories } from '@/actions/social/stories/actions';

type Story = {
  _id: string;
  caption?: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  createdAt: string;
  expiresAt: string;
};

type StoriesGridProps = {
  userId?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
};

export default function StoriesGrid({ userId, hasMore, onLoadMore, loadingMore }: StoriesGridProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      try {
        const data = await getStories({ userId, sortBy: sortBy === 'createdAt' ? -1 : 1 });
        setStories(data.items);
        console.log('Fetched stories for user:', userId, data.items);
      } catch {
        setError('Failed to load stories');
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [userId, sortBy]);

  if (loading) return <SkeletonLoading variant='feed' />;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Your Stories</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='createdAt'>Newest First</SelectItem>
            <SelectItem value='expiresAt'>Expiring Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {stories.map((story) => (
          <Card key={story._id} className='overflow-hidden'>
            <CardContent className='p-4'>
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
      {hasMore && (
        <div className='text-center'>
          <Button onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
