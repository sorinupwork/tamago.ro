'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, UserCheck, Heart, ThumbsUp } from 'lucide-react';
import { toggleFollow } from '@/actions/auth/actions';
import { getUserCars } from '@/actions/auto/actions';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';
import sanitizeHtml from 'sanitize-html';

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
  reactions?: {
    likes: { total: number; userIds: string[] };
    comments: unknown[];
  };
  votes?: number[];
  votedUsers?: string[];
};

type StoryLocal = {
  id: string;
  caption?: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  createdAt: string;
  expiresAt: string;
  reactions?: {
    likes: { total: number; userIds: string[] };
    comments: unknown[];
  };
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
  address: string;
  emailVerified: boolean;
  privacySettings: {
    emailPublic: boolean;
    phonePublic: boolean;
    locationPublic: boolean;
    profileVisible: boolean;
  };
};

type PublicProfileClientProps = {
  session: Session | null;
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

  const router = useRouter();

  const handleViewPost = (post: Post) => {
    router.push(`/categorii/auto/${post.category}/${post.id}`);
  };

  const [postsLoading, setPostsLoading] = useState(false);
  const [feedsLoading, setFeedsLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const [allPostsLoaded, setAllPostsLoaded] = useState(initialPosts.length < 3);
  const [allFeedsLoaded, setAllFeedsLoaded] = useState(initialFeedItems.length < 3);
  const [allStoriesLoaded, setAllStoriesLoaded] = useState(initialStoriesItems.length < 3);

  const coverSrc = user.coverImage || '/default-cover.jpg';
  const avatarSrc = user.image || '/default-avatar.png';
  const locationText = user.address || 'Unknown';

  const handleFollow = async () => {
    try {
      const result = await toggleFollow(user._id);
      setIsFollowing(result.isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
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
        setPosts((prev) => [...prev, ...data.posts]);
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
        setFeeds((prev) => [...prev, ...data.items]);
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
        setStories((prev) => [...prev, ...data.items]);
        setStoriesPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more stories:', error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const isOwnProfile = session?.user?.id === user._id;

  return (
    <div className='w-full max-w-7xl mx-auto'>
      {/* Cover area */}
      <div className='relative h-56 w-full bg-muted overflow-hidden rounded-b-md'>
        <Image src={coverSrc} alt={`${user.name} cover`} fill style={{ objectFit: 'cover' }} priority />
        <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent' />
      </div>

      {/* Header card */}
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
                {session && !isOwnProfile && (
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={handleFollow}>
                      {isFollowing ? <UserCheck className='h-4 w-4 mr-2' /> : <Heart className='h-4 w-4 mr-2' />}
                      {isFollowing ? 'Following' : 'Follow'}
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
                {isFriend && <span>Friends</span>}
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
                  <p className='text-sm' dangerouslySetInnerHTML={{ __html: sanitizeHtml(user.bio) }} />
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
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                    {post.images && post.images.length > 0 && (
                      <div className='relative h-48 w-full'>
                        <Image src={post.images[0]} alt={post.title} fill className='object-cover' />
                      </div>
                    )}
                    <div className='p-4'>
                      <h3 className='font-semibold text-lg mb-2'>{post.title}</h3>
                      <p className='text-sm text-muted-foreground mb-1'>Category: {post.category}</p>
                      {post.price && (
                        <p className='text-sm font-medium mb-1'>
                          Price: {post.price} {post.currency}
                        </p>
                      )}
                      <p className='text-xs text-muted-foreground mb-3'>Status: {post.status}</p>
                      <Button onClick={() => handleViewPost(post)} size='sm' className='w-full'>
                        View Post
                      </Button>
                    </div>
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
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {feeds.length > 0 ? (
                feeds.map((item) => (
                  <div key={item.id} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                    {item.type === 'post' && item.files && item.files.length > 0 && (
                      <div className='relative h-48 w-full'>
                        <Image src={item.files[0].url} alt={item.text || 'Post'} fill className='object-cover' />
                      </div>
                    )}
                    <div className='p-4'>
                      {item.type === 'post' ? (
                        <>
                          <p className='font-medium mb-2' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.text || '') }} />
                          {item.tags && item.tags.length > 0 && (
                            <div className='flex gap-1 mb-2'>
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant='secondary' className='text-xs'>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className='font-medium mb-2' dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.question || '') }} />
                          {item.options && item.votes && (
                            <div className='space-y-1 mb-2'>
                              {item.options.map((option, index) => (
                                <div key={index} className='flex justify-between text-sm'>
                                  <span>{option}</span>
                                  <span>{item.votes?.[index] || 0} votes</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      <p className='text-xs text-muted-foreground mb-2'>{new Date(item.createdAt).toLocaleDateString()}</p>
                      <div className='flex gap-4 text-sm text-muted-foreground mb-3'>
                        <span className='flex items-center gap-1'>
                          <ThumbsUp className='h-4 w-4' />
                          {item.reactions?.likes?.total || 0}
                        </span>
                        <span className='flex items-center gap-1'>
                          <MessageCircle className='h-4 w-4' />
                          {item.reactions?.comments?.length || 0}
                        </span>
                      </div>
                      <Button onClick={() => router.push('/social')} size='sm' className='w-full'>
                        Vezi pe Social
                      </Button>
                    </div>
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
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {stories.length > 0 ? (
                stories.map((story) => (
                  <div key={story.id} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                    {story.files && story.files.length > 0 && (
                      <div className='relative h-48 w-full'>
                        <Image src={story.files[0].url} alt={story.caption || 'Story'} fill className='object-cover' />
                      </div>
                    )}
                    <div className='p-4'>
                      <p className='font-medium mb-2' dangerouslySetInnerHTML={{ __html: sanitizeHtml(story.caption || 'No caption') }} />
                      <p className='text-xs text-muted-foreground mb-2'>Expires: {new Date(story.expiresAt).toLocaleDateString()}</p>
                      <div className='flex gap-4 text-sm text-muted-foreground mb-3'>
                        <span className='flex items-center gap-1'>
                          <ThumbsUp className='h-4 w-4' />
                          {story.reactions?.likes?.total || 0} likes
                        </span>
                        <span className='flex items-center gap-1'>
                          <MessageCircle className='h-4 w-4' />
                          {story.reactions?.comments?.length || 0} comments
                        </span>
                      </div>
                      <Button onClick={() => router.push('/social')} size='sm' className='w-full'>
                        Vezi pe Social
                      </Button>
                    </div>
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
