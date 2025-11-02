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
import { subcategories } from '@/lib/mockData';

export function AppNavigation() {
  return (
    <div className='flex justify-between items-center px-4 py-2 gap-1'>
      <div className='flex items-center gap-4'>
        <AppLogo />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='flex items-center gap-2 p-2'>
                <Home className='w-4 h-4' />
                <span className='hidden md:inline'>Acasa</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid space-x-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                  <AppNavDropdownItem
                    href='/'
                    title='tamago.ro'
                    className='row-span-3'
                    linkClassName='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6'
                    titleClass='mb-2 text-lg sm:mt-4'
                    pClass='leading-tight'
                  >
                    Noul nostru proiect va fi lansat în curând. Rămâneți la curent!
                  </AppNavDropdownItem>

                  <div>
                    <AppNavDropdownItem href='/categorii?category=sell' title='Vânzare'>
                      Oferim servicii de vânzare pentru proiectele dumneavoastră.
                    </AppNavDropdownItem>
                    <AppNavDropdownItem href='/categorii?category=buy' title='Cumpărare'>
                      Cumpărați servicii pentru nevoile dumneavoastră.
                    </AppNavDropdownItem>
                    <AppNavDropdownItem href='/categorii?category=rent' title='Închiriere'>
                      Servicii de inchiriat pentru proiectele temporare.
                    </AppNavDropdownItem>
                    <AppNavDropdownItem href='/categorii?category=auction' title='Licitație'>
                      Participați la licitații pentru cele mai bune oferte.
                    </AppNavDropdownItem>
                  </div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='flex items-center gap-2 p-2'>
                <Folder className='w-4 h-4' />
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
                <Link href='/despre-noi' className='flex flex-row items-center gap-2'>
                  <Info className='w-4 h-4' />
                  <span className='hidden lg:inline'>Despre noi</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className='hidden md:flex'>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href='/contact' className='flex flex-row items-center gap-2'>
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
  );
}
