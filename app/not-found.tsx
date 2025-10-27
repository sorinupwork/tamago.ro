'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex grow items-center justify-center bg-background p-4'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-foreground'>
          <span className='text-primary'>404</span> - Pagina nu a fost găsită
        </h1>
        <p className='mt-4 text-lg text-secondary'>Această pagină nu există.</p>
        <Button onClick={() => router.push('/')} variant='secondary' className='mt-4 cursor-pointer'>
          Înapoi acasă
        </Button>
      </div>
    </div>
  );
}
