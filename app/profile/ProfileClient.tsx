'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Share2, CheckCircle, Edit, Settings, Bell, Heart, TrendingUp, Award, Zap, LogOut, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOut } from '@/lib/auth/auth-client';
import { Skeleton } from '@/components/ui/skeleton'; // Add this import for skeleton loading
import { Input } from '@/components/ui/input'; // Add import for custom Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assume Select component exists; if not, use plain select with styling

import BadgesCarousel from '@/components/custom/carousel/BadgesCarousel';
import EditDrawer from '@/components/custom/profile/EditDrawer';
import PostsGrid from '@/components/custom/profile/PostsGrid';
import ActivityFeed from '@/components/custom/profile/ActivityFeed';
import ProgressSummary from '@/components/custom/profile/ProgressSummary';
import QuickActions from '@/components/custom/profile/QuickActions';
import ProTip from '@/components/custom/profile/ProTip';
import ProgressBars from '@/components/custom/profile/ProgressBars';
import SettingsAccordion from '@/components/custom/profile/SettingsAccordion';

type User = {
  id: string;
  name?: string | null;
  email?: string;
  image?: string | null;
};

type Post = {
  id: string;
  title: string;
  category: string;
  price?: number | null;
  images?: string[];
  status?: 'active' | 'sold' | 'draft';
  createdAt?: string;
  views?: number;
};

type Session = {
  user: User;
};

type ProfileClientProps = {
  session: Session;
};

