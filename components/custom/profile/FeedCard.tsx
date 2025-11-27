import Image from 'next/image';
import { Eye, Edit, Trash2, Heart, MessageCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { FeedPost } from '@/lib/types';
import SafeHtml from '@/components/custom/text/SafeHtml';

type FeedCardProps = {
  item: FeedPost;
  onView: (item: FeedPost) => void;
  onEdit: (item: FeedPost) => void;
  onDelete: (item: FeedPost) => void;
};

export default function FeedCard({ item, onView, onEdit, onDelete }: FeedCardProps) {
  const likesCount = item.reactions?.likes?.total ?? 0;
  const commentsCount = item.reactions?.comments?.length ?? 0;

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary/20 hover:border-l-primary flex flex-col h-full'>
      <CardContent className='p-4 flex flex-col h-full'>
        <div className='flex flex-col h-full'>
          <div className='space-y-3 flex-1'>
          {/* Header with type badge */}
          <div className='flex items-start justify-between gap-2'>
            <Badge variant={item.type === 'post' ? 'default' : 'secondary'} className='text-xs'>
              {item.type === 'post' ? 'Post' : 'Poll'}
            </Badge>
          </div>

          {/* Media section for posts */}
          {item.type === 'post' && item.files && item.files.length > 0 && (
            <div className='relative w-full h-48 mb-2 rounded-lg overflow-hidden'>
              {item.files[0].contentType?.startsWith('image/') ? (
                <Image src={item.files[0].url} alt='Post' fill sizes='100%' className='object-cover' />
              ) : (
                <video src={item.files[0].url} className='w-full h-full object-cover' controls />
              )}
            </div>
          )}

          {/* Content */}
          <div className='space-y-2'>
            {item.type === 'post' ? (
              <>
                {item.text && <SafeHtml html={item.text || ''} className='text-sm line-clamp-3' />}
                {item.tags && item.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {item.tags.map((tag) => (
                      <span key={tag} className='text-xs bg-secondary/20 dark:bg-secondary/80 px-2 py-1 rounded'>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {item.question && <p className='font-semibold text-sm'>{item.question}</p>}
                {item.options && item.options.length > 0 && (
                  <ul className='text-sm space-y-1'>
                    {item.options.map((opt, i) => (
                      <li key={i} className='text-xs text-muted-foreground'>
                        • {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Reactions and metadata */}
          <div className='flex items-center gap-3 text-xs text-muted-foreground border-t pt-2'>
            <div className='flex items-center gap-1'>
              <Heart className='h-3 w-3' />
              <span>{likesCount}</span>
            </div>
            <div className='flex items-center gap-1'>
              <MessageCircle className='h-3 w-3' />
              <span>{commentsCount}</span>
            </div>
            <span className='ml-auto'>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>

          </div>

          {/* Action buttons */}
          <div className='flex items-center justify-between gap-2 border-t pt-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='ghost' onClick={() => onView(item)} className='h-8 w-8 p-0'>
                  <Eye className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vizualizează</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='ghost' onClick={() => onEdit(item)} className='h-8 w-8 p-0'>
                  <Edit className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editează</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='destructive' onClick={() => onDelete(item)} className='h-8 w-8 p-0'>
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
