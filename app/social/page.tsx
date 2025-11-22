import MarketplaceContactSection from '@/components/custom/section/MarketplaceContactSection';
import { getAllUsers } from '@/actions/social/chat/actions';
import { StoriesSection } from '@/components/custom/section/StoriesSection';
import { FeedSection } from '@/components/custom/section/FeedSection';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QuickActions from '@/components/custom/profile/QuickActions';
import ChatTabClient from './ChatTabClient';

export default async function SocialPage() {
  const usersResp = await getAllUsers();
  const allUsers = usersResp.users || [];
  const currentUserId = usersResp.currentUserId ?? null;
  const chatUsers = allUsers.filter((u) => u.id !== currentUserId);

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
              <FeedSection sessionUserId={currentUserId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='chat'>
          <ChatTabClient users={chatUsers} />
        </TabsContent>

        <TabsContent value='market' className='flex-1 overflow-hidden min-h-0'>
          <MarketplaceContactSection
            title='Conectează-te pentru Tranzacții'
            description='Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te ajute!'
            className='p-4'
            users={allUsers}
            showMap={true}
            stories={allUsers}
            horizontalLayout={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
