import MarketplaceContactSection from '@/components/custom/section/MarketplaceContactSection';
import { getAllUsers } from '@/actions/social/chat/actions';
import StoriesSection from '@/components/custom/section/StoriesSection';
import { FeedSection } from '@/components/custom/section/FeedSection';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QuickActions from '@/components/custom/profile/QuickActions';
import ChatTabSection from '../../components/custom/section/ChatTabSection';
import { HelpCircle, MessageCircle, User } from 'lucide-react';

export default async function SocialPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const usersResp = await getAllUsers();
  const allUsers = usersResp.users || [];
  const currentUserId = usersResp.currentUserId ?? null;
  const chatUsers = allUsers.filter((u) => u.id !== currentUserId);

  const defaultCards = [
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
              <StoriesSection mode='stories' />
              <FeedSection sessionUserId={currentUserId} searchParams={searchParams} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='chat'>
          <ChatTabSection users={chatUsers} />
        </TabsContent>

        <TabsContent value='market' className='flex-1 overflow-hidden min-h-0'>
          <MarketplaceContactSection
            title='Conectează-te pentru Tranzacții'
            description='Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te ajute!'
            cards={defaultCards}
            users={allUsers}
            className='p-4'
            showMap={true}
            horizontalLayout={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
