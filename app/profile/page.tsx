import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';
import ProfileClient from './ProfileClient';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';
import { getUserById, getFollowersCount, getFollowingCount } from '@/actions/auth/actions';

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/cont');
  }

  const userId = session?.user?.id;
  const LIMIT = 3;
  const [feedsData, storiesData, userData, followersCount, followingCount] = await Promise.all([
    getFeedPosts({ userId, limit: LIMIT, page: 1 }),
    getStories({ userId, limit: LIMIT, page: 1 }),
    getUserById(userId!),
    getFollowersCount(userId!),
    getFollowingCount(userId!),
  ]);

  return (
    <ProfileClient
      user={userData!}
      initialFeedItems={feedsData.items}
      initialFeedTotal={feedsData.total}
      initialStoriesItems={storiesData.items}
      initialStoriesTotal={storiesData.total}
      initialBadges={userData?.badges || []}
      initialBio={userData?.bio || ''}
      initialFollowers={followersCount}
      initialFollowing={followingCount}
      initialPostsTotal={feedsData.total}
      initialPrivacySettings={userData?.privacySettings}
    />
  );
}
