'use client';

import { useRouter } from 'next/navigation';
import { HomeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex grow items-center justify-center bg-background p-4'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <HomeIcon className='size-8' />
          </EmptyMedia>
          <EmptyTitle>404 - Pagina nu a fost găsită</EmptyTitle>
          <EmptyDescription>Această pagină nu există. Verifică adresa URL sau navighează înapoi.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => router.push('/')} variant='secondary'>
            Înapoi acasă
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
