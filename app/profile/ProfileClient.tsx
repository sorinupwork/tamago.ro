'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Settings, Bell, TrendingUp, Lock, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import BadgesCarousel from '@/components/custom/carousel/BadgesCarousel';
import EditProfileDrawer from '@/components/custom/drawer/EditProfileDrawer';
import PostsGrid from '@/components/custom/profile/PostsGrid';
import ActivityFeed from '@/components/custom/profile/ActivityFeed';
import ProgressSummary from '@/components/custom/profile/ProgressSummary';
import QuickActions from '@/components/custom/profile/QuickActions';
import ProTip from '@/components/custom/profile/ProTip';
import ProgressBars from '@/components/custom/profile/ProgressBars';
import SettingsAccordion from '@/components/custom/profile/SettingsAccordion';
import HeaderProfile from '@/components/custom/profile/HeaderProfile';
import PostsFilters from '@/components/custom/profile/PostsFilters';
import RecentActivity from '@/components/custom/profile/RecentActivity';
import RewardsCard from '@/components/custom/profile/RewardsCard';
import StoriesGrid from '@/components/custom/profile/StoriesGrid';
import FeedGrid from '@/components/custom/profile/FeedGrid';
import SecurityCard from '@/components/custom/profile/SecurityCard';
import RewardsDialog from '@/components/custom/profile/RewardsDialog';
import SecurityDialog from '@/components/custom/profile/SecurityDialog';
import PrivacyDialog from '@/components/custom/profile/PrivacyDialog';
import VerificationDialog from '@/components/custom/profile/VerificationDialog';
import { getUserCars } from '@/actions/auto/actions';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getStories } from '@/actions/social/stories/actions';
import { sendVerificationEmail, claimReward } from '@/actions/auth/actions';
import type { User } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

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

type ProfileClientProps = {
  user: User;
  initialFeedItems?: FeedItemLocal[];
  initialFeedTotal?: number;
  initialStoriesItems?: StoryLocal[];
  initialStoriesTotal?: number;
  initialBadges?: string[];
  initialBio?: string;
  initialFollowers?: number;
  initialFollowing?: number;
  initialPostsTotal?: number;
  initialPrivacySettings?: {
    emailPublic: boolean;
    phonePublic: boolean;
    locationPublic: boolean;
    profileVisible: boolean;
    twoFactorEnabled?: boolean;
  };
};

type FeedQueryParams = {
  userId?: string | undefined;
  page: number;
  limit: number;
  type?: 'post' | 'poll';
};

const getTimeAgo = (date: Date | string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Acum câteva minute';
  if (diffHours < 24) return `Acum ${diffHours} ore`;
  if (diffDays < 30) return `Acum ${diffDays} zile`;
  return `Acum ${Math.floor(diffDays / 30)} luni`;
};

