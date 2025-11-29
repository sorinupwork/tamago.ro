'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MessageSquare, ThumbsUp, Share, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import type { ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import UserProfileCard from './UserProfileCard';
import AppInput from '@/components/custom/input/AppInput';
import SafeHtml from '@/components/custom/text/SafeHtml';
import { addLikeAction, addCommentAction, addReplyAction, voteOnPollAction } from '@/actions/social/feeds/actions';
import { FeedItem } from '@/lib/types';

type Props = {
  item: FeedItem;
  sessionUserId?: string | null;
  isLoggedIn: boolean;
};

export default function FeedPostCard({ item, sessionUserId, isLoggedIn }: Props) {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ itemId: string; commentId: string } | null>(null);
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});

  const likes = item.reactions?.likes?.total ?? 0;
  const likedByMe = (item.reactions?.likes?.userIds || []).includes(sessionUserId || '');

  const handleLike = async () => {
    if (!isLoggedIn) return;
    try {
      await addLikeAction(item.id, 'feed');
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (!isLoggedIn) return;
    try {
      await voteOnPollAction(item.id, optionIndex);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn || !newComment.trim()) return;
    try {
      await addCommentAction(item.id, newComment, 'feed');
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!isLoggedIn || !newReply[commentId]?.trim()) return;
    try {
      await addReplyAction(item.id, commentId, newReply[commentId], 'feed');
      setNewReply((prev) => ({ ...prev, [commentId]: '' }));
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <Card className='transition-all duration-300 hover:shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <UserProfileCard user={item.user} showName={true} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreVertical className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toast?.info?.('Shared!')}>
              <Share className='w-4 h-4 mr-2' /> Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast?.info?.('Reported!')}>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        {item.type === 'post' ? (
          <>
            {item.files &&
              item.files.length > 0 &&
              (item.files.length === 1 ? (
                <div className='relative w-full h-96 mt-2 rounded'>
                  <Image src={item.files[0].url} alt='Post' fill className='object-cover rounded' />
                </div>
              ) : (
                <Carousel opts={{ loop: true, align: 'start' }} className='w-full mt-2'>
                  <CarouselContent className='-ml-4'>
                    {item.files.map((file, idx) => (
                      <CarouselItem key={idx} className='pl-4 md:basis-1/2 lg:basis-1/2'>
                        <div className='relative w-full h-96 rounded'>
                          <Image src={file.url} alt={`Post ${idx + 1}`} fill className='object-cover rounded' />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ))}
            {item.tags && item.tags.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-1'>
                {item.tags.map((tag, idx) => (
                  <span key={idx} className='text-xs bg-muted px-2 py-1 rounded-full'>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <SafeHtml html={item.text} className='mt-2' />
          </>
        ) : (
          <>
            <p className='font-semibold'>{item.question}</p>
            <TooltipProvider>
              <div className='mt-2 space-y-2'>
                {item.options?.map((option, idx) => {
                  const totalVotes = (item.votes || []).reduce((a, b) => a + b, 0);
                  const optionVotes = item.votes?.[idx] || 0;
                  const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                  return (
                    <div key={idx} className='flex flex-col gap-1'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full justify-start'
                            onClick={() => handleVote(idx)}
                            disabled={!isLoggedIn || (item.votedUsers || []).includes(sessionUserId || '')}
                          >
                            {option}
                          </Button>
                        </TooltipTrigger>
                        {isLoggedIn && !(item.votedUsers || []).includes(sessionUserId || '') && (
                          <TooltipContent>
                            <p>Vote!</p>
                          </TooltipContent>
                        )}
                      </Tooltip>

                      <div className='flex items-center gap-2'>
                        <Progress value={percentage} className='flex-1' />
                        <span className='text-xs text-muted-foreground'>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TooltipProvider>
            {!isLoggedIn && <p className='text-xs text-muted-foreground mt-2'>Log in to vote.</p>}
          </>
        )}

        <ButtonGroup className='mt-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' onClick={handleLike} disabled={!isLoggedIn}>
                  <ThumbsUp className={`w-4 h-4 ${likedByMe ? 'fill-secondary text-secondary' : ''}`} /> {likes}
                </Button>
              </TooltipTrigger>
              {!isLoggedIn && <TooltipContent>Conectează-te pentru a utiliza această funcție</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <Button variant='ghost' size='sm' onClick={() => setShowComments(!showComments)}>
            <MessageSquare className='w-4 h-4' /> Comments ({(item.reactions?.comments || []).length})
          </Button>
        </ButtonGroup>

        {showComments && (
          <div className='mt-3 space-y-2'>
            {(item.reactions?.comments || []).map((comment) => (
              <div key={comment.id} className='border-l-2 pl-2 mb-2'>
                <p>
                  <strong>
                    {comment.userId === sessionUserId ? 'Tu' : comment.userId === item.userId ? item.user?.name || 'User' : 'User'}:
                  </strong>{' '}
                  {comment.text}
                </p>

                <div className='flex gap-2 mt-1 items-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setReplyingTo(replyingTo?.commentId === comment.id ? null : { itemId: item.id, commentId: comment.id })}
                  >
                    Reply
                  </Button>
                </div>

                {comment.replies.map((reply) => (
                  <div key={reply.id} className='ml-4 border-l-2 pl-2 mt-2'>
                    <p>
                      <strong>
                        {reply.userId === sessionUserId ? 'Tu' : reply.userId === item.userId ? item.user?.name || 'User' : 'User'}:
                      </strong>{' '}
                      {reply.text}
                    </p>
                  </div>
                ))}

                {replyingTo?.commentId === comment.id && (
                  <div className='flex gap-2 mt-2'>
                    <AppInput
                      placeholder='Adaugă un răspuns...'
                      value={newReply?.[comment.id] || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewReply((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                      className='flex-1'
                    />
                    <Button size='sm' onClick={() => handleAddReply(comment.id)}>
                      Post
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <div className='mt-2'>
              <div className='flex gap-2'>
                <AppInput
                  placeholder='Adaugă un comentariu...'
                  value={newComment}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className='flex-1'
                  disabled={!isLoggedIn}
                />
                <Button onClick={handleAddComment} size='sm' disabled={!isLoggedIn}>
                  Post
                </Button>
              </div>
              {!isLoggedIn && <p className='text-xs text-muted-foreground mt-2'>Conectează-te pentru a comenta.</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
