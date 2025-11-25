import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';
import PublicProfileClient from './PublicProfileClient';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';
import { getUserCars } from '@/actions/auto/actions';
import { getUserById, isFollowing, isFriend } from '@/actions/auth/actions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await getUserById(id);

  if (!user) {
    return <div className='text-center text-destructive py-2 underline'>User not found</div>;
  }

  if (!session) {
    if (!user.privacySettings?.profileVisible) {
      return <div className='text-center text-destructive py-2 underline'>This profile is private</div>;
    }

    const LIMIT = 3;
    const [feedsData, storiesData, postsData] = await Promise.all([
      getFeedPosts({ userId: id, limit: LIMIT, page: 1 }),
      getStories({ userId: id, limit: LIMIT, page: 1 }),
      getUserCars({ userId: id, page: 1, limit: LIMIT }),
    ]);

    return (
      <PublicProfileClient
        session={null}
        user={user}
        initialFeedItems={feedsData.items}
        initialFeedTotal={feedsData.total}
        initialStoriesItems={storiesData.items}
        initialStoriesTotal={storiesData.total}
        initialPosts={postsData.posts}
        initialPostsTotal={postsData.total}
        initialIsFollowing={false}
        initialIsFriend={false}
      />
    );
  } else {
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
}
