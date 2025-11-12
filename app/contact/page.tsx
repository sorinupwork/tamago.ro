'use client';

import { useState } from 'react';
import { User, HelpCircle, MessageCircle } from 'lucide-react';

import { AppChatFilter } from '@/components/custom/chat/AppChatFilter';
import { AppChatBox } from '@/components/custom/chat/AppChatBox';
import MarketplaceContactSection from '@/components/custom/marketplace/MarketplaceContactSection';
import { Message, User as UserType, FeedPost } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoriesSection } from '@/components/custom/contact/StoriesSection';
import { FeedSection } from '@/components/custom/contact/FeedSection';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/custom/empty/Empty';

const mockStories = mockUsers
  .concat(mockUsers, mockUsers, mockUsers)
  .slice(0, 40)
  .map((user) => ({ ...user, story: 'New update!' }));
const mockPosts: FeedPost[] = mockUsers.slice(0, 20).map((user, index) => ({
  id: index + 1,
  user,
  text: index % 2 === 0 ? 'Excited for the marketplace!' : 'Check out this deal!',
  image:
    index % 2 === 0
      ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
  likes: index % 2 === 0 ? 12 : 8,
}));

const extendedMockUsers = mockUsers.concat(
  mockUsers.map((u, index) => ({
    ...u,
    id: u.id + mockUsers.length + index,
    name: u.name + ' Copy',
    avatar: u.avatar,
    status: u.status,
    category: u.category,
  }))
);

export default function ContactPage() {
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
  const [activeTab, setActiveTab] = useState('feed');

  const filteredUsers = extendedMockUsers
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) && (category === 'Toți' || user.category === category))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'status') return a.status.localeCompare(b.status);
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

  return (
    <>
      <div className='flex flex-col min-h-screen gap-4 px-4'>
        <div>
          <MarketplaceContactSection
            title='Conectează-te pentru Tranzacții'
            description='Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te ajute!'
            cards={contactCards}
            users={mockUsers}
            showMap={true}
            stories={mockStories}
          />
        </div>

        {/* Desktop Layout */}
        <div className='hidden lg:flex flex-row flex-1 gap-4 w-full min-h-0 min-w-0'>
          <div className='flex flex-row flex-1 gap-4 min-h-0 min-w-0'>
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
                  <EmptyDescription>Alege un utilizator din listă pentru a începe conversația.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>

          <div className='flex flex-col flex-1 gap-4 min-h-0 min-w-0'>
            <StoriesSection mockStories={mockStories} />
            <FeedSection mockPosts={mockPosts} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='lg:hidden flex flex-col flex-1'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='stories'>Stories</TabsTrigger>
              <TabsTrigger value='feed'>Feed</TabsTrigger>
              <TabsTrigger value='chat'>Chat</TabsTrigger>
            </TabsList>
            <TabsContent value='stories' className='flex flex-col flex-1 min-h-0 p-4'>
              <StoriesSection mockStories={mockStories} />
            </TabsContent>
            <TabsContent value='feed' className='flex flex-col flex-1 min-h-0 p-4'>
              <FeedSection mockPosts={mockPosts} />
            </TabsContent>
            <TabsContent value='chat' className='flex flex-col flex-1 min-h-0 gap-4 p-4'>
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
                    <EmptyDescription>Alege un utilizator din listă pentru a începe conversația.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
