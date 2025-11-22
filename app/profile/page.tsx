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
  const [feedsData, storiesData] = await Promise.all([getFeedPosts({ userId, limit: 20 }), getStories({ userId, limit: 20 })]);

  return (
    <ProfileClient
      session={session}
      initialFeedItems={feedsData.items}
      initialFeedHasMore={feedsData.hasMore}
      initialStoriesItems={storiesData.items}
      initialStoriesHasMore={storiesData.hasMore}
    />
  );
}
