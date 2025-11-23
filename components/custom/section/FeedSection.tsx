import { revalidatePath } from 'next/cache';

import { Card, CardHeader } from '@/components/ui/card';
import ScrollableFeed from './ScrollableFeed';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import FeedHeader from './FeedHeader';

type FeedSectionProps = {
  sessionUserId?: string | null;
  searchParams: { [key: string]: string | string[] | undefined };
};

type ActionState = { success?: boolean; error?: string } | null;

export const FeedSection: React.FC<FeedSectionProps> = async ({ sessionUserId, searchParams }) => {
  const awaitedSearchParams = await searchParams;

  const tags = typeof awaitedSearchParams.tags === 'string' ? awaitedSearchParams.tags.split(',').filter(Boolean) : [];
  const type = (awaitedSearchParams.type as 'post' | 'poll' | 'both') || 'both';
  const sortBy = awaitedSearchParams.sortBy === 'latest' ? 1 : -1;

  const feedsData = await getFeedPosts({ limit: 20, tags, type, sortBy });

  const feedItems = feedsData.items;

  const isLoggedIn = !!sessionUserId;

  const revalidateAction = async (): Promise<ActionState> => {
    'use server';
    try {
      revalidatePath('/social');
      return { success: true };
    } catch {
      return { error: 'Failed to refresh feeds' };
    }
  };

  return (
    <Card className='flex flex-col min-h-0 p-4 h-full'>
      <CardHeader>
        <FeedHeader />
      </CardHeader>

      <ScrollableFeed feedItems={feedItems} sessionUserId={sessionUserId} isLoggedIn={isLoggedIn} action={revalidateAction} />
    </Card>
  );
};
