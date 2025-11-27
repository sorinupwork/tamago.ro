'use client';

import Link from 'next/link';
import { Search, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ModeToggle from '../theme/ModeToggle';
import { cn } from '@/lib/utils';

type AppNavActionsProps = {
  setOpen: (open: boolean) => void;
};

export default function AppNavActions({ setOpen }: AppNavActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      <Button variant='outline' className='w-10 h-10 justify-start text-left sm:w-52' onClick={() => setOpen(true)}>
        <Search className='h-4 w-4' />
        <span className='hidden sm:inline ml-2'>Caută...</span>
        <span className='sr-only'>Search</span>
      </Button>
      <Button variant='outline' className={cn(' w-10 h-10 justify-start text-left xl:w-auto')} asChild>
        <Link href='/cont' className='cursor-default'>
          <ShieldCheck className='h-4 w-4' />
          <span className='hidden xl:inline'>Cont</span>
          <span className='sr-only'>Cont</span>
        </Link>
      </Button>

      <ModeToggle />
    </div>
  );
}
