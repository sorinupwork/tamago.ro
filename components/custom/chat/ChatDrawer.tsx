'use client';

import { useState } from 'react';
import { MessageCircle, Circle, User } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ChatRoom from './ChatRoom';
import ChatInput from './ChatInput';
import ChatInfo from './ChatInfo';

type Message = {
  text: string;
  isUser: boolean;
};

export default function ChatDrawer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const sendMessage = () => {
    if (!input.trim()) {
      setError('Mesajul nu poate fi gol.');
      return;
    }
    setError('');
    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setTimeout(() => {
      setMessages([...newMessages, { text: 'Mulțumesc pentru mesaj! Cum vă pot ajuta mai departe?', isUser: false }]);
    }, 1000);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' className='fixed bottom-4 right-4 z-50 rounded-full shadow-lg' aria-label='Deschide chat'>
          <MessageCircle className='h-6 w-6' />
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full sm:w-80 p-0 flex flex-col'>
        <SheetHeader className='p-4 border-b'>
          <SheetTitle className='flex items-center gap-2'>
            <User className='h-6 w-6' />
            Operator Suport
            <Circle className='h-3 w-3 fill-green-500 text-green-500' />
            <span className='text-sm text-muted-foreground'>Online</span>
          </SheetTitle>
        </SheetHeader>
        <ChatInfo />
        <ChatRoom messages={messages} />
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} error={error} setError={setError} />
      </SheetContent>
    </Sheet>
  );
}
