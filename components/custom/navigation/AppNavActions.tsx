'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, ShieldCheck } from 'lucide-react';

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
import { subcategories } from '@/lib/subcategories';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

export function AppNavActions() {
  const [open, setOpen] = React.useState(false);

  const mainCategories = categories.map((cat) => ({ title: cat.label, href: cat.href }));

  return (
    <>
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Caută...' />
        <CommandList>
          <CommandEmpty>Nu s-au găsit rezultate.</CommandEmpty>
          <CommandGroup heading='Navigare'>
            <CommandItem asChild>
              <Link href='/'>Acasă</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href='/suport'>Despre noi</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href='/social'>Contact</Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Categorii'>
            {mainCategories.map((cat) => (
              <CommandItem asChild key={cat.title}>
                <Link href={cat.href}>{cat.title}</Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Subcategorii'>
            {subcategories.map((component) => (
              <CommandItem asChild key={component.title}>
                <Link href={component.href}>{component.title}</Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
