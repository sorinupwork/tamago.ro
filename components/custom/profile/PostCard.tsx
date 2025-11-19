import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Eye, EyeOff } from 'lucide-react';

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

export default function PostCard({
  post,
  onEdit,
  onDelete,
  onToggle,
  onView,
}: {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, current?: Post['status']) => void;
  onView: (post: Post) => void;
}) {
  const imageSrc = post.images?.[0] ?? '/placeholder.png';
  const isActive = post.status === 'active';

  return (
    <Card className='hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary/20 hover:border-l-primary'>
      <CardContent className='p-4'>
        <div className='flex items-center gap-4'>
          {/* Image */}
          <div className='relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              className='object-cover'
              sizes='80px'
            />
          </div>

          {/* Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                <h3 className='font-semibold text-sm truncate'>{post.title}</h3>
                <p className='text-xs text-muted-foreground capitalize'>{post.category}</p>
                <div className='flex items-center gap-2 mt-1'>
                  <Badge variant={isActive ? 'default' : 'secondary'} className='text-xs'>
                    {isActive ? 'Activ' : post.status === 'sold' ? 'Vândut' : 'Draft'}
                  </Badge>
                </div>
              </div>
              <div className='text-right flex-shrink-0'>
                <p className='font-bold text-sm'>{post.price ? `${post.price} ${post.currency || 'RON'}` : 'Preț nedefinit'}</p>
                <span className='text-xs text-muted-foreground'>{post.views ?? 0} vizualizări</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-1 flex-shrink-0'>
            <Button size='sm' variant='ghost' onClick={() => onView(post)} className='h-8 w-8 p-0'>
              <Eye className='h-4 w-4' />
            </Button>
            <Button size='sm' variant='ghost' onClick={() => onEdit(post.id)} className='h-8 w-8 p-0'>
              <Edit className='h-4 w-4' />
            </Button>
            <Button size='sm' variant='ghost' onClick={() => onToggle(post.id, post.status)} className='h-8 w-8 p-0'>
              {isActive ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </Button>
            <Button size='sm' variant='destructive' onClick={() => onDelete(post.id)} className='h-8 w-8 p-0'>
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
