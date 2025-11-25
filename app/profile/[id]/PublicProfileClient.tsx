'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, MessageCircle, UserCheck, Heart } from 'lucide-react';
import { toggleFollow, toggleFriend } from '@/actions/auth/actions';
import { getUserCars } from '@/actions/auto/actions';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';

type Post = {
  id: string;
  title: string;
  category: string;
  price?: string | null;
  currency?: string;
  images?: string[];
  status?: 'active' | 'sold' | 'draft';
  createdAt?: string;
  views?: number;
};

type Session = {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string | null;
  };
};

type FeedItemLocal = {
  id: string;
  type: 'post' | 'poll';
  text?: string;
  question?: string;
  options?: string[];
  files?: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  createdAt: string;
  tags?: string[];
};

type StoryLocal = {
  id: string;
  caption?: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  createdAt: string;
  expiresAt: string;
};

type User = {
  _id: string;
  name: string;
  image: string;
  coverImage: string;
  bio: string;
  socials: Record<string, string>;
  badges: string[];
  platforms: string[];
  status: string;
  category: string;
  email: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  location: string | [number, number];
  emailVerified: boolean;
  privacySettings: {
    emailPublic: boolean;
    phonePublic: boolean;
    locationPublic: boolean;
    profileVisible: boolean;
  };
};

type PublicProfileClientProps = {
  session: Session;
  user: User;
  initialFeedItems?: FeedItemLocal[];
  initialFeedTotal?: number;
  initialStoriesItems?: StoryLocal[];
  initialStoriesTotal?: number;
  initialPosts?: Post[];
  initialPostsTotal?: number;
  initialIsFollowing?: boolean;
  initialIsFriend?: boolean;
};