export default function ProfileClient({ session }: ProfileClientProps) {
  const user = session.user;
  const router = useRouter();

  // Mock data for demo; replace with DB fetch later
  const userData = {
    badges: ['First Login', 'Verified Email', 'Top Poster', 'Community Helper', 'Streak Master'],
    progress: { posts: 15, friends: 8, points: 120 },
    rewards: { freePosts: 5, premiumAccess: false },
    verified: { email: true, social: false },
    bio: 'Passionate about cars and community building. Always exploring new adventures!',
    followers: 245,
    following: 180,
    postsCount: 42,
  };

  const [name, setName] = useState<string>(user?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null);
  const [isEditing, setIsEditing] = useState(false);

  // Add state for filters and sorting
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt'); // Options: 'createdAt', 'views'

  // Add state for search
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setName(user?.name ?? '');
    setImagePreview(user?.image ?? null);
    setImageFile(null);
  }, [user?.name, user?.image]);

  const handleFilesFromUploader = (files: File[]) => {
    const f = files?.[0] ?? null;
    if (!f) {
      setImageFile(null);
      setImagePreview(user?.image ?? null);
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(user?.image ?? null);
  };

  // Posts state
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [settingsOpen, setSettingsOpen] = useState<string[]>(['verified']);
  const handleSettingsChange = (value: string[] | string | null) => {
    const arr = Array.isArray(value) ? value : value ? [value] : [];
    if (!arr.includes('verified')) {
      setSettingsOpen(['verified', ...arr]);
    } else {
      setSettingsOpen(arr);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    async function load() {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const params = new URLSearchParams({
          userId: user.id,
          ...(categoryFilter !== 'all' && { category: categoryFilter }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
          sortBy,
          ...(searchQuery && { search: searchQuery }),
        });
        const res = await fetch(`/api/posts?${params}`);
        if (!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        if (mounted) setPosts(data.posts ?? []);
      } catch (err) {
        console.error(err);
        if (mounted) setPostsError('Could not load your posts.');
        // Still set posts to empty to trigger skeleton
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user?.id, categoryFilter, statusFilter, sortBy, searchQuery]); // Add searchQuery dependency

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my Tamago profile!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        toast.success('Share link copied to clipboard!');
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully!');
    router.push('/cont');
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPosts((p) => p?.filter((x) => x.id !== postId) ?? null);
      toast.success('Post deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post');
    }
  };

  const handleToggleActive = async (postId: string, current?: Post['status']) => {
    const newStatus = current === 'active' ? 'draft' : 'active';
    // optimistic update
    setPosts((p) => p?.map((x) => (x.id === postId ? { ...x, status: newStatus } : x)) ?? null);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success(`Post ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update post status');
      // revert
      setPosts((p) => p?.map((x) => (x.id === postId ? { ...x, status: current } : x)) ?? null);
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/posts/${postId}/edit`);
  };

  return (
    <div className='min-h-screen flex flex-col lg-flex-row'>
      <div className='flex flex-row items-start gap-4'>
        {/* Aside Section: Sticky on desktop, hidden on mobile */}
        <aside className='hidden lg:block lg:sticky lg:top-14 space-y-4 sm:space-y-6 p-4 sm:p-6'>
          <ActivityFeed
            activities={['Posted a new item 2 hours ago', 'Earned "Top Poster" badge yesterday', 'Followed 3 new users']}
            onLoadMore={() => console.log('Load more activities')}
          />

          <ProgressSummary
            posts={userData.progress.posts}
            friends={userData.progress.friends}
            onClaimReward={() => console.log('Claim reward')}
          />

          <QuickActions onCreatePost={() => router.push('/posts/create')} onEditProfile={() => setIsEditing(true)} />

          <ProTip tip='Share your posts to earn extra points and badges!' />
        </aside>

        <div className='container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 lg:ml-6'>
          {/* Main Layout: Grid with main content */}
          <div className='flex flex-col gap-4'>
            {/* Header Section */}
            <Card className='relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl' />
              <CardHeader className='relative flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8'>
                <Avatar className='h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-2xl rounded-sm'>
                  <AvatarImage src={imagePreview || user?.image || '/placeholder.svg'} />
                  <AvatarFallback className='text-2xl font-bold'>{(user?.name || 'U').charAt(0)}</AvatarFallback>
                </Avatar>

                <div className='flex-1 text-center md:text-left'>
                  <CardTitle className='text-3xl font-bold mb-2'>{user?.name}</CardTitle>
                  <p className='text-muted-foreground mb-4'>{user?.email}</p>
                  <p className='text-sm mb-4 max-w-md'>{userData.bio}</p>
                  <div className='flex justify-center md:justify-start space-x-6 text-sm'>
                    <div className='text-center'>
                      <div className='font-bold text-xl'>{userData.postsCount}</div>
                      <div className='text-muted-foreground'>Posts</div>
                    </div>
                    <div className='text-center'>
                      <div className='font-bold text-xl'>{userData.followers}</div>
                      <div className='text-muted-foreground'>Followers</div>
                    </div>
                    <div className='text-center'>
                      <div className='font-bold text-xl'>{userData.following}</div>
                      <div className='text-muted-foreground'>Following</div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col space-y-2'>
                  <Button onClick={shareProfile} variant='outline' className='hover:scale-105 transition-transform'>
                    <Share2 className='h-4 w-4 mr-2' /> Share
                  </Button>

                  <Button onClick={() => setIsEditing(true)} variant='outline' className='hover:scale-105 transition-transform'>
                    <Edit className='h-4 w-4 mr-2' /> Edit Profile
                  </Button>

                  <Button onClick={handleLogout} variant='destructive' className='hover:scale-105 transition-transform'>
                    <LogOut className='h-4 w-4 mr-2' /> Logout
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue='overview' className='w-full'>
              <TabsList className='grid w-full grid-cols-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-1 shadow-md'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='badges'>Badges</TabsTrigger>
                <TabsTrigger value='posts'>My Posts</TabsTrigger>
                <TabsTrigger value='progress'>Progress</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Quick Stats - Reuse ProgressSummary or similar */}
                  <Card className='hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl'>
                    <CardHeader>
                      <CardTitle className='flex items-center'>
                        <TrendingUp className='h-5 w-5 mr-2 text-primary' />
                        Activity Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex justify-between items-center'>
                        <span>Posts</span>
                        <span className='font-bold'>{userData.postsCount}</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Friends</span>
                        <span className='font-bold'>{userData.progress.friends}</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Points</span>
                        <span className='font-bold'>{userData.progress.points}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rewards */}
                  <Card className='hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl'>
                    <CardHeader>
                      <CardTitle className='flex items-center'>
                        <Award className='h-5 w-5 mr-2 text-secondary' />
                        Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex justify-between items-center'>
                        <span>Free Posts</span>
                        <Badge variant='secondary'>{userData.rewards.freePosts}</Badge>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Premium Access</span>
                        <Badge variant={userData.rewards.premiumAccess ? 'default' : 'outline'}>
                          {userData.rewards.premiumAccess ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <Button variant='outline' className='w-full hover:scale-105 transition-transform'>
                        <Zap className='h-4 w-4 mr-2 text-primary' />
                        Redeem Reward
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Placeholder */}
                <Card className='hover:shadow-lg transition-all duration-300 rounded-xl'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Heart className='h-5 w-5 mr-2 text-destructive' />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>No recent activity. Start posting to see updates here!</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='badges' className='space-y-6'>
                <Card className='rounded-xl'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Trophy className='h-5 w-5 mr-2' /> Your Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='overflow-hidden'>
                    <BadgesCarousel badges={userData.badges} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='posts' className='space-y-6'>
                {/* Enhanced filters and search in a card for better layout */}
                <Card className='p-4 rounded-xl'>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <Input
                      type='text'
                      placeholder='Search posts...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='flex-1'
                    />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className='w-full sm:w-48'>
                        <SelectValue placeholder='All Categories' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        {/* Add more options based on your categories, e.g., <SelectItem value='cars'>Cars</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className='w-full sm:w-48'>
                        <SelectValue placeholder='All Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='draft'>Draft</SelectItem>
                        <SelectItem value='sold'>Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-full sm:w-48'>
                        <SelectValue placeholder='Sort by Date' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='createdAt'>Sort by Date</SelectItem>
                        <SelectItem value='views'>Sort by Views</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {loadingPosts || postsError ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className='hover:shadow-lg transition-shadow'>
                        <CardHeader>
                          <div className='flex items-start justify-between w-full'>
                            <div className='flex items-center space-x-3'>
                              <Skeleton className='w-20 h-14 rounded' />
                              <div>
                                <Skeleton className='h-4 w-32 mb-1' />
                                <Skeleton className='h-3 w-20' />
                              </div>
                            </div>
                            <div className='text-right'>
                              <Skeleton className='h-4 w-16 mb-1' />
                              <Skeleton className='h-3 w-12' />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className='flex justify-between items-center'>
                            <div className='flex space-x-2'>
                              <Skeleton className='h-8 w-16' />
                              <Skeleton className='h-8 w-20' />
                            </div>
                            <Skeleton className='h-3 w-16' />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <PostsGrid posts={posts ?? []} onEdit={handleEditPost} onDelete={handleDeletePost} onToggle={handleToggleActive} />
                )}
              </TabsContent>

              <TabsContent value='progress' className='space-y-6'>
                <Card className='rounded-xl'>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressBars posts={userData.progress.posts} friends={userData.progress.friends} points={userData.progress.points} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='settings' className='space-y-6'>
                <Accordion type='multiple' value={settingsOpen} onValueChange={handleSettingsChange} className='w-full'>
                  <SettingsAccordion
                    value='verified'
                    icon={<CheckCircle className='h-4 w-4 mr-2 text-primary' />}
                    title='Verified Information'
                    content={
                      <>
                        <div className='flex items-start gap-2'>
                          <CheckCircle className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>Email Verified: {userData.verified.email ? 'Yes' : 'No'}</p>
                        </div>
                        <div className='flex items-start gap-2'>
                          <CheckCircle className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>Social Links Verified: {userData.verified.social ? 'Yes' : 'No'}</p>
                        </div>
                      </>
                    }
                  />
                  <SettingsAccordion
                    value='notifications'
                    icon={<Bell className='h-4 w-4 mr-2 text-secondary' />}
                    title='Notifications'
                    content={
                      <div className='flex items-start gap-2'>
                        <Bell className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                        <p className='text-sm text-muted-foreground'>Manage your notification preferences here.</p>
                      </div>
                    }
                    buttonText='Edit Notifications'
                    onButtonClick={() => console.log('Edit notifications')}
                  />
                  <SettingsAccordion
                    value='privacy'
                    icon={<Settings className='h-4 w-4 mr-2 text-secondary' />}
                    title='Privacy & Security'
                    content={
                      <div className='flex items-start gap-2'>
                        <Settings className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                        <p className='text-sm text-muted-foreground'>Control your privacy settings and account security.</p>
                      </div>
                    }
                    buttonText='Manage Privacy'
                    onButtonClick={() => console.log('Manage privacy')}
                  />
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* Aside Section: In grid on mobile, hidden on desktop */}
          <aside className='lg:hidden space-y-4 sm:space-y-6'>
            <ActivityFeed
              activities={['Posted a new item 2 hours ago', 'Earned "Top Poster" badge yesterday', 'Followed 3 new users']}
              onLoadMore={() => console.log('Load more activities')}
            />

            <ProgressSummary
              posts={userData.progress.posts}
              friends={userData.progress.friends}
              onClaimReward={() => console.log('Claim reward')}
            />

            <QuickActions onCreatePost={() => router.push('/posts/create')} onEditProfile={() => setIsEditing(true)} />

            <ProTip tip='Share your posts to earn extra points and badges!' />
          </aside>
        </div>
      </div>
      {/* Edit Drawer (shadcn Sheet) - controlled */}
      <EditDrawer
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            // discard unsaved changes on close
            setImageFile(null);
            setImagePreview(user?.image ?? null);
            setName(user?.name ?? '');
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        }}
        name={name}
        onNameChange={setName}
        email={user?.email ?? ''}
        imagePreview={user?.image ?? null} // Pass current image
        files={imageFile ? [imageFile] : []}
        userId={user?.id}
        onFilesChange={handleFilesFromUploader}
        onImageRemove={handleImageRemove}
      />
    </div>
  );
}
