'use client';

import { useState } from 'react';
import { User, HelpCircle, MessageCircle } from 'lucide-react';

import { AppChatFilter } from '@/components/custom/chat/AppChatFilter';
import { AppChatBox } from '@/components/custom/chat/AppChatBox';
import MarketplaceContactSection from '@/components/custom/marketplace/MarketplaceContactSection';
import { Message } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

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
      <div className='flex flex-col w-full gap-4'>
        <div className='flex flex-col lg:flex-row flex-1 gap-4'>
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

        <MarketplaceContactSection
          title='Conectează-te pentru Tranzacții'
          description='Contactează utilizatori pentru a negocia și tranzacționa pe platforma noastră marketplace. Comunitatea noastră este aici să te ajute!'
          cards={contactCards}
          users={filteredUsers}
          showMap={true}
        />
      </div>
    </>
  );
}
