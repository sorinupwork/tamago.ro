import React from 'react';
import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/skeleton'; // Add import for Skeleton
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Post = {
  id: string;
  title: string;
  category: string;
  price?: number | null;
  images?: string[];
  status?: 'active' | 'sold' | 'draft';
  views?: number;
};

export default function PostsGrid({
  posts,
  onEdit,
  onDelete,
  onToggle,
}: {
  posts: Post[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, current?: Post['status']) => void;
}) {
  if (!posts?.length) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='hover:shadow-lg transition-shadow animate-pulse'>
            <CardHeader>
              <div className='flex items-start justify-between w-full'>
                <div className='flex items-center space-x-3'>
                  <Skeleton className='w-20 h-14 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                  <div>
                    <Skeleton className='h-4 w-32 mb-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                    <Skeleton className='h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                  </div>
                </div>
                <div className='text-right'>
                  <Skeleton className='h-4 w-16 mb-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                  <Skeleton className='h-3 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between items-center'>
                <div className='flex space-x-2'>
                  <Skeleton className='h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                  <Skeleton className='h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
                </div>
                <Skeleton className='h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  );
}
