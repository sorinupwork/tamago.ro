'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, HelpCircle, MessageCircle, Camera, Heart, Share } from 'lucide-react';

import { AppChatFilter } from '@/components/custom/chat/AppChatFilter';
import { AppChatBox } from '@/components/custom/chat/AppChatBox';
import MarketplaceContactSection from '@/components/custom/marketplace/MarketplaceContactSection';
import { Message } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const mockStories = mockUsers.slice(0, 5).map((user) => ({ ...user, story: 'New update!' }));
const mockPosts = [
  { id: 1, user: mockUsers[0], text: 'Excited for the marketplace!', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80', likes: 12 },
  { id: 2, user: mockUsers[1], text: 'Check out this deal!', image: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80', likes: 8 },
];

export default function ContactPage() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [category, setCategory] = useState('Toți');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 2, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('feed');

  const filteredUsers = mockUsers
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
      <div className='flex flex-col w-full gap-4 p-2'>
        <MarketplaceContactSection
          title='Conectează-te pentru Tranzacții'
          description='Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te ajute!'
          cards={contactCards}
          users={mockUsers}
          showMap={true}
          stories={mockStories}
        />

        {/* Desktop Layout: Grid with Feed in Center */}
        <div className='hidden lg:flex flex-row flex-1 gap-4 max-w-7xl mx-auto w-full'>
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
          <AppChatBox
            selectedUserName={selectedUser.name}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
          {/* Central Feed */}
          <div className='flex-1 space-y-4'>
            {/* Stories Section */}
            <Card className='transition-all duration-300 hover:shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Camera className='w-5 h-5' /> Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className='flex gap-4 p-2'>
                    {mockStories.map((story) => (
                      <HoverCard key={story.id}>
                        <HoverCardTrigger asChild>
                          <div className='flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform min-w-0'>
                            <Avatar className='w-12 h-12 ring-2 ring-primary'>
                              <AvatarImage src={story.avatar} />
                              <AvatarFallback>{story.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className='text-xs'>{story.name}</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className='w-80'>
                          <div className='flex justify-between gap-4'>
                            <Avatar>
                              <AvatarImage src={story.avatar} />
                              <AvatarFallback>{story.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className='space-y-1'>
                              <h4 className='text-sm font-semibold'>{story.name}</h4>
                              <p className='text-sm'>{story.status}</p>
                              <div className='text-muted-foreground text-xs'>Categoria: {story.category}</div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" />
                </ScrollArea>
              </CardContent>
            </Card>
            {/* Feed Posts */}
            <ScrollArea className='h-96 w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
              <div className='space-y-2 pr-4'>
                {mockPosts.map((post) => (
                  <Card key={post.id} className='transition-all duration-300 hover:shadow-lg'>
                    <CardHeader className='flex flex-row items-center gap-2'>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Avatar className='cursor-pointer'>
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                          </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className='w-80'>
                          <div className='flex justify-between gap-4'>
                            <Avatar>
                              <AvatarImage src={post.user.avatar} />
                              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className='space-y-1'>
                              <h4 className='text-sm font-semibold'>{post.user.name}</h4>
                              <p className='text-sm'>{post.user.status}</p>
                              <div className='text-muted-foreground text-xs'>Categoria: {post.user.category}</div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <span className='font-semibold'>{post.user.name}</span>
                    </CardHeader>
                    <CardContent>
                      <p>{post.text}</p>
                      {post.image && (
                        <div className='relative w-full h-48 mt-2 rounded'>
                          <Image src={post.image} alt='Post' fill className='object-cover rounded' />
                        </div>
                      )}
                      <ButtonGroup className='mt-2'>
                        <Button variant='ghost' size='sm'>
                          <Heart className='w-4 h-4' /> {post.likes}
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <Share className='w-4 h-4' />
                        </Button>
                      </ButtonGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" />
            </ScrollArea>
          </div>
        </div>

        {/* Mobile Layout: Tabs */}
        <div className='lg:hidden'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='stories'>Stories</TabsTrigger>
              <TabsTrigger value='feed'>Feed</TabsTrigger>
              <TabsTrigger value='chat'>Chat</TabsTrigger>
            </TabsList>
            <TabsContent value='stories' className='mt-4'>
              <Card>
                <CardContent className='pt-4'>
                  <ScrollArea className="w-full">
                    <div className='flex gap-4 p-2'>
                      {mockStories.map((story) => (
                        <HoverCard key={story.id}>
                          <HoverCardTrigger asChild>
                            <div className='flex flex-col items-center gap-2 cursor-pointer min-w-0'>
                              <Avatar className='w-12 h-12 ring-2 ring-primary'>
                                <AvatarImage src={story.avatar} />
                                <AvatarFallback>{story.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className='text-xs'>{story.name}</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className='w-80'>
                            <div className='flex justify-between gap-4'>
                              <Avatar>
                                <AvatarImage src={story.avatar} />
                                <AvatarFallback>{story.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className='space-y-1'>
                                <h4 className='text-sm font-semibold'>{story.name}</h4>
                                <p className='text-sm'>{story.status}</p>
                                <div className='text-muted-foreground text-xs'>Categoria: {story.category}</div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='feed' className='mt-4'>
              <ScrollArea className='h-96 w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
                <div className='space-y-6 p-2'>
                  {mockPosts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader className='flex flex-row items-center gap-2'>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Avatar className='cursor-pointer'>
                              <AvatarImage src={post.user.avatar} />
                              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                            </Avatar>
                          </HoverCardTrigger>
                          <HoverCardContent className='w-80'>
                            <div className='flex justify-between gap-4'>
                              <Avatar>
                                <AvatarImage src={post.user.avatar} />
                                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className='space-y-1'>
                                <h4 className='text-sm font-semibold'>{post.user.name}</h4>
                                <p className='text-sm'>{post.user.status}</p>
                                <div className='text-muted-foreground text-xs'>Categoria: {post.user.category}</div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                        <span className='font-semibold'>{post.user.name}</span>
                      </CardHeader>
                      <CardContent>
                        <p>{post.text}</p>
                        {post.image && (
                          <div className='relative w-full h-48 mt-2 rounded'>
                            <Image src={post.image} alt='Post' fill className='object-cover rounded' />
                          </div>
                        )}
                        <ButtonGroup className='mt-2'>
                          <Button variant='ghost' size='sm'>
                            <Heart className='w-4 h-4' /> {post.likes}
                          </Button>
                          <Button variant='ghost' size='sm'>
                            <Share className='w-4 h-4' />
                          </Button>
                        </ButtonGroup>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value='chat' className='mt-4'>
              <div className='flex flex-col gap-4'>
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
                <AppChatBox
                  selectedUserName={selectedUser.name}
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  sendMessage={sendMessage}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
