import { MessageSquare } from 'lucide-react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollableFeed from './ScrollableFeed';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { revalidatePath } from 'next/cache';

type FeedSectionProps = {
  sessionUserId?: string | null;
};

type ActionState = { success?: boolean; error?: string } | null;

export const FeedSection: React.FC<FeedSectionProps> = async ({ sessionUserId }) => {
  const feedsData = await getFeedPosts({ limit: 20 });
  const feedItems = feedsData.items;

  const isLoggedIn = !!sessionUserId;

  const revalidateAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    'use server';
    try {
      revalidatePath('/social');
      return { success: true };
    } catch (error) {
      return { error: 'Failed to refresh feeds' };
    }
  };

  return (
    <Card className='flex flex-col min-h-0 p-4 h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' /> Feed
        </CardTitle>
      </CardHeader>

      <ScrollableFeed feedItems={feedItems} sessionUserId={sessionUserId} isLoggedIn={isLoggedIn} action={revalidateAction} />
    </Card>
  );
};
