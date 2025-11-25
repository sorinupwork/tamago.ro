import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';
import PublicProfileClient from './PublicProfileClient'; 
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';
import { getUserCars } from '@/actions/auto/actions';
import { getUserById, isFollowing, isFriend } from '@/actions/auth/actions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/cont');
  }

  const user = await getUserById(id);

  if (!user) {
    return <div>User not found</div>;
  }

  if (!user.privacySettings?.profileVisible) {
    return <div>This profile is private</div>;
  }

  const LIMIT = 3;
  const [feedsData, storiesData, postsData, followingStatus, friendStatus] = await Promise.all([
    getFeedPosts({ userId: id, limit: LIMIT, page: 1 }),
    getStories({ userId: id, limit: LIMIT, page: 1 }),
    getUserCars({ userId: id, page: 1, limit: LIMIT }),
    isFollowing(id),
    isFriend(id),
  ]);

  return (
    <PublicProfileClient
      session={session}
      user={user}
      initialFeedItems={feedsData.items}
      initialFeedTotal={feedsData.total}
      initialStoriesItems={storiesData.items}
      initialStoriesTotal={storiesData.total}
      initialPosts={postsData.posts}
      initialPostsTotal={postsData.total}
      initialIsFollowing={followingStatus}
      initialIsFriend={friendStatus}
    />
  );
}
