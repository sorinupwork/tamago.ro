import Image from 'next/image';
import { Eye, Edit, Trash2, Heart, MessageCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { StoryPost } from '@/lib/types';
import SafeHtml from '@/components/custom/text/SafeHtml';

type StoryCardProps = {
  story: StoryPost;
  onView: (story: StoryPost) => void;
  onEdit: (story: StoryPost) => void;
  onDelete: (story: StoryPost) => void;
};

export default function StoryCard({ story, onView, onEdit, onDelete }: StoryCardProps) {
  const expiresAt = new Date(story.expiresAt);
  const now = new Date();
  const isExpired = expiresAt < now;
  const hoursUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
  const likesCount = story.reactions?.likes?.total ?? 0;
  const commentsCount = story.reactions?.comments?.length ?? 0;

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary/20 hover:border-l-primary flex flex-col h-full'>
      <CardContent className='p-4 flex flex-col h-full'>
        <div className='flex flex-col h-full'>
          {/* Media */}
          <div className='space-y-3 flex-1'>
            {story.files && story.files.length > 0 && (
              <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                {story.files[0].contentType?.startsWith('image/') ? (
                  <Image src={story.files[0].url} alt='Story' fill className='object-cover' />
                ) : (
                  <video src={story.files[0].url} className='w-full h-full object-cover' controls />
                )}
              </div>
            )}

            {/* Caption */}

            {story.caption && <SafeHtml html={story.caption} className='text-sm line-clamp-2' />}

            {/* Metadata */}
            <div className='text-xs text-muted-foreground space-y-1 border-t pt-2'>
              <p>Created: {new Date(story.createdAt).toLocaleDateString()}</p>
              <p className={isExpired ? 'text-red-500' : ''}>
                Expires: {expiresAt.toLocaleDateString()} {hoursUntilExpiry >= 0 && `(${hoursUntilExpiry}h left)`}
              </p>
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
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center justify-between gap-2 border-t pt-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size='sm' variant='ghost' onClick={() => onView(story)} className='h-8 w-8 p-0'>
                <Eye className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Vizualizează</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size='sm' variant='ghost' onClick={() => onEdit(story)} className='h-8 w-8 p-0'>
                <Edit className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editează</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size='sm' variant='destructive' onClick={() => onDelete(story)} className='h-8 w-8 p-0'>
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
