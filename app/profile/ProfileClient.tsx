'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Settings, Bell, TrendingUp, Lock, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

type Session = {
  user: User;
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
  session: Session;
  initialFeedItems?: FeedItemLocal[];
  initialFeedTotal?: number;
  initialStoriesItems?: StoryLocal[];
  initialStoriesTotal?: number;
  initialBadges?: string[];
  initialBio?: string;
};

type FeedQueryParams = {
  userId?: string | undefined;
  page: number;
  limit: number;
  type?: 'post' | 'poll';
};

export default function ProfileClient({
  session,
  initialFeedItems = [],
  initialFeedTotal = 0,
  initialStoriesItems = [],
  initialStoriesTotal = 0,
  initialBadges = [],
  initialBio = '',
}: ProfileClientProps) {
  const user = session.user;
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(Boolean(user?.emailVerified));
  const [userData, setUserData] = useState({
    badges: initialBadges,
    progress: {
      posts: 15,
      friends: 8,
      points: 120,
      verification: initialBadges.filter(b => b === 'Email Verificat' || b === 'Social').length,
    }, // TODO: Calculate from real data
    rewards: { freePosts: 5, premiumAccess: false }, // TODO: Calculate from real data
    verified: { email: initialBadges.includes('Email Verificat'), social: initialBadges.includes('Social') },
    bio: initialBio,
    followers: 245, // TODO: Calculate from real data
    following: 180, // TODO: Calculate from real data
    postsCount: 42, // TODO: Calculate from real data
    joinDate: 'Ian 2023', // TODO: Calculate from real data
    lastActive: 'Acum 2 ore', // TODO: Calculate from real data
  });

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      verified: { email: prev.badges.includes('Email Verificat'), social: prev.badges.includes('Social') },
      progress: {
        ...prev.progress,
        verification: prev.badges.filter(b => b === 'Email Verificat' || b === 'Social').length,
      },
    }));
  }, []);

  const dynamicQuests = [
    {
      id: 'post-quest',
      title: 'Postează 5 articole',
      description: 'Creează și postează 5 articole pentru a câștiga recompense.',
      progress: userData.progress.posts,
      total: 20,
      reward: '5 Postări Gratuite',
      type: 'posts' as const,
    },
    {
      id: 'friends-quest',
      title: 'Adaugă 10 prieteni',
      description: 'Conectează-te cu 10 prieteni pentru a crește rețeaua socială.',
      progress: userData.progress.friends,
      total: 10,
      reward: 'Insignă "Social"',
      type: 'friends' as const,
    },
    {
      id: 'points-quest',
      title: 'Acumulează 200 puncte',
      description: 'Cumpără sau vinde articole pentru a acumula 200 puncte.',
      progress: userData.progress.points,
      total: 200,
      reward: 'Acces Premium',
      type: 'points' as const,
    },
    {
      id: 'verify-email',
      title: 'Verifică email-ul',
      description: 'Verifică adresa de email pentru securitate crescută.',
      progress: emailVerified ? 1 : 0,
      total: 1,
      reward: 'Insignă "Verificat"',
      type: 'verification' as const,
    },
  ];

  const dynamicRewards = [
    {
      id: 'free-posts',
      title: 'Postări Gratuite',
      description: 'Primești 5 postări gratuite pentru vânzări.',
      claimed: false,
      available: userData.progress.posts >= 20,
    },
    {
      id: 'premium-access',
      title: 'Acces Premium',
      description: 'Acces nelimitat la vânzări și funcții premium.',
      claimed: false,
      available: userData.progress.points >= 200,
    },
    {
      id: 'badge-social',
      title: 'Insignă Social',
      description: 'Insignă specială pentru conexiuni sociale.',
      claimed: false,
      available: userData.progress.friends >= 10 && !userData.badges.includes('Social'),
    },
    {
      id: 'verify-email',
      title: 'Insignă Verificat',
      description: 'Insignă pentru cont verificat.',
      claimed: false,
      available: emailVerified && !userData.badges.includes('Email Verificat'),
    },
  ];

  const [activities, setActivities] = useState<string[]>([
    'Bine ai venit pe platformă!',
    'Completează-ți profilul pentru mai multe funcții',
  ]);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(user?.coverImage ?? null);
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
  }, [user?.name, user?.image, user?.coverImage]);

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
          <ActivityFeed
            activities={['Ai primit o ofertă nouă', 'Comentariu pe postarea ta', 'Urmărit de un nou utilizator']}
            onLoadMore={() => toast.success('Încarcă mai multe notificări')}
          />

          <RecentActivity activities={activities} />

          <QuickActions />

          <ProgressSummary
            posts={userData.progress.posts}
            friends={userData.progress.friends}
            points={userData.progress.points}
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
                    title='Informații Verificate'
                    progressValue={(userData.progress.verification / 2) * 100}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <CheckCircle className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>Email Verificat: {userData.verified.email ? 'Da' : 'Nu'}</p>
                        </div>
                        <div className='flex items-start gap-2'>
                          <CheckCircle className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>
                            Link-uri Sociale Verificate: {userData.verified.social ? 'Da' : 'Nu'}
                          </p>
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Progres Verificare</span>
                            <span>{userData.progress.verification}/2</span>
                          </div>
                          <Progress value={(userData.progress.verification / 2) * 100} className='h-2' />
                        </div>
                      </div>
                    }
                  />

                  <SettingsAccordion
                    value='notifications'
                    icon={<Bell className='h-4 w-4 mr-2 text-secondary' />}
                    title='Notificări Vânzări & Postări'
                    isNotifications={true}
                    content={
                      <div className='flex items-start gap-2'>
                        <Bell className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                        <p className='text-sm text-muted-foreground'>
                          Gestionează notificări pentru oferte noi, comentarii pe postări și vânzări.
                        </p>
                      </div>
                    }
                  />

                  <SettingsAccordion
                    value='marketplace'
                    icon={<TrendingUp className='h-4 w-4 mr-2 text-primary' />}
                    title='Setări Marketplace'
                    progressValue={(userData.progress.verification / 2) * 100}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <TrendingUp className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>
                            Configurează preferințe pentru listări (e.g., auto-aprobat vânzări, taxe).
                          </p>
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Postări</span>
                            <span>{userData.progress.posts}/20</span>
                          </div>
                          <Progress value={(userData.progress.posts / 20) * 100} className='h-2' />
                        </div>
                      </div>
                    }
                  />

                  <SettingsAccordion
                    value='privacy'
                    icon={<Settings className='h-4 w-4 mr-2 text-secondary' />}
                    title='Confidențialitate & Vânzări'
                    progressValue={(userData.progress.verification / 2) * 100}
                    content={
                      <div className='space-y-4'>
                        <div className='flex items-start gap-2'>
                          <Settings className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                          <p className='text-sm text-muted-foreground'>
                            Controlează vizibilitatea profilului, setările pentru vânzări anonime și securitatea contului.
                          </p>
                        </div>
                        <div>
                          <div className='flex justify-between text-xs mb-1'>
                            <span>Prieteni</span>
                            <span>{userData.progress.friends}/10</span>
                          </div>
                          <Progress value={(userData.progress.friends / 10) * 100} className='h-2' />
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
              activities={['Ai primit o ofertă nouă', 'Comentariu pe postarea ta', 'Urmărit de un nou utilizator']}
              onLoadMore={() => console.log('Încarcă mai multe notificări')}
            />

            <RecentActivity activities={activities} />

            <QuickActions />

            <ProgressSummary
              posts={userData.progress.posts}
              friends={userData.progress.friends}
              points={userData.progress.points}
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
      />

      <PrivacyDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
        onActivityUpdate={(activity) => setActivities((prev) => [activity, ...prev.slice(0, 9)])}
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
