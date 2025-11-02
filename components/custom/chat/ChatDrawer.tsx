'use client';

import { useState } from 'react';
import { MessageCircle, Circle, User, Paperclip, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  text: string;
  isUser: boolean;
};

export default function ChatDrawer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isDescOpen, setIsDescOpen] = useState(true);

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
        <div className='p-4 border-b bg-muted/50'>
          <Button variant='ghost' onClick={() => setIsDescOpen(!isDescOpen)} className='w-full justify-between p-0 h-auto'>
            <span className='text-sm font-medium'>Despre acest chat</span>
            {isDescOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
          </Button>
          {isDescOpen && (
            <div className='mt-2 space-y-2 text-sm text-muted-foreground'>
              <div>
                <strong>Probleme cu platforma:</strong> Raportați erori, întârzieri sau funcționalități defecte.
              </div>
              <div>
                <strong>Raportări:</strong> Trimiteți feedback, sugestii sau reclamații despre serviciile noastre.
              </div>
              <div>
                <strong>Alte întrebări:</strong> Ajutor pentru cont, plăți sau orice alt aspect al Tamago.
              </div>
            </div>
          )}
        </div>
        <div className='flex-1 p-4 overflow-y-auto space-y-3'>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-xs ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                <User className='h-8 w-8 shrink-0' />
                <div className={`px-3 py-2 rounded-lg ${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className='p-4 border-t'>
          {error && (
            <div className='flex items-center gap-2 text-red-500 text-sm mb-2'>
              <AlertCircle className='h-4 w-4' />
              {error}
            </div>
          )}
          <div className='flex justify-center'>
            <div className='flex gap-2 w-full max-w-md'>
              <Button variant='outline' size='sm' className='h-10' aria-label='Adaugă atașament'>
                <Paperclip className='h-4 w-4' />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Scrie un mesaj...'
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className='flex-1 h-10'
              />
              <Button onClick={sendMessage} size='sm' className='h-10'>
                Trimite
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
