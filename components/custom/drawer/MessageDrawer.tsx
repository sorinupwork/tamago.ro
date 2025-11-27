'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';

type MessageDrawerProps = {
  carTitle?: string;
  trigger?: React.ReactNode;
  onSend?: (msg: string) => Promise<void> | void;
  disabled?: boolean;
  initialMessage?: string;
};

export default function MessageDrawer({
  carTitle,
  trigger,
  onSend,
  disabled = false,
  initialMessage = '',
}: MessageDrawerProps) {
  const [message, setMessage] = useState(initialMessage);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (disabled || sending) return;
    if (!message.trim()) {
      toast.error('Mesajul nu poate fi gol.');
      return;
    }

    try {
      setSending(true);
      if (onSend) {
        await onSend(message);
      } else {
        toast.success('Mesaj trimis!');
      }
      setMessage('');
    } catch (err) {
      toast.error('Eroare la trimitere mesaj.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger ?? (
          <Button variant='secondary'>
            <MessageCircle className='mr-2 h-4 w-4' />
            Mesaj
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Trimite mesaj Vânzătorului</DrawerTitle>
          <DrawerDescription>
            Trimite un mesaj direct vânzătorului pentru întrebări{carTitle ? ` despre ${carTitle}` : ''}.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4'>
          <Textarea
            placeholder='Scrie mesajul tău aici...'
            className='min-h-32'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled || sending}
          />
        </div>

        <DrawerFooter>
          <Button onClick={handleSend} disabled={disabled || sending}>
            Trimite Mesaj
          </Button>
          <DrawerClose asChild>
            <Button variant='outline' disabled={disabled || sending}>
              Închide
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
