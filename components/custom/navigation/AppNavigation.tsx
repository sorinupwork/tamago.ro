'use client';

import Link from 'next/link';
import { Home, Folder, Info, Mail } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { AppNavDropdownItem } from './AppNavDropdownItem';
import { AppLogo } from '../logo/AppLogo';
import { AppNavActions } from './AppNavActions';
import { subcategories } from '@/lib/subcategories';

export function AppNavigation() {
  return (
    <nav className='sticky top-0 z-50 bg-background border-b'>
      <div className='flex justify-between items-center px-2 sm:px-4 py-2 gap-1'>
        <div className='flex items-center gap-2 md:gap-4'>
          <AppLogo />

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className='flex items-center gap-1 md:gap-2 p-1 md:p-2'>
                  <Home className='w-3 h-3 md:w-4 md:h-4' />
                  <span className='hidden md:inline'>Acasa</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid space-x-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                    <AppNavDropdownItem
                      href='/'
                      className='row-span-3 min-h-24 md:min-h-72 shine'
                      linkClassName='bg-[url("/tamago.png")] bg-cover bg-center backdrop-blur-sm bg-black/30 dark:bg-black/40 flex h-full w-full flex-col justify-center items-center rounded-md p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6'
                      titleClass='mb-2 text-lg sm:mt-4 text-center text-white backdrop-blur-xs'
                      pClass='leading-tight text-center text-white backdrop-blur-xs'
                    />

                    <div>
                      <AppNavDropdownItem href='/categorii?tip=vanzare' title='Vânzare'>
                        Oferim servicii de vânzare pentru proiectele dumneavoastră.
                      </AppNavDropdownItem>
                      <AppNavDropdownItem href='/categorii?tip=cumparare' title='Cumpărare'>
                        Cumpărați servicii pentru nevoile dumneavoastră.
                      </AppNavDropdownItem>
                      <AppNavDropdownItem href='/categorii?tip=inchiriere' title='Închiriere'>
                        Servicii de inchiriat pentru proiectele temporare.
                      </AppNavDropdownItem>
                      <AppNavDropdownItem href='/categorii?tip=licitatie' title='Licitație'>
                        Participați la licitații pentru cele mai bune oferte.
                      </AppNavDropdownItem>
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className='flex items-center gap-1 md:gap-2 p-1 md:p-2'>
                  <Folder className='w-3 h-3 md:w-4 md:h-4' />
                  <span className='hidden md:inline'>Categorii</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
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
                  <Link href='/despre-noi' className='flex flex-row items-center gap-2 cursor-default'>
                    <Info className='w-4 h-4' />
                    <span className='hidden lg:inline'>Despre noi</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className='hidden md:flex'>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href='/contact' className='flex flex-row items-center gap-2 cursor-default'>
                    <Mail className='w-4 h-4' />
                    <span className='hidden lg:inline'>Contact</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <AppNavActions />
      </div>
    </nav>
  );
}
