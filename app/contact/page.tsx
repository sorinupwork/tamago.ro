'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Search, User, Mail, HelpCircle, MessageCircle, MapPin } from 'lucide-react';
import MapComponent from '@/components/custom/map/MapComponent';

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  category: string;
  location: [number, number];
}

// Mock user data with locations
const mockUsers = [
  {
    id: 1,
    name: 'User One',
    avatar: '/avatars/01.jpg',
    status: 'Online',
    category: 'Prieteni',
    location: [44.4268, 26.1025] as [number, number],
  }, // Bucharest
  {
    id: 2,
    name: 'User Two',
    avatar: '/avatars/02.jpg',
    status: 'Away',
    category: 'Recenți',
    location: [45.9432, 24.9668] as [number, number],
  }, // Sibiu
  {
    id: 3,
    name: 'User Three',
    avatar: '/avatars/03.jpg',
    status: 'Offline',
    category: 'Prieteni',
    location: [47.1585, 27.6014] as [number, number],
  }, // Iași
  {
    id: 4,
    name: 'User Four',
    avatar: '/avatars/04.jpg',
    status: 'Online',
    category: 'Recenți',
    location: [46.7712, 23.6236] as [number, number],
  }, // Cluj
  {
    id: 5,
    name: 'User Five',
    avatar: '/avatars/05.jpg',
    status: 'Away',
    category: 'Prieteni',
    location: [44.1812, 28.6348] as [number, number],
  }, // Constanța
];

export default function ContactPage() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [category, setCategory] = useState('Toți');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 2, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Filter and sort users
  const filteredUsers = mockUsers
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) && (category === 'Toți' || user.category === category))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg = { id: Date.now(), text: newMessage, sender: 'me' };
      setMessages([...messages, msg]);
      setNewMessage('');
      // Mock response
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: 'Răspuns automat: Mulțumesc!', sender: 'other' }]);
      }, 1000);
    }
  };

  return (
    <>
      <div className='flex flex-col w-full gap-4'>
        {/* Main content */}
        <div className='flex flex-col lg:flex-row flex-1 gap-4'>
          {/* Left side: User list with enhancements */}
          <div className='flex-1 lg:flex-[0.382] space-y-4'>
            <Card className='h-full flex flex-col transition-all duration-300 hover:shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='w-5 h-5' /> Contacte Utilizatori
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-1 flex flex-col'>
                {/* Search bar */}
                <div className='relative mb-4'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <Input
                    placeholder='Caută utilizatori...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='pl-10 transition-all duration-200 focus:scale-101'
                  />
                </div>
                {/* Sort and Filter */}
                <div className='flex gap-2 mb-4'>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className='w-full transition-all duration-200 pinch'>
                      <SelectValue placeholder='Sortează' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='name'>După nume</SelectItem>
                      <SelectItem value='status'>După status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Categories */}
                <Tabs value={category} onValueChange={setCategory} className='mb-4'>
                  <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='Toți' className='transition-all duration-200 hover:scale-105'>
                      Toți
                    </TabsTrigger>
                    <TabsTrigger value='Prieteni' className='transition-all duration-200 hover:scale-105'>
                      Prieteni
                    </TabsTrigger>
                    <TabsTrigger value='Recenți' className='transition-all duration-200 hover:scale-105'>
                      Recenți
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {/* Scrollable user list */}
                <ScrollArea className='flex-1'>
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-2 hover:bg-muted cursor-pointer transition-all duration-200 pinch ${
                        selectedUser.id === user.id ? 'bg-accent animate-pulse' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <Avatar className='transition-all duration-200 hover:scale-110'>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <p className='font-medium'>{user.name}</p>
                        <p className='text-sm text-muted-foreground'>{user.status}</p>
                      </div>
                      <Button variant='outline' size='sm' className='transition-all duration-200 hover:scale-105'>
                        Contactează
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Chat interface */}
          <div className='flex-1 lg:flex-[0.618] space-y-4'>
            <Card className='h-full flex flex-col transition-all duration-300 hover:shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Mail className='w-5 h-5' /> Chat cu {selectedUser.name}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-1 flex flex-col'>
                <ScrollArea className='flex-1 mb-4'>
                  {/* Messages */}
                  <div className='space-y-2'>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div
                          className={`p-2 rounded-lg max-w-xs ${
                            msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Scrie un mesaj...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className='flex-1 transition-all duration-200 focus:scale-101'
                  />
                  <Button onClick={sendMessage} className='transition-all duration-200 hover:scale-105'>
                    <Send className='w-4 h-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional section: User-to-user contact for marketplace */}
        <section className='bg-muted p-4 transition-all duration-300 hover:bg-muted/80 rounded-lg'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold mb-4'>Conectează-te pentru Tranzacții</h3>
            <p className='text-muted-foreground mb-4'>
              Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te
              ajute!
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
              <Card className='transition-all duration-200 pinch group'>
                <CardContent className='p-4 text-center'>
                  <HelpCircle className='w-8 h-8 mx-auto mb-2 text-blue-500 animate-pulse wiggle' />
                  <h4 className='font-semibold'>Întrebări Frecvente</h4>
                  <p className='text-sm text-muted-foreground'>Găsește răspunsuri la întrebările comune despre tranzacții și contacte.</p>
                </CardContent>
              </Card>
              <Card className='transition-all duration-200 pinch group'>
                <CardContent className='p-4 text-center'>
                  <MessageCircle className='w-8 h-8 mx-auto mb-2 text-green-500 animate-pulse wiggle' />
                  <h4 className='font-semibold'>Contactează-ne</h4>
                  <p className='text-sm text-muted-foreground'>Ai nevoie de ajutor? Trimite-ne un mesaj pentru suport rapid.</p>
                </CardContent>
              </Card>
              <Card className='transition-all duration-200 pinch group'>
                <CardContent className='p-4 text-center'>
                  <User className='w-8 h-8 mx-auto mb-2 text-purple-500 animate-pulse wiggle' />
                  <h4 className='font-semibold'>Social</h4>
                  <p className='text-sm text-muted-foreground'>Urmărește-ne pe @tamago_online pentru noutăți și comunitate.</p>
                </CardContent>
              </Card>
            </div>
            {/* Standalone map section */}
            <Card className='transition-all duration-200 hover:shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center justify-center gap-2'>
                  <MapPin className='w-6 h-6 wiggle text-primary' /> Locuri de Întâlnire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-64 w-full rounded-lg overflow-hidden'>
                  <MapComponent users={filteredUsers} />
                </div>
                <p className='text-sm text-muted-foreground mt-4'>
                  Vezi locațiile pentru întâlniri sigure. Clic pe markere pentru detalii.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
