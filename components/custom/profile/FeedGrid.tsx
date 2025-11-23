'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';

type FeedItem = {
  id: string;
  type: 'post' | 'poll';
  text?: string;
  question?: string;
  options?: string[];
  files?: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  createdAt: string;
  tags?: string[];
};

type FeedGridProps = {
  userId?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
  initialItems?: FeedItem[];
};

export default function FeedGrid({ userId, hasMore, onLoadMore, loadingMore, initialItems = [] }: FeedGridProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialItems);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [showPosts, setShowPosts] = useState(true);
  const [showPolls, setShowPolls] = useState(true);

  useEffect(() => {
    setFeedItems(initialItems);
  }, [initialItems]);

  const filtered = useMemo(() => {
    let list = feedItems.slice();
    if (!showPosts) list = list.filter((i) => i.type !== 'post');
    if (!showPolls) list = list.filter((i) => i.type !== 'poll');
    if (sortBy === 'createdAt') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [feedItems, showPosts, showPolls, sortBy]);

  if (loading) return <SkeletonLoading variant='feed' />;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h3 className='text-lg font-semibold'>Your Feed</h3>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox checked={showPosts} onCheckedChange={(checked) => setShowPosts(checked === true)} />
            <label>Posts</label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox checked={showPolls} onCheckedChange={(checked) => setShowPolls(checked === true)} />
            <label>Polls</label>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-full sm:w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='createdAt'>Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {filtered.map((item) => (
          <Card key={item.id} className='overflow-hidden'>
            <CardContent className='p-4'>
              {item.type === 'post' ? (
                <>
                  {item.files && item.files.length > 0 && (
                    <div className='relative w-full h-48 mb-2'>
                      {item.files[0].contentType?.startsWith('image/') ? (
                        <Image src={item.files[0].url} alt='Post' fill className='object-cover rounded' />
                      ) : (
                        <video src={item.files[0].url} className='w-full h-full object-cover rounded' controls />
                      )}
                    </div>
                  )}
                  {item.text && <p className='text-sm'>{item.text}</p>}
                  {item.tags &&
                    item.tags.map((tag) => (
                      <span key={tag} className='text-xs bg-blue-100 px-1 rounded'>
                        #{tag}
                      </span>
                    ))}
                </>
              ) : (
                <>
                  <p className='font-semibold'>{item.question}</p>
                  <ul className='text-sm'>
                    {item.options?.map((opt, i) => (
                      <li key={i}>- {opt}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className='text-xs text-muted-foreground'>Posted: {new Date(item.createdAt).toLocaleDateString()}</p>
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
