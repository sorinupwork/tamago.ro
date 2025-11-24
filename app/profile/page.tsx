import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';
import ProfileClient from './ProfileClient';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/cont');
  }

  const userId = session?.user?.id;
  const LIMIT = 3;
  const [feedsData, storiesData] = await Promise.all([
    getFeedPosts({ userId, limit: LIMIT, page: 1 }),
    getStories({ userId, limit: LIMIT, page: 1 }),
  ]);

  return (
    <ProfileClient
      session={session}
      initialFeedItems={feedsData.items}
      initialFeedTotal={feedsData.total}
      initialStoriesItems={storiesData.items}
      initialStoriesTotal={storiesData.total}
    />
  );
}
