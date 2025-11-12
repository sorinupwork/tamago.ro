import React, { useRef } from 'react';
import { Send, Smile, X, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppInput } from '@/components/custom/input/AppInput';
import { Message, User } from '@/lib/types';
import ChatMessage from './ChatMessage';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type AppChatBoxProps = {
  selectedUserName: string;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
  setSelectedUser: (user: User | null) => void;
};

export const AppChatBox: React.FC<AppChatBoxProps> = ({
  selectedUserName,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  setSelectedUser,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className='flex flex-1 space-y-4 min-w-0'>
      <Card className='flex-1 flex flex-col min-h-[200px] transition-all duration-300 hover:shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-2'>
            Chat cu {selectedUserName}
            <Button onClick={() => setSelectedUser(null)} variant='ghost' size='sm'>
              <X className='w-4 h-4' />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 flex flex-col'>
          <ScrollArea ref={scrollAreaRef} className='h-96'>
            <div className='space-y-4'>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={{ text: msg.text, isUser: msg.sender === 'me' }} />
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
          <div className='flex gap-2'>
            <AppInput
              placeholder='Scrie un mesaj...'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className='flex-1 min-h-10'
            />
            <Button variant='ghost' size='sm' className='transition-all duration-200 hover:scale-105 active:scale-95'>
              <Smile className='w-4 h-4' />
            </Button>
            <Button
              onClick={scrollToBottom}
              variant='ghost'
              size='sm'
              className='transition-all duration-200 hover:scale-105 active:scale-95'
            >
              <ChevronDown className='w-4 h-4' />
            </Button>
            <Button onClick={sendMessage} className='transition-all duration-200 hover:scale-105 active:scale-95'>
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
