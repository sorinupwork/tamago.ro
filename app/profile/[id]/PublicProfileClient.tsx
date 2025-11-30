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
import type { Post, FeedPost, StoryPost } from '@/lib/types';
import sanitizeHtml from 'sanitize-html';
import { CategoryEmptyState, SocialEmptyState } from '@/components/custom/empty';
import { reverseCategoryMapping } from '@/lib/categories';

type Session = {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string | null;
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
  initialFeedItems?: FeedPost[];
  initialFeedTotal?: number;
  initialStoriesItems?: StoryPost[];
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
  const [isFriend] = useState(initialIsFriend);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [feeds, setFeeds] = useState<FeedPost[]>(initialFeedItems);
  const [stories, setStories] = useState<StoryPost[]>(initialStoriesItems);

  const [totalPosts] = useState(initialPostsTotal);
  const [totalFeeds] = useState(initialFeedTotal);
  const [totalStories] = useState(initialStoriesTotal);

  const [postsPage, setPostsPage] = useState(1);
  const [feedsPage, setFeedsPage] = useState(1);
  const [storiesPage, setStoriesPage] = useState(1);

  const router = useRouter();

  const handleViewPost = (post: Post) => {
    const urlCategory = reverseCategoryMapping[post.category as keyof typeof reverseCategoryMapping] || post.category;
    router.push(`/categorii/auto/${urlCategory}/${post.id}`);
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
    <div className='w-full max-w-7xl mx-auto pb-8'>
      {/* Cover area */}
      <div className='relative h-40 sm:h-56 md:h-64 w-full bg-muted overflow-hidden rounded-b-md'>
        <Image src={coverSrc} alt={`${user.name} cover`} fill style={{ objectFit: 'cover' }} priority />
        <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent' />
      </div>

      {/* Header card */}
      <div className='relative -mt-16 sm:-mt-20 px-4 sm:px-6'>
        <div className='bg-card/95 backdrop-blur rounded-lg shadow-md p-4 sm:p-6'>
          <div className='flex flex-col sm:flex-row gap-4 items-start'>
            <div className='relative shrink-0 mx-auto sm:mx-0'>
              <Image
                src={avatarSrc}
                alt={user.name}
                width={120}
                height={120}
                className='rounded-lg ring-4 ring-background aspect-square object-cover'
              />
            </div>

            <div className='flex-1 min-w-0 w-full'>
              <div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
                <div className='w-full sm:w-auto'>
                  <h1 className='text-2xl sm:text-3xl font-bold wrap-break-word'>{user.name || 'Unnamed'}</h1>
                  <p className='text-muted-foreground wrap-break-word'>{user.status || 'No status'}</p>

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
                  <div className='flex gap-2 w-full sm:w-auto'>
                    <Button variant='outline' size='sm' onClick={handleFollow} className='flex-1 sm:flex-initial'>
                      {isFollowing ? <UserCheck className='h-4 w-4 mr-2' /> : <Heart className='h-4 w-4 mr-2' />}
                      {isFollowing ? 'Urmărești' : 'Urmărește'}
                    </Button>

                    <Button variant='default' size='sm' onClick={handleMessage} className='flex-1 sm:flex-initial'>
                      <MessageCircle className='h-4 w-4 mr-2' />
                      Mesaj
                    </Button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground'>
                {isFriend && <span>Prieteni</span>}
                {user.privacySettings.locationPublic && (
                  <>
                    {isFriend && <span className='hidden sm:inline'>·</span>}
                    <span className='break-all'>
                      Locație: <strong className='text-foreground'>{locationText}</strong>
                    </span>
                  </>
                )}
                {user.privacySettings.emailPublic && (
                  <>
                    {(isFriend || user.privacySettings.locationPublic) && <span className='hidden sm:inline'>·</span>}
                    <span className='break-all'>
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
      <div className='mt-6 px-4 sm:px-6'>
        <Tabs defaultValue='posts' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='posts'>Anunțuri ({totalPosts})</TabsTrigger>
            <TabsTrigger value='feeds'>Postări ({totalFeeds})</TabsTrigger>
            <TabsTrigger value='stories'>Povești ({totalStories})</TabsTrigger>
          </TabsList>

          <TabsContent value='posts' className='mt-6'>
            {/* Posts content */}
            {posts.length > 0 ? (
              <>
                <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {posts.map((post) => {
                    const categoryLabels: Record<string, string> = {
                      sell: 'Ofertă',
                      buy: 'Cerere',
                      rent: 'Închiriere',
                      auction: 'Licitație',
                    };
                    return (
                      <div key={post.id} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                        {post.images && post.images.length > 0 && (
                          <div className='relative aspect-video w-full'>
                            <Image src={post.images[0]} alt={post.title} fill className='object-cover' />
                          </div>
                        )}
                        <div className='p-4'>
                          <h3 className='font-semibold text-lg mb-2 line-clamp-2'>{post.title}</h3>
                          <p className='text-sm text-muted-foreground mb-1'>Categorie: {categoryLabels[post.category] || post.category}</p>
                          {post.category === 'buy' && 'minPrice' in post ? (
                            <p className='text-sm font-medium mb-1'>
                              Preț: {post.minPrice} - {post.maxPrice} {post.currency}
                            </p>
                          ) : 'price' in post && post.price ? (
                            <p className='text-sm font-medium mb-1'>
                              Preț: {post.price} {post.currency}
                            </p>
                          ) : null}
                          <Button onClick={() => handleViewPost(post)} size='sm' className='w-full'>
                            Vezi Anunțul
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!allPostsLoaded && (
                  <div className='mt-4 text-center'>
                    <Button onClick={loadMorePosts} disabled={postsLoading}>
                      {postsLoading ? 'Se încarcă...' : 'Încarcă Mai Multe Anunțuri'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <CategoryEmptyState
                activeTab='sell'
                title='Niciun anunț disponibil'
                description='Acest utilizator nu a publicat încă niciun anunț.'
                buttonLabel='Explorează Anunțuri'
                onButtonClick={() => router.push('/categorii/auto')}
              />
            )}
          </TabsContent>

          <TabsContent value='feeds' className='mt-6'>
            {/* Feeds content */}
            {feeds.length > 0 ? (
              <>
                <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {feeds.map((item) => (
                    <div key={item.id} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                      {item.type === 'post' && item.files && item.files.length > 0 && (
                        <div className='relative aspect-video w-full'>
                          <Image src={item.files[0].url} alt={item.text || 'Post'} fill className='object-cover' />
                        </div>
                      )}
                      <div className='p-4'>
                        {item.type === 'post' ? (
                          <>
                            <p
                              className='font-medium mb-2 line-clamp-3'
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.text || '') }}
                            />
                            {item.tags && item.tags.length > 0 && (
                              <div className='flex gap-1 mb-2 flex-wrap'>
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
                            <p
                              className='font-medium mb-2 line-clamp-2'
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.question || '') }}
                            />
                            {item.options && item.votes && (
                              <div className='space-y-1 mb-2'>
                                {item.options.map((option, index) => (
                                  <div key={index} className='flex justify-between text-sm gap-2'>
                                    <span className='truncate'>{option}</span>
                                    <span className='shrink-0'>{item.votes?.[index] || 0} voturi</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        <p className='text-xs text-muted-foreground mb-2'>{new Date(item.createdAt).toLocaleDateString('ro-RO')}</p>
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
                  ))}
                </div>
                {!allFeedsLoaded && (
                  <div className='mt-4 text-center'>
                    <Button onClick={loadMoreFeeds} disabled={feedsLoading}>
                      {feedsLoading ? 'Se încarcă...' : 'Încarcă Mai Multe Postări'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <SocialEmptyState
                type='posts'
                title='Nicio postare disponibilă'
                description='Acest utilizator nu a publicat încă nicio postare.'
                showButton={false}
              />
            )}
          </TabsContent>

          <TabsContent value='stories' className='mt-6'>
            {/* Stories content */}
            {stories.length > 0 ? (
              <>
                <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {stories.map((story) => (
                    <div key={story.id} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                      {story.files && story.files.length > 0 && (
                        <div className='relative aspect-video w-full'>
                          <Image src={story.files[0].url} alt={story.caption || 'Story'} fill className='object-cover' />
                        </div>
                      )}
                      <div className='p-4'>
                        <p
                          className='font-medium mb-2 line-clamp-3'
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(story.caption || 'Fără descriere') }}
                        />
                        <p className='text-xs text-muted-foreground mb-2'>
                          Expiră: {new Date(story.expiresAt).toLocaleDateString('ro-RO')}
                        </p>
                        <div className='flex gap-4 text-sm text-muted-foreground mb-3'>
                          <span className='flex items-center gap-1'>
                            <ThumbsUp className='h-4 w-4' />
                            {story.reactions?.likes?.total || 0} aprecieri
                          </span>
                          <span className='flex items-center gap-1'>
                            <MessageCircle className='h-4 w-4' />
                            {story.reactions?.comments?.length || 0} comentarii
                          </span>
                        </div>
                        <Button onClick={() => router.push('/social')} size='sm' className='w-full'>
                          Vezi pe Social
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {!allStoriesLoaded && (
                  <div className='mt-4 text-center'>
                    <Button onClick={loadMoreStories} disabled={storiesLoading}>
                      {storiesLoading ? 'Se încarcă...' : 'Încarcă Mai Multe Povești'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <SocialEmptyState
                type='stories'
                title='Nicio poveste disponibilă'
                description='Acest utilizator nu a publicat încă nicio poveste.'
                showButton={false}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
