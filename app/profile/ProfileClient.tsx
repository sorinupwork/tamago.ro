'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, CheckCircle, Settings, Bell, Heart, TrendingUp, Award, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BadgesCarousel from '@/components/custom/carousel/BadgesCarousel';
import EditDrawer from '@/components/custom/profile/EditDrawer';
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
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { signOut } from '@/lib/auth/auth-client';

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
    badges: [
      'Prima Conectare',
      'Email Verificat',
      'Top Poster',
      'Ajutor Comunitate',
      'Maestru Serie',
      'Vânzător de Mașini',
      'Creator de Sondaje',
      'Expert Laptopuri',
      'Pasionat Auto',
      'Influencer Comunitate',
      'Vânzător Premium',
    ], // Added more badges for marketplace/social themes to fill carousel spaces
    progress: { posts: 15, friends: 8, points: 120 },
    rewards: { freePosts: 5, premiumAccess: false },
    verified: { email: true, social: false },
    bio: 'Pasionat de mașini și construcția comunității. Întotdeauna explorând noi aventuri!',
    followers: 245,
    following: 180,
    postsCount: 42,
    joinDate: 'Ian 2023',
    lastActive: 'Acum 2 ore',
  };

  const [name, setName] = useState<string>(user?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null);
  const [isEditing, setIsEditing] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');

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
        if (mounted) setPostsError('Nu s-au putut încărca postările.');
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

  const handleLogout = async () => {
    await signOut();
    toast.success('Deconectat cu succes!');
    router.push('/cont');
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Ștergeți această postare?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ștergere eșuată');
      setPosts((p) => p?.filter((x) => x.id !== postId) ?? null);
      toast.success('Postare ștearsă');
    } catch (err) {
      console.error(err);
      toast.error('Eșec la ștergerea postării');
    }
  };

  const handleToggleActive = async (postId: string, current?: Post['status']) => {
    const newStatus = current === 'active' ? 'draft' : 'active';
    setPosts((p) => p?.map((x) => (x.id === postId ? { ...x, status: newStatus } : x)) ?? null);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Actualizare eșuată');
      toast.success(`Postare ${newStatus === 'active' ? 'activată' : 'dezactivată'}`);
    } catch (err) {
      console.error(err);
      toast.error('Eșec la actualizarea statusului postării');
      setPosts((p) => p?.map((x) => (x.id === postId ? { ...x, status: current } : x)) ?? null);
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/posts/${postId}/edit`);
  };

  return (
    <div className='min-h-screen flex flex-col lg-flex-row'>
      <div className='flex flex-row items-start gap-4'>
        <aside className='hidden lg:block lg:sticky lg:top-14 space-y-4 sm:space-y-6 p-4 sm:p-6'>
          <ActivityFeed
            activities={['Postat un articol acum 2 ore', 'Câștigat insigna "Top Poster" ieri', 'Urmărit 3 utilizatori noi']}
            onLoadMore={() => toast.success('Încarcă mai multe activități')}
          />

          <ProgressSummary
            posts={userData.progress.posts}
            friends={userData.progress.friends}
            points={userData.progress.points}
            onClaimReward={() => toast.success('Revendică recompensa')}
          />

          <QuickActions />

          <ProTip
            tip='Distribuie postările pentru a câștiga puncte și insigne extra!'
            variant='success'
            action={{ label: 'Află Mai Multe', onClick: () => toast.info('Mai multe sfaturi în curând!') }}
          />
        </aside>

        <div className='container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 lg:ml-6'>
          <div className='flex flex-col gap-4'>
            <HeaderProfile
              user={user}
              userData={userData}
              imagePreview={imagePreview}
              shareProfile={shareProfile}
              setIsEditing={setIsEditing}
              handleLogout={handleLogout}
            />

            <Tabs defaultValue='overview' className='w-full'>
              <div className='overflow-x-auto p-2'>
                <TabsList className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md gap-2 p-2'>
                  <TabsTrigger value='overview' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                    Prezentare Generală
                  </TabsTrigger>
                  <TabsTrigger value='posts' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                    Postările Mele
                  </TabsTrigger>
                  <TabsTrigger value='progress' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                    Progres & Insigne
                  </TabsTrigger>
                  <TabsTrigger value='settings' className='h-14 px-2 py-2 whitespace-nowrap shrink-0 text-xs sm:text-sm'>
                    Setări
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='overview' className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <RecentActivity activities={[]} />
                  <RewardsCard
                    freePosts={userData.rewards.freePosts}
                    premiumAccess={userData.rewards.premiumAccess}
                    onSellClick={() => router.push('/sell')}
                  />
                </div>
                <ProgressSummary
                  posts={userData.progress.posts}
                  friends={userData.progress.friends}
                  points={userData.progress.points}
                  onClaimReward={() => toast.success('Revendică recompensa')}
                />
              </TabsContent>

              <TabsContent value='posts' className='space-y-6'>
                <PostsFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                {loadingPosts || postsError ? (
                  <SkeletonLoading variant='profile' />
                ) : (
                  <PostsGrid posts={posts ?? []} onEdit={handleEditPost} onDelete={handleDeletePost} onToggle={handleToggleActive} />
                )}
              </TabsContent>

              <TabsContent value='progress' className='space-y-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <ProgressBars posts={userData.progress.posts} friends={userData.progress.friends} points={userData.progress.points} />
                  <BadgesCarousel badges={userData.badges} title='Insignele Tale' />
                </div>
              </TabsContent>

              <TabsContent value='settings' className='space-y-6'>
                <Accordion type='multiple' value={settingsOpen} onValueChange={handleSettingsChange} className='w-full'>
                  <SettingsAccordion
                    value='verified'
                    icon={<CheckCircle className='h-4 w-4 mr-2 text-primary' />}
                    title='Informații Verificate'
                    content={
                      <>
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
                      </>
                    }
                  />
                  <SettingsAccordion
                    value='notifications'
                    icon={<Bell className='h-4 w-4 mr-2 text-secondary' />}
                    title='Notificări Vânzări & Postări'
                    content={
                      <div className='flex items-start gap-2'>
                        <Bell className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                        <p className='text-sm text-muted-foreground'>
                          Gestionează notificări pentru oferte noi, comentarii pe postări și vânzări.
                        </p>
                      </div>
                    }
                    buttonText='Editează Notificările'
                    onButtonClick={() => console.log('Editează notificările')}
                  />
                  <SettingsAccordion
                    value='privacy'
                    icon={<Settings className='h-4 w-4 mr-2 text-secondary' />}
                    title='Confidențialitate & Vânzări'
                    content={
                      <div className='flex items-start gap-2'>
                        <Settings className='h-4 w-4 text-secondary mt-0.5 shrink-0' />
                        <p className='text-sm text-muted-foreground'>
                          Controlează vizibilitatea profilului, setările pentru vânzări anonime și securitatea contului.
                        </p>
                      </div>
                    }
                    buttonText='Gestionează Confidențialitatea'
                    onButtonClick={() => console.log('Gestionează confidențialitatea')}
                  />

                  <SettingsAccordion
                    value='marketplace'
                    icon={<TrendingUp className='h-4 w-4 mr-2 text-primary' />}
                    title='Setări Marketplace'
                    content={
                      <div className='flex items-start gap-2'>
                        <TrendingUp className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                        <p className='text-sm text-muted-foreground'>
                          Configurează preferințe pentru listări (e.g., auto-aprobat vânzări, taxe).
                        </p>
                      </div>
                    }
                    buttonText='Editează Setările Vânzărilor'
                    onButtonClick={() => console.log('Editează setările marketplace')}
                  />
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <aside className='lg:hidden space-y-4 sm:space-y-6'>
            <ActivityFeed
              activities={['Postat un articol acum 2 ore', 'Câștigat insigna "Top Poster" ieri', 'Urmărit 3 utilizatori noi']}
              onLoadMore={() => console.log('Încarcă mai multe activități')}
            />

            <ProgressSummary
              posts={userData.progress.posts}
              friends={userData.progress.friends}
              points={userData.progress.points}
              onClaimReward={() => console.log('Revendică recompensa')}
            />

            <QuickActions />

            <ProTip
              tip='Distribuie postările pentru a câștiga puncte și insigne extra!'
              variant='success'
              action={{ label: 'Află Mai Multe', onClick: () => toast.info('Mai multe sfaturi în curând!') }}
            />
          </aside>
        </div>
      </div>

      <EditDrawer
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
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
        imagePreview={user?.image ?? null}
        files={imageFile ? [imageFile] : []}
        userId={user?.id}
        onFilesChange={handleFilesFromUploader}
        onImageRemove={handleImageRemove}
      />
    </div>
  );
}
