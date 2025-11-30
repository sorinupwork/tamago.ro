import { Car as CarIcon, Home as HomeIcon, Briefcase, Smartphone, Zap, Wrench, Users, Construction, Sofa } from 'lucide-react';

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
  {
    id: 8,
    title: 'Construcții',
    href: '/categorii/construcții',
    description: 'Servicii și materiale pentru construcții.',
    icon: Construction,
  },
  {
    id: 9,
    title: 'Mobila și Decorațiuni',
    href: '/categorii/mobila',
    description: 'Mobilă și decorațiuni interioare.',
    icon: Sofa,
  },
].filter((sub) => sub.title);
