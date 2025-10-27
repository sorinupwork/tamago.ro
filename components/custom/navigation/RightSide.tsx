'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '../theme/ModeToggle';
import { categories } from '../../../lib/categories';

export function RightSide() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className='flex items-center gap-2'>
        <Button variant='outline' className='hidden lg:flex w-64 justify-start text-left cursor-pointer' onClick={() => setOpen(true)}>
          <Search className='h-4 w-4 mr-2' />
          Caută...
        </Button>
        <Button variant='outline' size='icon' className='lg:hidden' onClick={() => setOpen(true)}>
          <Search className='h-4 w-4' />
          <span className='sr-only'>Search</span>
        </Button>
        <ModeToggle />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Caută...' />
        <CommandList>
          <CommandEmpty>Nu s-au găsit rezultate.</CommandEmpty>
          <CommandGroup heading='Navigare'>
            <CommandItem asChild className='cursor-pointer'>
              <Link href='/'>Acasă</Link>
            </CommandItem>
            <CommandItem asChild className='cursor-pointer'>
              <Link href='/despre-noi'>Despre noi</Link>
            </CommandItem>
            <CommandItem asChild className='cursor-pointer'>
              <Link href='/contact'>Contact</Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Categorii'>
            {categories.map((component) => (
              <CommandItem asChild key={component.title} className='cursor-pointer'>
                <Link href={component.href}>{component.title}</Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
