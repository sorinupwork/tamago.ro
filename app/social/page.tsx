'use client';

import { useState, useEffect } from 'react';
import { User, HelpCircle, MessageCircle } from 'lucide-react';

import { AppChatFilter } from '@/components/custom/chat/AppChatFilter';
import { AppChatBox } from '@/components/custom/chat/AppChatBox';
import MarketplaceContactSection from '@/components/custom/section/MarketplaceContactSection';
import { Message, User as UserType, StoryWithUser, FeedItem } from '@/lib/types';
import { getStories } from '@/actions/social/stories/actions';
import { getFeedPosts } from '@/actions/social/feeds/actions';
import { getUserById } from '@/actions/auth/actions';
import { StoriesSection } from '@/components/custom/section/StoriesSection';
import { FeedSection } from '@/components/custom/section/FeedSection';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/custom/empty/Empty';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QuickActions from '@/components/custom/profile/QuickActions';
import { mockUsers } from '@/lib/mockData';

export default function SocialPage() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [category, setCategory] = useState('Toți');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 2, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 3, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 4, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 5, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 6, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 7, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 8, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 9, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 10, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 11, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 12, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 13, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 14, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 15, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 16, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 17, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 18, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
    { id: 19, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 20, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [stories, setStories] = useState<StoryWithUser[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesData, feedsData] = await Promise.all([getStories({ limit: 50 }), getFeedPosts({ limit: 20 })]);
        const enrichedStories = await Promise.all(
          storiesData.items.map(async (item) => {
            if (!item.user && item.userId) {
              const user = await getUserById(item.userId);
              const normalizedUser = user
                ? {
                    id: user._id.toString(),
                    name: user.name || 'Unknown',
                    avatar: user.image || '/avatars/default.jpg',
                    status: user.status || 'Online',
                    category: user.category || 'Prieteni',
                    email: user.email || '',
                    provider: user.provider || 'credentials',
                    createdAt: user.createdAt?.toISOString(),
                    updatedAt: user.updatedAt?.toISOString(),
                    location: user.location || [0, 0],
                  }
                : null;
              return { ...item, user: normalizedUser, reactions: item.reactions || { likes: { total: 0, userIds: [] }, comments: [] } };
            }
            return item;
          })
        );
        setStories(enrichedStories);
        const enrichedFeeds = await Promise.all(
          feedsData.items.map(async (item) => {
            if (!item.user && item.userId) {
              const user = await getUserById(item.userId);
              const normalizedUser = user
                ? {
                    id: user._id.toString(),
                    name: user.name || 'Unknown',
                    avatar: user.image || '/avatars/default.jpg',
                    status: user.status || 'Online',
                    category: user.category || 'Prieteni',
                    email: user.email || '',
                    provider: user.provider || 'credentials',
                    createdAt: user.createdAt?.toISOString(),
                    updatedAt: user.updatedAt?.toISOString(),
                    location: user.location || [0, 0],
                  }
                : null;
              return { ...item, user: normalizedUser, reactions: item.reactions || { likes: { total: 0, userIds: [] }, comments: [] } };
            }
            return item;
          })
        );
        setFeedItems(enrichedFeeds);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = mockUsers
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) && (category === 'Toți' || user.category === category))
    .sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      const statusA = a.status || '';
      const statusB = b.status || '';
      if (sort === 'name') return nameA.localeCompare(nameB);
      if (sort === 'status') return statusA.localeCompare(statusB);
      return 0;
    });

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = { id: Date.now(), text: newMessage, sender: 'me' };
      setMessages([...messages, msg]);
      setNewMessage('');
      setTimeout(() => {
        const autoMsg: Message = { id: Date.now() + 1, text: 'Răspuns automat: Mulțumesc!', sender: 'other' };
        setMessages((prev) => [...prev, autoMsg]);
      }, 1000);
    }
  };

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
              <StoriesSection stories={stories} mode='stories' setStories={setStories} />
              <FeedSection feedItems={feedItems} setFeedItems={setFeedItems} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='chat'>
          <div className='flex flex-col sm:flex-row gap-4 h-screen sm:h-screen flex-1 min-h-0 p-4'>
            <AppChatFilter
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              category={category}
              setCategory={setCategory}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              filteredUsers={filteredUsers}
            />
            {selectedUser ? (
              <AppChatBox
                selectedUserName={selectedUser.name}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                setSelectedUser={setSelectedUser}
              />
            ) : (
              <Empty withCard={true}>
                <EmptyHeader>
                  <EmptyMedia variant='icon'>
                    <MessageCircle className='size-8' />
                  </EmptyMedia>
                  <EmptyTitle>Selectează un utilizator</EmptyTitle>
                  <EmptyDescription>Alege un utilizator din listă pentru a început conversația.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
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