export default function ProfileClient({
  user,
  initialFeedItems = [],
  initialFeedTotal = 0,
  initialStoriesItems = [],
  initialBadges = [],
  initialBio = '',
  initialFollowers = 0,
  initialFollowing = 0,
  initialPostsTotal = 0,
  initialStoriesTotal = 0,
  initialPrivacySettings,
}: ProfileClientProps) {
  const router = useRouter();
  const [emailVerified] = useState(Boolean(user?.emailVerified));
  const calculatedTotalPosts = initialPostsTotal + initialStoriesTotal;
  const totalFriends = initialFollowers + initialFollowing;
  const verificationCount = emailVerified ? 1 : 0;
  const [privacySettings, setPrivacySettings] = useState(
    initialPrivacySettings || {
      emailPublic: false,
      phonePublic: false,
      locationPublic: false,
      profileVisible: true,
      twoFactorEnabled: false,
    }
  );
  const privacyPoints =
    ((privacySettings.emailPublic ? 1 : 0) +
      (privacySettings.phonePublic ? 1 : 0) +
      (privacySettings.locationPublic ? 1 : 0) +
      (privacySettings.profileVisible ? 1 : 0)) *
    5;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialPrivacySettings?.twoFactorEnabled ?? false);
  const cappedPosts = Math.min(calculatedTotalPosts, 4);
  const cappedFriends = Math.min(totalFriends, 10);
  const points = (cappedPosts + cappedFriends + verificationCount) * 5 + privacyPoints + (twoFactorEnabled ? 5 : 0);
  const [userData, setUserData] = useState({
    badges: initialBadges,
    progress: {
      posts: calculatedTotalPosts,
      friends: totalFriends,
      points: points,
      verification: verificationCount,
    },
    rewards: { freePosts: 4, premiumAccess: false },
    verified: { email: initialBadges.includes('Email Verificat'), social: initialBadges.includes('Social') },
    bio: initialBio,
    postsCount: calculatedTotalPosts,
    followers: initialFollowers,
    following: initialFollowing,
    joinDate: new Date(user.createdAt || new Date()).toLocaleDateString('ro-RO'),
    lastActive: getTimeAgo(user.updatedAt || new Date()),
  });

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      verified: { email: prev.badges.includes('Email Verificat'), social: prev.badges.includes('Social') },
      progress: {
        ...prev.progress,
        verification: emailVerified ? 1 : 0,
      },
      postsCount: prev.progress.posts,
    }));
  }, [emailVerified]);

  const dynamicQuests = [
    {
      id: 'post-quest',
      title: 'Postează 4 articole',
      description: 'Creează și postează 4 articole pentru a câștiga recompense.',
      progress: userData.progress.posts,
      total: 4,
      reward: 'Insignă Creator',
      type: 'posts' as const,
    },
    {
      id: 'friends-quest',
      title: 'Adaugă 10 prieteni',
      description: 'Conectează-te cu 10 prieteni pentru a crește rețeaua socială.',
      progress: userData.progress.friends,
      total: 10,
      reward: 'Insignă Prietenos',
      type: 'friends' as const,
    },
    {
      id: 'points-quest',
      title: 'Acumulează 100 puncte',
      description: 'Cumpără sau vinde articole pentru a acumula 100 puncte.',
      progress: userData.progress.points,
      total: 100,
      reward: 'Acces Premium',
      type: 'points' as const,
    },
    {
      id: 'verify-email',
      title: 'Verifică contul',
      description: 'Verifică email-ul pentru securitate crescută.',
      progress: userData.progress.verification,
      total: 1,
      reward: 'Insignă Verificat',
      type: 'verification' as const,
    },
  ];

  const dynamicRewards = [
    {
      id: 'badge-posts',
      title: 'Insignă Creator',
      description: 'Insignă specială pentru creator de conținut.',
      claimed: false,
      available: userData.progress.posts >= 4 && !userData.badges.includes('Creator'),
    },
    {
      id: 'premium-access',
      title: 'Acces Premium',
      description: 'Acces nelimitat la vânzări și funcții premium.',
      claimed: false,
      available: userData.progress.points >= 100,
    },
    {
      id: 'badge-friends',
      title: 'Insignă Prietenos',
      description: 'Insignă specială pentru conexiuni sociale.',
      claimed: false,
      available: userData.progress.friends >= 10 && !userData.badges.includes('Prietenos'),
    },
    {
      id: 'badge-verification',
      title: 'Insignă Verificat',
      description: 'Insignă pentru cont verificat.',
      claimed: false,
      available: userData.progress.verification >= 1 && !userData.badges.includes('Verificat'),
    },
  ];

  const [activities, setActivities] = useState<string[]>([]);

  const [activityFeedActivities, setActivityFeedActivities] = useState<string[]>([]);

  // Notification settings
  const [emailVerificationNotifications, setEmailVerificationNotifications] = useState(false);
  const [socialPostNotifications, setSocialPostNotifications] = useState(false);
  const [marketplaceNotifications, setMarketplaceNotifications] = useState(false);
  const [followerNotifications, setFollowerNotifications] = useState(false);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(user?.coverImage ?? null);
  const [location, setLocation] = useState<[number, number]>(user?.location || [0, 0]);
  const [isEditing, setIsEditing] = useState(false);

  const [rewardsDialogOpen, setRewardsDialogOpen] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setName(user?.name ?? '');
    setImagePreview(user?.image ?? null);
    setImageFile(null);
    setCoverPreview(user?.coverImage ?? null);
    setCoverFile(null);
    setLocation(user?.location || [0, 0]);
  }, [user?.name, user?.image, user?.coverImage, user?.location]);

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

  const handleCoverFilesFromUploader = (files: File[]) => {
    const f = files?.[0] ?? null;
    if (!f) {
      setCoverFile(null);
      setCoverPreview(user?.coverImage ?? null);
      return;
    }
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(user?.image ?? null);
  };

  const handleCoverRemove = () => {
    setCoverFile(null);
    setCoverPreview(user?.coverImage ?? null);
  };

  const handleRewardsClick = () => {
    setRewardsDialogOpen(true);
  };

  const handleSecurityClick = () => {
    setSecurityDialogOpen(true);
  };

  const handlePrivacyClick = () => {
    setPrivacyDialogOpen(true);
  };

  const handleVerificationClick = () => {
    setVerificationDialogOpen(true);
  };

  const handleVerificationRequest = async () => {
    await sendVerificationEmail();
    setActivities((prev) => [`Email de verificare trimis - ${new Date().toLocaleString()}`, ...prev.slice(0, 9)]);
  };

  const handleClaimReward = async (rewardId: string) => {
    try {
      const result = await claimReward(rewardId);
      if (result.success) {
        toast.success(result.message);
        let newBadge: string | null = null;
        if (rewardId === 'verify-email') {
          newBadge = 'Email Verificat';
        } else if (rewardId === 'badge-social') {
          newBadge = 'Social';
        }
        if (newBadge && !userData.badges.includes(newBadge)) {
          setUserData((prev) => ({
            ...prev,
            badges: [...prev.badges, newBadge!],
            progress: {
              ...prev.progress,
              verification: rewardId === 'verify-email' ? 1 : prev.progress.verification,
            },
          }));
        }
        setActivities((prev) => [`Recompensă revendicată: ${result.message} - ${new Date().toLocaleString()}`, ...prev.slice(0, 9)]);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to claim reward');
    }
  };

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const POSTS_PER_PAGE = 3;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    if (!user?.id || page === currentPage) return;
    setLoadingPosts(true);
    try {
      const params = {
        userId: user.id,
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        sortBy,
        ...(searchQuery && { search: searchQuery }),
        page,
        limit: POSTS_PER_PAGE,
      };
      const data = await getUserCars(params);
      setPosts(data.posts);
      setTotalPosts(data.total);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const [clientFeedItems, setClientFeedItems] = useState<FeedItemLocal[]>(initialFeedItems);
  const [clientFeedPage, setClientFeedPage] = useState(1);
  const [clientFeedLoading, setClientFeedLoading] = useState(false);
  const [clientFeedTotal, setClientFeedTotal] = useState(initialFeedTotal || 0);
  const clientFeedTotalPages = Math.max(1, Math.ceil((clientFeedTotal || 0) / 3));

  const [feedShowPosts, setFeedShowPosts] = useState(true);
  const [feedShowPolls, setFeedShowPolls] = useState(true);
  const deriveFeedType = (posts: boolean, polls: boolean) => {
    if (posts && !polls) return 'post';
    if (!posts && polls) return 'poll';
    return 'both';
  };

  const [clientStories, setClientStories] = useState<StoryLocal[]>(initialStoriesItems);
  const [clientStoriesPage, setClientStoriesPage] = useState(1);
  const [clientStoriesLoading, setClientStoriesLoading] = useState(false);
  const [clientStoriesTotal, setClientStoriesTotal] = useState(initialStoriesTotal || 0);
  const clientStoriesTotalPages = Math.max(1, Math.ceil((clientStoriesTotal || 0) / 3));

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    async function load(page = 1, append = false) {
      setLoadingPosts(true);
      try {
        const params = {
          userId: user.id,
          ...(categoryFilter !== 'all' && { category: categoryFilter }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
          sortBy,
          ...(searchQuery && { search: searchQuery }),
          page,
          limit: POSTS_PER_PAGE,
        };
        const data = await getUserCars(params);
        if (mounted) {
          setPosts((prev) => (append && prev ? [...prev, ...data.posts] : data.posts));
          setTotalPosts(data.total);
          setCurrentPage(page);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user?.id, categoryFilter, statusFilter, sortBy, searchQuery]);

  const handleStoriesPageChange = async (page: number) => {
    if (!user?.id || page === clientStoriesPage) return;
    setClientStoriesLoading(true);
    try {
      const res = await getStories({ userId: user?.id, page, limit: 3 });
      setClientStoriesPage(page);
      setClientStories(res.items);
      setClientStoriesTotal(res.total);
    } catch (err) {
      console.error('Error loading stories page:', err);
    } finally {
      setClientStoriesLoading(false);
    }
  };

  const handleFeedPageChange = async (page: number, typeOverride?: 'post' | 'poll' | 'both') => {
    if (!user?.id) return;
    if (!typeOverride && page === clientFeedPage && clientFeedItems.length > 0) return;
    setClientFeedLoading(true);
    try {
      const type = typeOverride ?? deriveFeedType(feedShowPosts, feedShowPolls);
      const params: FeedQueryParams = { userId: user?.id, page, limit: 3 };
      if (type && type !== 'both') params.type = type;
      const res = await getFeedPosts(params);
      const newTotalPages = Math.max(1, Math.ceil((res.total || 0) / 3));
      if (page > newTotalPages) {
        const adjusted = await getFeedPosts({ ...params, page: newTotalPages });
        setClientFeedItems(adjusted.items);
        setClientFeedTotal(adjusted.total);
        setClientFeedPage(newTotalPages);
      } else {
        setClientFeedItems(res.items);
        setClientFeedTotal(res.total);
        setClientFeedPage(page);
      }
    } catch (err) {
      console.error('Error loading feed page:', err);
    } finally {
      setClientFeedLoading(false);
    }
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id || ''}`;
    if (navigator.share) {
      navigator.share({
        title: 'Vezi profilul meu Tamago!',
        url: profileUrl,
      });
    } else {
      navigator.clipboard?.writeText(profileUrl).then(() => {
        toast.success('Link de distribuire copiat în clipboard!');
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    console.log('Delete not implemented yet for post:', postId);
  };

  const handleToggleActive = async (postId: string, current?: Post['status']) => {
    console.log('Toggle not implemented yet for post:', postId, 'current status:', current);
  };

  const handleEditPost = (postId: string) => {
    router.push(`/posts/${postId}/edit`);
  };

  const handleViewPost = (post: Post) => {
    router.push(`/categorii/auto/${post.category}/${post.id}`);
  };

  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      <div className='w-full flex flex-row items-start gap-4'>
        <aside className='hidden lg:block lg:basis-1/4 lg:flex-none lg:sticky lg:top-14 space-y-4 p-2'>
          <ActivityFeed activities={activityFeedActivities} onClear={() => setActivityFeedActivities([])} />

          <RecentActivity activities={activities} onClear={() => setActivities([])} />

          <QuickActions />

          <ProgressSummary
            posts={userData.progress.posts}
            friends={userData.progress.friends}
            points={userData.progress.points}
            verification={userData.progress.verification}
            onOpenDialog={() => setRewardsDialogOpen(true)}
          />
          <ProTip />
        </aside>

        <div className='flex-1 p-2 space-y-4 lg:basis-3/4'>
          <div className='flex flex-col gap-2'>
            <HeaderProfile
              user={user}
              userData={userData}
              imagePreview={imagePreview}
              avatarHref={user?.id ? `/profile/${user.id}` : undefined}
              shareProfile={shareProfile}
              setIsEditing={setIsEditing}
              platforms={user?.platforms}
              onVerifyClick={() => setVerificationDialogOpen(true)}
            />

            <Tabs defaultValue='overview' className='w-full'>
              <TabsList className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md gap-2 p-2'>
                <TabsTrigger value='overview' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                  General
                </TabsTrigger>

                <TabsTrigger value='feed' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                  Feed
                </TabsTrigger>

                <TabsTrigger value='stories' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                  Stories
                </TabsTrigger>

                <TabsTrigger value='anunturi' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                  Anunțuri
                </TabsTrigger>

                <TabsTrigger value='progress' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                  Progres
                </TabsTrigger>
                <TabsTrigger value='settings' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                  Setări
                </TabsTrigger>
              </TabsList>

              <TabsContent value='overview'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                  <RewardsCard
                    freePosts={userData.rewards.freePosts}
                    premiumAccess={userData.rewards.premiumAccess}
                    onSellClick={handleRewardsClick}
                  />
                  <SecurityCard
                    title='Securitate Cont'
                    description='Verifică parola și activează autentificarea în doi pași pentru a proteja contul tău.'
                    status='warning'
                    icon={<Lock className='h-5 w-5 mr-2 text-blue-500' />}
                    buttonText='Gestionează Securitatea'
                    onButtonClick={handleSecurityClick}
                  />
                  <SecurityCard
                    title='Confidențialitate'
                    description='Controlează cine poate vedea profilul tău și informațiile personale.'
                    status='secure'
                    icon={<Eye className='h-5 w-5 mr-2 text-green-500' />}
                    buttonText='Setări Confidențialitate'
                    onButtonClick={handlePrivacyClick}
                  />
                  <SecurityCard
                    title='Verificare Cont'
                    description='Verifică email-ul și conturile sociale pentru a crește încrederea în platformă.'
                    status={userData.verified.email ? 'secure' : 'danger'}
                    icon={<CheckCircle className='h-5 w-5 mr-2 text-purple-500' />}
                    buttonText='Verifică Acum'
                    onButtonClick={handleVerificationClick}
                  />
                </div>
              </TabsContent>

              <TabsContent value='feed'>
                <FeedGrid
                  userId={user?.id}
                  initialItems={clientFeedItems}
                  loadingMore={clientFeedLoading}
                  currentPage={clientFeedPage}
                  totalPages={clientFeedTotalPages}
                  onPageChange={handleFeedPageChange}
                  showPosts={feedShowPosts}
                  showPolls={feedShowPolls}
                  onFilterToggle={(which: 'posts' | 'polls', value: boolean) => {
                    const nextShowPosts = which === 'posts' ? value : feedShowPosts;
                    const nextShowPolls = which === 'polls' ? value : feedShowPolls;
                    setFeedShowPosts(nextShowPosts);
                    setFeedShowPolls(nextShowPolls);
                    const newType = deriveFeedType(nextShowPosts, nextShowPolls);
                    setClientFeedPage(1);
                    void handleFeedPageChange(1, newType);
                  }}
                />
              </TabsContent>

              <TabsContent value='stories' className='space-y-6'>
                <StoriesGrid
                  userId={user?.id}
                  initialItems={clientStories}
                  loadingMore={clientStoriesLoading}
                  currentPage={clientStoriesPage}
                  totalPages={clientStoriesTotalPages}
                  onPageChange={handleStoriesPageChange}
                />
              </TabsContent>

              <TabsContent value='anunturi'>
                <div className='flex flex-col flex-1 gap-4'>
                  <PostsFilters
                    searchQuery={searchQuery}
                    onSearchChange={(value) => setSearchQuery(value)}
                    categoryFilter={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />

                  <PostsGrid
                    posts={posts ?? []}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    onToggle={handleToggleActive}
                    onView={handleViewPost}
                    loadingMore={loadingPosts && currentPage > 1}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value='progress'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                  <ProgressBars posts={userData.progress.posts} friends={userData.progress.friends} points={userData.progress.points} />

                  <BadgesCarousel badges={userData.badges} title='Insignele Tale' className='xl:col-span-2' />
                </div>
              </TabsContent>

              <TabsContent value='settings'>
                <div className='flex flex-col md:flex-row md:flex-wrap items-stretch gap-4'>
                  <SettingsAccordion
                    value='verified'
                    defaultOpen={true}
                    icon={<CheckCircle className='h-4 w-4 mr-2 text-primary' />}
                    title='Notificări Verificare Email'
                    progressValue={userData.progress.verification * 100}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <CheckCircle className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>Email Verificat: {userData.verified.email ? 'Da' : 'Nu'}</p>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Notificări pentru verificare email</span>
                          <Switch
                            checked={emailVerificationNotifications}
                            onCheckedChange={(checked) => {
                              setEmailVerificationNotifications(checked);
                              const action = checked ? 'activat' : 'dezactivat';
                              setActivityFeedActivities((prev) => [
                                `Notificări pentru email verificare ${action} - ${new Date().toLocaleString()}`,
                                ...prev.slice(0, 9),
                              ]);
                              toast.success(`Notificări pentru email verificare ${checked ? 'activat' : 'dezactivat'}`);
                            }}
                          />
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Notificări Email</span>
                            <span>{emailVerificationNotifications ? '1' : '0'}/1</span>
                          </div>
                          <Progress value={emailVerificationNotifications ? 100 : 0} className='h-2' />
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Progres Verificare</span>
                            <span>{userData.progress.verification}/1</span>
                          </div>
                          <Progress value={userData.progress.verification * 100} className='h-2' />
                        </div>
                      </div>
                    }
                  />

                  <SettingsAccordion
                    value='social-posts'
                    icon={<Bell className='h-4 w-4 mr-2 text-secondary' />}
                    title='Notificări Postări Sociale'
                    showSecurityLevel={false}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <Bell className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>Gestionează notificări pentru feed, polls și stories.</p>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Notificări pentru postări sociale</span>
                          <Switch
                            checked={socialPostNotifications}
                            onCheckedChange={(checked) => {
                              setSocialPostNotifications(checked);
                              const action = checked ? 'activat' : 'dezactivat';
                              setActivityFeedActivities((prev) => [
                                `Notificări pentru postări sociale ${action} - ${new Date().toLocaleString()}`,
                                ...prev.slice(0, 9),
                              ]);
                              toast.success(`Notificări pentru postări sociale ${checked ? 'activat' : 'dezactivat'}`);
                            }}
                          />
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Postări</span>
                            <span>{userData.progress.posts}</span>
                          </div>
                          <Progress value={Math.min(userData.progress.posts, 100)} className='h-2' />
                        </div>
                      </div>
                    }
                  />

                  <SettingsAccordion
                    value='marketplace'
                    icon={<TrendingUp className='h-4 w-4 mr-2 text-primary' />}
                    title='Notificări Marketplace'
                    showSecurityLevel={false}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <TrendingUp className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>
                            Notificări pentru vânzări, cumpărări, închirieri, licitații mașini.
                          </p>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Notificări pentru marketplace</span>
                          <Switch
                            checked={marketplaceNotifications}
                            onCheckedChange={(checked) => {
                              setMarketplaceNotifications(checked);
                              const action = checked ? 'activat' : 'dezactivat';
                              setActivityFeedActivities((prev) => [
                                `Notificări pentru marketplace ${action} - ${new Date().toLocaleString()}`,
                                ...prev.slice(0, 9),
                              ]);
                              toast.success(`Notificări pentru marketplace ${checked ? 'activat' : 'dezactivat'}`);
                            }}
                          />
                        </div>
                      </div>
                    }
                  />

                  <SettingsAccordion
                    value='followers'
                    icon={<Settings className='h-4 w-4 mr-2 text-secondary' />}
                    title='Notificări Followers'
                    progressValue={(userData.progress.friends / 10) * 100}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <Settings className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>Notificări când cineva te urmărește sau interacționează.</p>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Notificări pentru followers</span>
                          <Switch
                            checked={followerNotifications}
                            onCheckedChange={(checked) => {
                              setFollowerNotifications(checked);
                              const action = checked ? 'activat' : 'dezactivat';
                              setActivityFeedActivities((prev) => [
                                `Notificări pentru followers ${action} - ${new Date().toLocaleString()}`,
                                ...prev.slice(0, 9),
                              ]);
                              toast.success(`Notificări pentru followers ${checked ? 'activat' : 'dezactivat'}`);
                            }}
                          />
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Prieteni</span>
                            <span>{userData.progress.friends}</span>
                          </div>
                          <Progress value={Math.min(userData.progress.friends, 100)} className='h-2' />
                        </div>
                      </div>
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <aside className='lg:hidden space-y-4 sm:space-y-6'>
            <ActivityFeed
              activities={activityFeedActivities}
              onLoadMore={() => console.log('Încarcă mai multe notificări')}
              onClear={() => setActivityFeedActivities([])}
            />

            <RecentActivity activities={activities} onClear={() => setActivities([])} />

            <QuickActions />

            <ProgressSummary
              posts={userData.progress.posts}
              friends={userData.progress.friends}
              points={userData.progress.points}
              verification={userData.progress.verification}
              onOpenDialog={() => setRewardsDialogOpen(true)}
            />
            <ProTip />
          </aside>
        </div>
      </div>

      <EditProfileDrawer
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setImageFile(null);
            setImagePreview(user?.image ?? null);
            setCoverFile(null);
            setCoverPreview(user?.coverImage ?? null);
            setName(user?.name ?? '');
            setLocation(user?.location || [0, 0]);
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        }}
        name={name}
        onNameChange={(value) => setName(value)}
        email={user?.email ?? ''}
        imagePreview={imagePreview}
        coverPreview={coverPreview}
        files={imageFile ? [imageFile] : []}
        coverFiles={coverFile ? [coverFile] : []}
        userId={user?.id}
        onFilesChange={handleFilesFromUploader}
        onCoverFilesChange={handleCoverFilesFromUploader}
        onImageRemove={handleImageRemove}
        onCoverImageRemove={handleCoverRemove}
        bioInitial={user?.bio ?? ''}
        platformsInitial={user?.platforms ?? []}
        locationInitial={location}
        addressInitial={user?.address ?? ''}
        onLocationChange={setLocation}
        onActivityUpdate={(activity) => setActivities((prev) => [activity, ...prev.slice(0, 9)])}
      />

      <RewardsDialog
        open={rewardsDialogOpen}
        onOpenChange={setRewardsDialogOpen}
        currentProgress={userData.progress}
        onClaimReward={handleClaimReward}
        quests={dynamicQuests}
        rewards={dynamicRewards}
        badges={userData.badges}
      />

      <SecurityDialog
        open={securityDialogOpen}
        onOpenChange={setSecurityDialogOpen}
        onActivityUpdate={(activity) => setActivities((prev) => [activity, ...prev.slice(0, 9)])}
        onTwoFactorChange={setTwoFactorEnabled}
        initialTwoFactorEnabled={privacySettings.twoFactorEnabled ?? false}
        onPrivacySettingsUpdate={(update) => setPrivacySettings((prev) => ({ ...prev, ...update }))}
      />

      <PrivacyDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
        onActivityUpdate={(activity) => setActivities((prev) => [activity, ...prev.slice(0, 9)])}
        initialPrivacySettings={privacySettings}
        onPrivacySettingsUpdate={setPrivacySettings}
      />

      <VerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        isEmailVerified={userData.verified.email}
        userEmail={user?.email ?? ''}
        onVerificationRequest={handleVerificationRequest}
      />
    </div>
  );
}
