import { Car as CarIcon, Home as HomeIcon, Briefcase, Smartphone, Zap, Wrench, Users } from 'lucide-react';

import { Subcategory } from './types';

export const subcategories: Subcategory[] = [
  {
    id: 1,
    title: 'Auto',
    href: '/categorii/auto',
    description: 'Anunțuri pentru mașini noi și second-hand.',
    icon: CarIcon,
  },
  {
    id: 2,
    title: 'Imobiliare',
    href: '/categorii/imobiliare',
    description: 'Oferte imobiliare: apartamente, case, terenuri.',
    icon: HomeIcon,
  },
  {
    id: 3,
    title: 'Job-uri',
    href: '/categorii/job-uri',
    description: 'Oportunități de angajare și locuri de muncă.',
    icon: Briefcase,
  },
  {
    id: 4,
    title: 'Electronice',
    href: '/categorii/electronice',
    description: 'Produse electronice la prețuri competitive.',
    icon: Smartphone,
  },
  {
    id: 5,
    title: 'Electrocasnice',
    href: '/categorii/electrocasnice',
    description: 'Produse electrocasnice la prețuri competitive.',
    icon: Zap,
  },
  {
    id: 6,
    title: 'Piese Auto',
    href: '/categorii/piese-auto',
    description: 'Piese de schimb pentru automobile.',
    icon: Wrench,
  },
  {
    id: 7,
    title: 'Servicii',
    href: '/categorii/servicii',
    description: 'Servicii profesionale pentru diverse nevoi.',
    icon: Users,
  },
].filter((sub) => sub.title);
