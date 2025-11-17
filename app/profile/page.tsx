'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Trophy, Share2, CheckCircle, Star, Edit, Settings, Bell, Heart, TrendingUp, Award, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  if (!session) {
    router.push('/cont');
    return null;
  }

  const user = session.user;

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

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my Tamago profile!',
        url: window.location.href,
      });
    } else {
      toast.info('Share link copied to clipboard!');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto p-6 space-y-8'>
        {/* Header Section */}
        <Card className='relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10' />
          <CardHeader className='relative flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-8'>
            <Avatar className='h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-2xl'>
              <AvatarImage src={user?.image || ''} />
              <AvatarFallback className='text-2xl font-bold'>{user?.name?.charAt(0)}</AvatarFallback>
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
                <Share2 className='h-4 w-4 mr-2' />
                Share
              </Button>
              <Button variant='outline' className='hover:scale-105 transition-transform'>
                <Edit className='h-4 w-4 mr-2' />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'>
            <TabsTrigger value='overview' className='hover:scale-105 transition-transform'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='badges' className='hover:scale-105 transition-transform'>
              Badges
            </TabsTrigger>
            <TabsTrigger value='progress' className='hover:scale-105 transition-transform'>
              Progress
            </TabsTrigger>
            <TabsTrigger value='settings' className='hover:scale-105 transition-transform'>
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Quick Stats */}
              <Card className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <TrendingUp className='h-5 w-5 mr-2 text-green-500' />
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
              <Card className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Award className='h-5 w-5 mr-2 text-yellow-500' />
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
                    <Zap className='h-4 w-4 mr-2' />
                    Redeem Reward
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Placeholder */}
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Heart className='h-5 w-5 mr-2 text-red-500' />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>No recent activity. Start posting to see updates here!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='badges' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Trophy className='h-5 w-5 mr-2' />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel className='w-full max-w-xs mx-auto'>
                  <CarouselContent>
                    {userData.badges.map((badge, index) => (
                      <CarouselItem key={index} className='basis-1/2 md:basis-1/3'>
                        <div className='p-4 text-center hover:scale-105 transition-transform'>
                          <Star className='h-12 w-12 mx-auto mb-2 text-yellow-500' />
                          <Badge variant='secondary' className='text-sm'>
                            {badge}
                          </Badge>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='progress' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span>Posts: {userData.progress.posts}/20</span>
                    <span>{Math.round((userData.progress.posts / 20) * 100)}%</span>
                  </div>
                  <Progress value={(userData.progress.posts / 20) * 100} className='h-3' />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span>Friends: {userData.progress.friends}/10</span>
                    <span>{Math.round((userData.progress.friends / 10) * 100)}%</span>
                  </div>
                  <Progress value={(userData.progress.friends / 10) * 100} className='h-3' />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span>Points: {userData.progress.points}/200</span>
                    <span>{Math.round((userData.progress.points / 200) * 100)}%</span>
                  </div>
                  <Progress value={(userData.progress.points / 200) * 100} className='h-3' />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='settings' className='space-y-6'>
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='verified'>
                <AccordionTrigger className='hover:no-underline'>
                  <CheckCircle className='h-4 w-4 mr-2' />
                  Verified Information
                </AccordionTrigger>
                <AccordionContent>
                  <ul className='space-y-2'>
                    <li className='flex items-center'>
                      <CheckCircle className='h-4 w-4 mr-2 text-green-500' />
                      Email Verified: {userData.verified.email ? 'Yes' : 'No'}
                    </li>
                    <li className='flex items-center'>
                      <CheckCircle className='h-4 w-4 mr-2 text-green-500' />
                      Social Links Verified: {userData.verified.social ? 'Yes' : 'No'}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='notifications'>
                <AccordionTrigger className='hover:no-underline'>
                  <Bell className='h-4 w-4 mr-2' />
                  Notifications
                </AccordionTrigger>
                <AccordionContent>
                  <p className='text-muted-foreground'>Manage your notification preferences here.</p>
                  <Button variant='outline' className='mt-2'>
                    Edit Notifications
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='privacy'>
                <AccordionTrigger className='hover:no-underline'>
                  <Settings className='h-4 w-4 mr-2' />
                  Privacy & Security
                </AccordionTrigger>
                <AccordionContent>
                  <p className='text-muted-foreground'>Control your privacy settings and account security.</p>
                  <Button variant='outline' className='mt-2'>
                    Manage Privacy
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
