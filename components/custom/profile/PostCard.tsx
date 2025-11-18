import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  category: string;
  price?: number | null;
  images?: string[];
  status?: 'active' | 'sold' | 'draft';
  views?: number;
};

export default function PostCard({
  post,
  onEdit,
  onDelete,
  onToggle,
}: {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, current?: Post['status']) => void;
}) {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div className='flex items-start justify-between w-full'>
          <div className='flex items-center space-x-3'>
            <div className='w-20 h-14 rounded overflow-hidden bg-surface'>
              <img src={post.images?.[0] ?? '/placeholder.png'} alt={post.title} className='object-cover w-full h-full' />
            </div>
            <div>
              <div className='font-semibold'>{post.title}</div>
              <div className='text-xs text-muted-foreground'>{post.category}</div>
            </div>
          </div>
          <div className='text-right'>
            <div className='font-bold'>{post.price ? `${post.price} €` : ''}</div>
            <div className={`text-xs ${post.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>{post.status}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2'>
            <Button size='sm' variant='outline' onClick={() => onEdit(post.id)}><Edit className='h-4 w-4 mr-1'/> Edit</Button>
            <Button size='sm' variant='destructive' onClick={() => onDelete(post.id)}><Trash className='h-4 w-4 mr-1'/> Delete</Button>
          </div>
          <div className='flex items-center space-x-2'>
            <Button size='sm' variant='outline' onClick={() => onToggle(post.id, post.status)}>{post.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
            <div className='text-xs text-muted-foreground'>{post.views ?? 0} views</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
