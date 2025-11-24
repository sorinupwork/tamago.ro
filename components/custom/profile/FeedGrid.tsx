'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppPagination from '@/components/custom/pagination/AppPagination';

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
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loadingMore: boolean;
  initialItems?: FeedItem[];
  showPosts?: boolean;
  showPolls?: boolean;
  onFilterToggle?: (which: 'posts' | 'polls', value: boolean) => void;
};

export default function FeedGrid({
  currentPage,
  totalPages,
  onPageChange,
  initialItems = [],
  showPosts = true,
  showPolls = true,
  onFilterToggle,
}: FeedGridProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialItems);
  const [sortBy, setSortBy] = useState<string>('createdAt');

  useEffect(() => {
    setFeedItems(initialItems);
  }, [initialItems]);

  const itemsToRender = useMemo(() => {
    const arr = feedItems.slice();
    if (sortBy === 'createdAt') arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return arr;
  }, [feedItems, sortBy]);

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h3 className='text-lg font-semibold'>Your Feed</h3>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox checked={showPosts} onCheckedChange={(checked) => onFilterToggle?.('posts', checked === true)} />
            <label>Posts</label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox checked={showPolls} onCheckedChange={(checked) => onFilterToggle?.('polls', checked === true)} />
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
        {itemsToRender.map((item) => (
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
                      <span key={tag} className='text-xs bg-secondary/20 dark:bg-secondary/80 px-1 rounded mr-1'>
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

      {typeof totalPages === 'number' && typeof currentPage === 'number' && onPageChange ? (
        <div className='mt-4 flex justify-center'>
          <AppPagination currentPage={currentPage || 1} totalPages={totalPages || 1} onPageChange={onPageChange} />
        </div>
      ) : null}
    </div>
  );
}
