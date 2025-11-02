import React from 'react';

import { Message } from '@/lib/types';

type ChatMessageProps = {
  message: Message;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`p-2 rounded-lg max-w-xs ${message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        {message.text}
      </div>
    </div>
  );
};
