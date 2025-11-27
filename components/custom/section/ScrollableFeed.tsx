'use client';

import { useRef } from 'react';
import { MessageSquare } from 'lucide-react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '../empty/Empty';
import FeedPostCard from '@/components/custom/card/FeedPostCard';
import ScrollToTopButton from '@/components/custom/button/ScrollToTopButton';
import LoadMoreButton from '../button/LoadMoreButton';
import { FeedItem } from '@/lib/types';

type ActionState = { success?: boolean; error?: string } | null;

type ScrollableFeedProps = {
  feedItems: FeedItem[];
  sessionUserId?: string | null;
  isLoggedIn: boolean;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function ScrollableFeed({ feedItems, sessionUserId, isLoggedIn, action }: ScrollableFeedProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollArea ref={scrollAreaRef} className='flex-1 overflow-y-auto relative' orientation='vertical'>
      <div className='space-y-4 pb-6 px-2 min-h-[400px]'>
        {feedItems.length > 0 ? (
          <>
            {feedItems.map((item) => (
              <FeedPostCard key={item.id} item={item} sessionUserId={sessionUserId} isLoggedIn={isLoggedIn} />
            ))}
            <div className='flex justify-center mt-4'>
              <LoadMoreButton action={action} type='submit' loadingLabel='Refreshing...' label='Load More Feeds' />
            </div>
          </>
        ) : (
          <div className='min-h-[400px] flex items-center justify-center'>
            <Empty>
              <EmptyMedia>
                <MessageSquare className='w-12 h-12 p-2' />
              </EmptyMedia>
              <EmptyTitle>Nu există postări încă</EmptyTitle>
              <EmptyDescription>Fii primul care creează o postare și începe conversația!</EmptyDescription>
            </Empty>
          </div>
        )}
      </div>

      <ScrollBar />

      <ScrollToTopButton containerRef={scrollAreaRef} className='absolute bottom-6 left-4' />
    </ScrollArea>
  );
}
