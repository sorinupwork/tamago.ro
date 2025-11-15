import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function AppOAuth() {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>Sau înregistrează-te cu</h3>
      <div className='flex flex-col space-y-3'>
        <Button
          variant='outline'
          className='w-full hover:scale-105 transition-transform'
          onClick={() => toast.info('Înregistrare cu Google în curând!')}
        >
          <Image src='/icons/google.svg' alt='Google' width={16} height={16} className='mr-2' />
          Continuă cu Google
        </Button>
        <Button
          variant='outline'
          className='w-full hover:scale-105 transition-transform'
          onClick={() => toast.info('Înregistrare cu Facebook în curând!')}
        >
          <Image src='/icons/facebook.svg' alt='Facebook' width={16} height={16} className='mr-2' />
          Continuă cu Facebook
        </Button>
        <Button
          variant='outline'
          className='w-full hover:scale-105 transition-transform'
          onClick={() => toast.info('Înregistrare cu Instagram în curând!')}
        >
          <Image src='/icons/instagram.svg' alt='Instagram' width={16} height={16} className='mr-2' />
          Continuă cu Instagram
        </Button>
      </div>
    </div>
  );
}
