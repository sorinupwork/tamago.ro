'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { AppChatFilter } from '@/components/custom/chat/AppChatFilter';
import { AppChatBox } from '@/components/custom/chat/AppChatBox';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/custom/empty/Empty';
import { User as UserType, Message } from '@/lib/types';

export default function ChatTabClient({ users }: { users: UserType[] }) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [category, setCategory] = useState('Toți');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Salut! Cum pot să te ajut?', sender: 'other' },
    { id: 2, text: 'Mulțumesc pentru ajutor!', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const filteredUsers = users
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

  return (
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
  );
}
