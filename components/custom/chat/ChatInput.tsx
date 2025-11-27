import { Paperclip } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  error: string;
  setError: (value: string) => void;
};

export default function ChatInput({ input, setInput, sendMessage, error, setError }: ChatInputProps) {
  return (
    <div className='p-4 border-t'>
      {error && <p className='text-destructive'>{error}</p>}
      <div className='flex justify-center'>
        <div className='flex gap-2 w-full max-w-md'>
          <Button variant='outline' size='sm' className='h-10' aria-label='Adaugă atașament'>
            <Paperclip className='h-4 w-4' />
          </Button>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError('');
            }}
            placeholder='Scrie un mesaj...'
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className='flex-1 h-10'
          />
          <Button onClick={sendMessage} size='sm' className='h-10'>
            Trimite
          </Button>
        </div>
      </div>
    </div>
  );
}
