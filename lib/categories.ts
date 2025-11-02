import React from 'react';
import { Car, Home, Briefcase, Smartphone, Zap, Wrench, Users, ShoppingCart, HandHeart, Calendar, Gavel } from 'lucide-react';

export interface Subcategory {
  id: number;
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType;
}

export const categories = [
  { key: 'sell', label: 'Vânzare', icon: ShoppingCart },
  { key: 'buy', label: 'Cumpărare', icon: HandHeart },
  { key: 'rent', label: 'Închiriere', icon: Calendar },
  { key: 'auction', label: 'Licitație', icon: Gavel },
];

export const subcategories: Subcategory[] = [
  {
    id: 1,
    title: 'Auto',
    href: '/categorii/auto',
    description: 'Anunțuri pentru mașini noi și second-hand.',
    icon: Car,
  },
  {
    id: 2,
    title: 'Imobiliare',
    href: '/categorii/imobiliare',
    description: 'Oferte imobiliare: apartamente, case, terenuri.',
    icon: Home,
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