export default function PublicProfileClient({
  session,
  user,
  initialFeedItems = [],
  initialFeedTotal = 0,
  initialStoriesItems = [],
  initialStoriesTotal = 0,
  initialPosts = [],
  initialPostsTotal = 0,
  initialIsFollowing = false,
  initialIsFriend = false,
}: PublicProfileClientProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isFriend, setIsFriend] = useState(initialIsFriend);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [feeds, setFeeds] = useState<FeedItemLocal[]>(initialFeedItems);
  const [stories, setStories] = useState<StoryLocal[]>(initialStoriesItems);

  const [totalPosts, setTotalPosts] = useState(initialPostsTotal);
  const [totalFeeds, setTotalFeeds] = useState(initialFeedTotal);
  const [totalStories, setTotalStories] = useState(initialStoriesTotal);

  const [postsPage, setPostsPage] = useState(1);
  const [feedsPage, setFeedsPage] = useState(1);
  const [storiesPage, setStoriesPage] = useState(1);

  const [postsLoading, setPostsLoading] = useState(false);
  const [feedsLoading, setFeedsLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const [allPostsLoaded, setAllPostsLoaded] = useState(initialPosts.length < 3);
  const [allFeedsLoaded, setAllFeedsLoaded] = useState(initialFeedItems.length < 3);
  const [allStoriesLoaded, setAllStoriesLoaded] = useState(initialStoriesItems.length < 3);

  const coverSrc = user.coverImage || '/default-cover.jpg';
  const avatarSrc = user.image || '/default-avatar.png';
  const locationText = Array.isArray(user.location) ? user.location.join(', ') : user.location || 'Unknown';

  const handleFollow = async () => {
    try {
      const result = await toggleFollow(user._id);
      setIsFollowing(result.isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleAddFriend = async () => {
    try {
      const result = await toggleFriend(user._id);
      setIsFriend(result.isFriend);
    } catch (error) {
      console.error('Error toggling friend:', error);
    }
  };

  const handleMessage = () => {
    // TODO: implement message action
    console.log('Message not implemented yet');
  };

  const loadMorePosts = async () => {
    if (postsLoading || allPostsLoaded) return;
    setPostsLoading(true);
    try {
      const nextPage = postsPage + 1;
      const data = await getUserCars({ userId: user._id, page: nextPage, limit: 3 });
      if (data.posts.length === 0) {
        setAllPostsLoaded(true);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
        setPostsPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadMoreFeeds = async () => {
    if (feedsLoading || allFeedsLoaded) return;
    setFeedsLoading(true);
    try {
      const nextPage = feedsPage + 1;
      const data = await getFeedPosts({ userId: user._id, limit: 3, page: nextPage });
      if (data.items.length === 0) {
        setAllFeedsLoaded(true);
      } else {
        setFeeds(prev => [...prev, ...data.items]);
        setFeedsPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more feeds:', error);
    } finally {
      setFeedsLoading(false);
    }
  };

  const loadMoreStories = async () => {
    if (storiesLoading || allStoriesLoaded) return;
    setStoriesLoading(true);
    try {
      const nextPage = storiesPage + 1;
      const data = await getStories({ userId: user._id, limit: 3, page: nextPage });
      if (data.items.length === 0) {
        setAllStoriesLoaded(true);
      } else {
        setStories(prev => [...prev, ...data.items]);
        setStoriesPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more stories:', error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const isOwnProfile = session.user.id === user._id;

  return (
    <div className='w-full max-w-7xl mx-auto'>
      {/* Cover area */}
      <div className='relative h-56 w-full bg-muted overflow-hidden rounded-b-md'>
        <Image src={coverSrc} alt={`${user.name} cover`} fill style={{ objectFit: 'cover' }} priority />
        {/* Overlay gradient for readability */}
        <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent' />
      </div>

      {/* Header card overlapping the cover */}
      <div className='relative -mt-12 px-6'>
        <div className='bg-card/95 backdrop-blur rounded-lg shadow-md p-6'>
          <div className='flex gap-4 items-start'>
            <div className='relative shrink-0'>
              <Image src={avatarSrc} alt={user.name} width={120} height={120} className='rounded-full ring-4 ring-white' />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between'>
                <div>
                  <h1 className='text-3xl font-bold truncate'>{user.name || 'Unnamed'}</h1>
                  <p className='text-muted-foreground truncate'>{user.status || 'No status'}</p>

                  {/* Badges */}
                  <div className='mt-2 flex gap-2 flex-wrap'>
                    {user.badges.map((badge) => (
                      <Badge key={badge} variant='secondary'>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                {!isOwnProfile && (
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={handleFollow}>
                      {isFollowing ? <UserCheck className='h-4 w-4 mr-2' /> : <Heart className='h-4 w-4 mr-2' />}
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant='outline' size='sm' onClick={handleAddFriend}>
                      {isFriend ? <UserCheck className='h-4 w-4 mr-2' /> : <UserPlus className='h-4 w-4 mr-2' />}
                      {isFriend ? 'Friends' : 'Add Friend'}
                    </Button>
                    <Button variant='default' size='sm' onClick={handleMessage}>
                      <MessageCircle className='h-4 w-4 mr-2' />
                      Message
                    </Button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground'>
                {isFriend && (
                  <span>
                    Friends
                  </span>
                )}
                {user.privacySettings.locationPublic && (
                  <>
                    {isFriend && <span className='hidden sm:inline'>·</span>}
                    <span>
                      Location: <strong className='text-foreground'>{locationText}</strong>
                    </span>
                  </>
                )}
                {user.privacySettings.emailPublic && (
                  <>
                    {(isFriend || user.privacySettings.locationPublic) && <span className='hidden sm:inline'>·</span>}
                    <span>
                      Email: <strong className='text-foreground'>{user.email || '—'}</strong>
                    </span>
                  </>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <div className='mt-4'>
                  <p className='text-sm'>{user.bio}</p>
                </div>
              )}

              {/* Platforms */}
              {user.platforms && user.platforms.length > 0 && (
                <div className='mt-4 flex gap-2 flex-wrap'>
                  {user.platforms.map((p) => {
                    const key = p.toLowerCase();
                    const href = (user.socials && user.socials[key]) || '#';
                    return (
                      <a
                        key={p}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:opacity-90 text-sm'
                      >
                        <span className='truncate max-w-24'>{p}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='mt-6 px-6'>
        <Tabs defaultValue='posts' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='posts'>Posts ({totalPosts})</TabsTrigger>
            <TabsTrigger value='feeds'>Feeds ({totalFeeds})</TabsTrigger>
            <TabsTrigger value='stories'>Stories ({totalStories})</TabsTrigger>
          </TabsList>

          <TabsContent value='posts' className='mt-6'>
            {/* Posts content */}
            <div className='grid gap-4'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className='border rounded-lg p-4'>
                    <h3 className='font-semibold'>{post.title}</h3>
                    <p className='text-sm text-muted-foreground'>Category: {post.category}</p>
                    {post.price && <p className='text-sm'>Price: {post.price} {post.currency}</p>}
                    <p className='text-xs text-muted-foreground'>Status: {post.status}</p>
                  </div>
                ))
              ) : (
                <p>No posts yet.</p>
              )}
            </div>
            {!allPostsLoaded && (
              <div className='mt-4 text-center'>
                <Button onClick={loadMorePosts} disabled={postsLoading}>
                  {postsLoading ? 'Loading...' : 'Load More Posts'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value='feeds' className='mt-6'>
            {/* Feeds content */}
            <div className='grid gap-4'>
              {feeds.length > 0 ? (
                feeds.map((item) => (
                  <div key={item.id} className='border rounded-lg p-4'>
                    <p>{item.text || item.question}</p>
                    <p className='text-xs text-muted-foreground'>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No feeds yet.</p>
              )}
            </div>
            {!allFeedsLoaded && (
              <div className='mt-4 text-center'>
                <Button onClick={loadMoreFeeds} disabled={feedsLoading}>
                  {feedsLoading ? 'Loading...' : 'Load More Feeds'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value='stories' className='mt-6'>
            {/* Stories content */}
            <div className='grid gap-4'>
              {stories.length > 0 ? (
                stories.map((story) => (
                  <div key={story.id} className='border rounded-lg p-4'>
                    <p>{story.caption || 'No caption'}</p>
                    <p className='text-xs text-muted-foreground'>Expires: {new Date(story.expiresAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No stories yet.</p>
              )}
            </div>
            {!allStoriesLoaded && (
              <div className='mt-4 text-center'>
                <Button onClick={loadMoreStories} disabled={storiesLoading}>
                  {storiesLoading ? 'Loading...' : 'Load More Stories'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}