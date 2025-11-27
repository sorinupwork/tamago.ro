import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Edit, LogOut, Calendar, Clock, BadgeCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import  SafeHtml  from '@/components/custom/text/SafeHtml';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { signOut } from '@/lib/auth/auth-client';
import { User } from '@/lib/types';
import { getFollowers, getFollowing } from '@/actions/auth/actions';
import AppUserListSheet from '@/components/custom/profile/AppUserListSheet';

type UserData = {
  bio: string;
  postsCount: number;
  followers: number;
  following: number;
  joinDate?: string;
  lastActive?: string;
};

type HeaderProfileProps = {
  user: User;
  userData: UserData;
  imagePreview: string | null;
  shareProfile: () => void;
  setIsEditing: (editing: boolean) => void;
  avatarHref?: string;
  platforms?: string[];
  onVerifyClick?: () => void;
};

export default function HeaderProfile({
  user,
  userData,
  imagePreview,
  shareProfile,
  setIsEditing,
  avatarHref,
  platforms = [],
  onVerifyClick,
}: HeaderProfileProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [followersSheetOpen, setFollowersSheetOpen] = useState(false);
  const [followingSheetOpen, setFollowingSheetOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await signOut();
    toast.success('Deconectat cu succes!');
    router.push('/');
  };

  const handleOpenFollowers = async () => {
    setFollowersSheetOpen(true);
    setLoadingFollowers(true);
    try {
      const data = await getFollowers(user.id);
      setFollowers(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Eroare la încărcarea urmăritorilor');
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleOpenFollowing = async () => {
    setFollowingSheetOpen(true);
    setLoadingFollowing(true);
    try {
      const data = await getFollowing(user.id);
      setFollowing(data);
    } catch (error) {
      console.error('Error fetching following:', error);
      toast.error('Eroare la încărcarea celor urmăriți');
    } finally {
      setLoadingFollowing(false);
    }
  };

  return (
    <>
      <Card className='w-full relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6'>
        {avatarHref ? (
          <Link href={avatarHref} className='block rounded-sm overflow-hidden'>
            <Avatar className='h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-2xl rounded-sm shrink-0'>
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt={user?.name ?? 'Avatar'} className='h-full w-full object-cover rounded-sm' />
              ) : (
                <AvatarFallback className='text-2xl font-bold'>{(user?.name || 'U').charAt(0)}</AvatarFallback>
              )}
            </Avatar>
          </Link>
        ) : (
          <Avatar className='h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-2xl rounded-sm shrink-0'>
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt={user?.name ?? 'Avatar'} className='h-full w-full object-cover rounded-sm' />
            ) : (
              <AvatarFallback className='text-2xl font-bold'>{(user?.name || 'U').charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        )}

        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-3xl font-bold'>{user?.name}</CardTitle>
            {Boolean(user?.emailVerified) ? (
              <Badge variant='secondary'>
                <BadgeCheckIcon className='w-4 h-4 mr-1' />
                Verificat
              </Badge>
            ) : (
              <Button variant='outline' size='sm' className='text-yellow-600 border-yellow-600 hover:bg-yellow-50' onClick={onVerifyClick}>
                Neverificat - Verifică email-ul
              </Button>
            )}
          </div>
          <CardDescription>
            <p className='text-muted-foreground'>{user?.email}</p>
            <SafeHtml html={userData.bio} />
            {platforms.length > 0 && (
              <div className='flex flex-wrap gap-1 mt-2'>
                {platforms.map((platform) => (
                  <Badge key={platform} variant='outline' className='text-xs'>
                    {platform}
                  </Badge>
                ))}
              </div>
            )}
            <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-3 w-3' />
                Joined {userData.joinDate || 'Jan 2023'}
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                Last active {userData.lastActive || '2 hours ago'}
              </div>
            </div>
          </CardDescription>
          <CardAction className='flex flex-row justify-start items-center space-x-2'>
            <Button variant='link' className='p-0 h-auto text-sm hover:no-underline' onClick={handleOpenFollowers}>
              <div className='text-center'>
                <div className='font-bold text-xl'>{userData.followers}</div>
                <div className='text-muted-foreground hover:underline'>Urmăritori</div>
              </div>
            </Button>
            <Button variant='link' className='p-0 h-auto text-sm hover:no-underline' onClick={handleOpenFollowing}>
              <div className='text-center'>
                <div className='font-bold text-xl'>{userData.following}</div>
                <div className='text-muted-foreground hover:underline'>Urmărește</div>
              </div>
            </Button>
          </CardAction>
        </div>

        <div className='flex flex-col gap-2'>
          <Button onClick={shareProfile} variant='outline' className='hover:scale-105 transition-transform'>
            <Share2 className='h-4 w-4 mr-2' /> Distribuie
          </Button>
          <Button onClick={() => setIsEditing(true)} variant='outline' className='hover:scale-105 transition-transform'>
            <Edit className='h-4 w-4 mr-2' /> Editează Profilul
          </Button>
          <Button onClick={handleLogout} disabled={loggingOut} variant='destructive' className='hover:scale-105 transition-transform'>
            <LogOut className='h-4 w-4 mr-2' /> {loggingOut ? 'Se deconectează...' : 'Deconectare'}
          </Button>
        </div>
      </Card>

      {/* Followers Sheet */}
      <AppUserListSheet
        open={followersSheetOpen}
        onOpenChange={setFollowersSheetOpen}
        title={`Urmăritori (${userData.followers})`}
        users={followers}
        loading={loadingFollowers}
        onUserClick={(user) => router.push(`/profile/${user.id}`)}
      />

      {/* Following Sheet */}
      <AppUserListSheet
        open={followingSheetOpen}
        onOpenChange={setFollowingSheetOpen}
        title={`Urmărește (${userData.following})`}
        users={following}
        loading={loadingFollowing}
        onUserClick={(user) => router.push(`/profile/${user.id}`)}
      />
    </>
  );
}
