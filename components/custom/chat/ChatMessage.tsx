import { User } from 'lucide-react';

type Message = {
  text: string;
  isUser: boolean;
};

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 max-w-xs ${message.isUser ? 'flex-row-reverse' : ''}`}>
        <User className='h-8 w-8 shrink-0' />
        <div className={`px-3 py-2 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{message.text}</div>
      </div>
    </div>
  );
}
