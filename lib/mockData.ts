import { Car as CarIcon, Home as HomeIcon, Briefcase, Smartphone, Zap, Wrench } from 'lucide-react';

import { Post, User } from './types';

export const posts: Post[] = [
  {
    id: 1,
    title: 'Mașină de vânzare - BMW X3',
    desc: 'Mașină second-hand verificată, preț negociabil.',
    icon: CarIcon,
    verified: true,
    isNew: true,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Apartament în București',
    desc: 'Apartament 3 camere, verificat și promovat.',
    icon: HomeIcon,
    verified: true,
    isNew: false,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'Job Freelance - Dezvoltator Web',
    desc: 'Oportunitate verificată pentru dezvoltatori.',
    icon: Briefcase,
    verified: true,
    isNew: true,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    title: 'Telefon Samsung Galaxy',
    desc: 'Electronic nou, verificat și la preț bun.',
    icon: Smartphone,
    verified: true,
    isNew: false,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    title: 'Frigider LG',
    desc: 'Electrocasnic verificat, promoție specială.',
    icon: Zap,
    verified: true,
    isNew: true,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    title: 'Piese Auto pentru Dacia',
    desc: 'Piese originale, verificate.',
    icon: Wrench,
    verified: true,
    isNew: false,
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'User One',
    avatar: '/avatars/01.jpg',
    status: 'Online',
    category: 'Prieteni',
    location: [44.4268, 26.1025] as [number, number],
  }, // Bucharest
  {
    id: 2,
    name: 'User Two',
    avatar: '/avatars/02.jpg',
    status: 'Away',
    category: 'Recenți',
    location: [45.9432, 24.9668] as [number, number],
  }, // Sibiu
  {
    id: 3,
    name: 'User Three',
    avatar: '/avatars/03.jpg',
    status: 'Offline',
    category: 'Prieteni',
    location: [47.1585, 27.6014] as [number, number],
  }, // Iași
  {
    id: 4,
    name: 'User Four',
    avatar: '/avatars/04.jpg',
    status: 'Online',
    category: 'Recenți',
    location: [46.7712, 23.6236] as [number, number],
  }, // Cluj
  {
    id: 5,
    name: 'User Five',
    avatar: '/avatars/05.jpg',
    status: 'Away',
    category: 'Prieteni',
    location: [44.1812, 28.6348] as [number, number],
  }, // Constanța
];
