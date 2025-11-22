import React from 'react';
import { MessageSquare } from 'lucide-react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '../empty/Empty';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import FeedPostCard from '@/components/custom/card/FeedPostCard';
import ScrollToTopButton from '@/components/custom/button/ScrollToTopButton';

type FeedSectionProps = {
  sessionUserId?: string | null;
};

export const FeedSection: React.FC<FeedSectionProps> = async ({ sessionUserId }) => {
  const feedsData = await getFeedPosts({ limit: 20 });
  const feedItems = feedsData.items;

  const isLoggedIn = !!sessionUserId;

  return (
    <Card className='flex flex-col min-h-0 p-4 h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' /> Feed
        </CardTitle>
      </CardHeader>

      <ScrollArea className='flex-1 overflow-y-auto relative' orientation='vertical'>
        <div className='space-y-4 pb-6 px-2 min-h-[400px]'>
          {feedItems.length > 0 ? (
            feedItems.map((item) => <FeedPostCard key={item._id} item={item} sessionUserId={sessionUserId} isLoggedIn={isLoggedIn} />)
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

        <ScrollToTopButton className='absolute bottom-6 left-4' />
      </ScrollArea>
    </Card>
  );
};
