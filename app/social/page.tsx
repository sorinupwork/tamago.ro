import { AppChatFilter } from '@/components/custom/chat/AppChatFilter';
import { AppChatBox } from '@/components/custom/chat/AppChatBox';
import MarketplaceContactSection from '@/components/custom/section/MarketplaceContactSection';
import { Message, User as UserType, StoryWithUser, FeedItem } from '@/lib/types';
import { getStories } from '@/actions/social/stories/actions';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { StoriesSection } from '@/components/custom/section/StoriesSection';
import { FeedSection } from '@/components/custom/section/FeedSection';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/custom/empty/Empty';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QuickActions from '@/components/custom/profile/QuickActions';
import { mockUsers } from '@/lib/mockData';
import { HelpCircle, MessageCircle, User } from 'lucide-react';
import ChatTabClient from './ChatTabClient'; 

export default async function SocialPage() {
  // Fetch data on server
  const [storiesData, feedsData] = await Promise.all([getStories({ limit: 50 }), getFeedPosts({ limit: 20 })]);
  const stories = storiesData.items;
  const feedItems = feedsData.items;

  const contactCards = [
    {
      icon: <HelpCircle className='text-blue-500' />,
      title: 'Întrebări Frecvente',
      description: 'Găsește răspunsuri la întrebările comune despre tranzacții și contacte.',
    },
    {
      icon: <MessageCircle className='text-green-500' />,
      title: 'Contactează-ne',
      description: 'Ai nevoie de ajutor? Trimite-ne un mesaj pentru suport rapid.',
    },
    {
      icon: <User className='text-purple-500' />,
      title: 'Social',
      description: 'Urmărește-ne pe @tamago_online pentru noutăți și comunitate.',
    },
  ];

  const uniqueUsers = Array.from(
    new Map(
      stories
        .map((story) => story.user)
        .filter((user) => user !== null)
        .map((user) => [user.id, user])
    ).values()
  );

  return (
    <div className='container mx-auto flex flex-col flex-1'>
      <Tabs defaultValue='stories-feed' className='flex-1'>
        <TabsList className='grid w-full grid-cols-3 sm:flex sm:flex-row'>
          <TabsTrigger value='stories-feed'>Stories & Feed</TabsTrigger>
          <TabsTrigger value='chat'>Chat</TabsTrigger>
          <TabsTrigger value='market'>Market</TabsTrigger>
        </TabsList>

        <TabsContent value='stories-feed'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <aside className='col-span-1 md:sticky md:top-20 h-fit overflow-y-auto'>
              <QuickActions />
            </aside>
            <div className='col-span-1 md:col-span-3 flex flex-col gap-4 h-screen'>
              <StoriesSection stories={stories} mode='stories' />
              <FeedSection feedItems={feedItems} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='chat'>
          <ChatTabClient users={uniqueUsers} /> {/* Client component for interactive chat */}
        </TabsContent>

        <TabsContent value='market' className='flex-1 overflow-hidden min-h-0'>
          <MarketplaceContactSection
            title='Conectează-te pentru Tranzacții'
            description='Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te ajute!'
            className='p-4'
            cards={contactCards}
            users={uniqueUsers}
            showMap={true}
            stories={uniqueUsers}
            horizontalLayout={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
