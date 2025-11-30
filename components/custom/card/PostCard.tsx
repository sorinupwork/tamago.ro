import Image from 'next/image';
import { Edit, Trash2, Eye, Heart } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getPriceWithCurrency } from '@/lib/auto/helpers';
import type { Post } from '@/lib/types';
import SafeHtml from '@/components/custom/text/SafeHtml';

type PostCardProps = {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
};

export default function PostCard({ post, onEdit, onDelete, onView }: PostCardProps) {
  const imageSrc = post.images?.[0] ?? '/placeholder.png';
  const isActive = post.status === 'active';

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary/20 hover:border-l-primary flex flex-col h-full'>
      <CardContent className='p-4 flex flex-col h-full'>
        <div className='flex flex-col h-full'>
          <div className='space-y-3 flex-1'>
            {/* Header with category and status */}
            <div className='flex items-start justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='text-xs capitalize'>
                  {post.category}
                </Badge>
                <Badge variant={isActive ? 'default' : 'secondary'} className='text-xs'>
                  {isActive ? 'Activ' : post.status === 'sold' ? 'Vândut' : 'Draft'}
                </Badge>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-xs text-muted-foreground font-medium flex items-center gap-1'>
                  <Eye className='h-3 w-3' />
                  {post.views ?? 0}
                </span>
                {post.favoritesCount !== undefined && (
                  <span className='text-xs text-muted-foreground font-medium flex items-center gap-1'>
                    <Heart className='h-3 w-3' />
                    {post.favoritesCount}
                  </span>
                )}
              </div>
            </div>

            {/* Image */}
            <div className='relative w-full h-48 rounded-lg overflow-hidden'>
              <Image src={imageSrc} alt={post.title} fill className='object-cover' />
            </div>

            {/* Title and description */}
            <div className='space-y-1'>
              <h3 className='font-semibold text-sm line-clamp-2'>{post.title}</h3>
              {post.description && <SafeHtml html={post.description} className='text-xs text-muted-foreground line-clamp-2' />}
            </div>

            {/* Price */}
            <div className='border-t pt-2'>
              <p className='font-bold text-sm'>{getPriceWithCurrency(post)}</p>
            </div>

            {/* Car details */}
            <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t pt-2'>
              {post.category === 'buy'
                ? (post.minYear || post.maxYear) && (
                    <div>
                      Year: {post.minYear} - {post.maxYear}
                    </div>
                  )
                : post.year && <div>Year: {post.year}</div>}
              {post.category === 'buy'
                ? (post.minMileage !== undefined || post.maxMileage !== undefined) && (
                    <div>
                      Mileage: {post.minMileage?.toLocaleString()} - {post.maxMileage?.toLocaleString()} km
                    </div>
                  )
                : post.mileage !== undefined && <div>Mileage: {post.mileage.toLocaleString()} km</div>}
              {post.fuel && <div>Fuel: {post.fuel}</div>}
              {post.transmission && <div>Transmission: {post.transmission}</div>}
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center justify-between gap-2 border-t pt-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='ghost' onClick={() => onView(post)} className='h-8 w-8 p-0'>
                  <Eye className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vizualizează</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='ghost' onClick={() => onEdit(post)} className='h-8 w-8 p-0'>
                  <Edit className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editează</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='destructive' onClick={() => onDelete(post)} className='h-8 w-8 p-0'>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Șterge</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
