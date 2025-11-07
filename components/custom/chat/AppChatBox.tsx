import React from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppInput } from '@/components/custom/input/AppInput';
import { Message } from '@/lib/types';
import ChatMessage from './ChatMessage';

type AppChatBoxProps = {
  selectedUserName: string;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
};

export const AppChatBox: React.FC<AppChatBoxProps> = ({ selectedUserName, messages, newMessage, setNewMessage, sendMessage }) => {
  return (
    <div className='flex-1 lg:flex-[0.618] space-y-4'>
      <Card className='h-full flex flex-col transition-all duration-300 hover:shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>Chat cu {selectedUserName}</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 flex flex-col'>
          <ScrollArea className='flex-1 mb-4'>
            <div className='space-y-2'>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={{ text: msg.text, isUser: msg.sender === 'me' }} />
              ))}
            </div>
          </ScrollArea>
          <div className='flex gap-2'>
            <AppInput
              placeholder='Scrie un mesaj...'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className='flex-1'
            />
            <Button onClick={sendMessage} className='transition-all duration-200 hover:scale-105'>
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
