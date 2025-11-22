'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BadgePlus, BadgeInfo, BadgeCheck, AtSign } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { AppNavDropdownItem } from './AppNavDropdownItem';
import { AppLogo } from '../logo/AppLogo';
import { AppNavActions } from './AppNavActions';
import { subcategories } from '@/lib/subcategories';
import { categories } from '@/lib/categories';
import { FavoritesDrawer } from '../drawer/FavoritesDrawer';

export function AppNavigation() {
  const [searchOpen, setSearchOpen] = useState(false);

  const mainCategories = categories.map((cat) => ({ title: cat.label, href: cat.href }));

  return (
    <>
      <nav className='sticky top-0 z-50 bg-background border-b'>
        <div className='flex justify-between items-center px-2 sm:px-4 py-2 gap-1'>
          <div className='flex items-center gap-2 md:gap-4'>
            <AppLogo />

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='flex items-center gap-1 md:gap-2 p-2'>
                    <BadgePlus className='w-4 h-4' />
                    <span className='hidden md:inline'>Anunț</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid gap-2 min-w-3xs md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                      <AppNavDropdownItem
                        href='/'
                        className='row-span-3 min-h-24 md:min-h-72 shine'
                        linkClassName='bg-[url("/tamago.png")] bg-cover bg-center backdrop-blur-sm bg-black/30 dark:bg-black/40 flex h-full w-full flex-col justify-center items-center rounded-md p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6'
                        titleClass='mb-2 text-lg sm:mt-4 text-center text-white backdrop-blur-xs'
                        pClass='leading-tight text-center text-white backdrop-blur-xs'
                      />

                      <div>
                        <AppNavDropdownItem href='/categorii?tip=oferta' title='Ofertă'>
                          Oferă servicii pentru proiectele dumneavoastră.
                        </AppNavDropdownItem>
                        <AppNavDropdownItem href='/categorii?tip=cerere' title='Cerere'>
                          Caută servicii pentru nevoile dumneavoastră.
                        </AppNavDropdownItem>
                        <AppNavDropdownItem href='/categorii?tip=inchiriere' title='Închiriere'>
                          Servicii de închiriere pentru proiectele temporare.
                        </AppNavDropdownItem>
                        <AppNavDropdownItem href='/categorii?tip=licitatie' title='Licitație'>
                          Participați la licitații pentru cele mai bune oferte.
                        </AppNavDropdownItem>
                      </div>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='flex items-center gap-1 md:gap-2 p-2'>
                    <BadgeCheck className='w-4 h-4' />
                    <span className='hidden md:inline'>Alege</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid gap-2 min-w-3xs sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                      {subcategories.map((component) => (
                        <AppNavDropdownItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </AppNavDropdownItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className='hidden md:flex'>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href='/suport' className='flex flex-row items-center gap-2 cursor-default'>
                      <BadgeInfo className='w-4 h-4' />
                      <span className='hidden lg:inline'>Suport</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href='/social' className='flex flex-row items-center gap-2 cursor-default'>
                      <AtSign className='w-4 h-4' />
                      <span className='hidden lg:inline'>Social</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <FavoritesDrawer onOpenSearch={() => setSearchOpen(true)} />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <AppNavActions setOpen={setSearchOpen} />
        </div>
      </nav>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder='Caută...' />
        <CommandList>
          <CommandEmpty>Nu s-au găsit rezultate.</CommandEmpty>
          <CommandGroup heading='Navigare'>
            <CommandItem asChild>
              <Link href='/'>Acasă</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href='/suport'>Suport</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href='/social'>Social</Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href='/cont'>Cont</Link>
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
