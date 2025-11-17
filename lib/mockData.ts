import { User } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'User One',
    email: 'user1@example.com',
    provider: 'credentials',
    avatar: '/avatars/01.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Online',
    category: 'Prieteni',
    location: [44.4268, 26.1025] as [number, number],
  }, // Bucharest
  {
    id: '2',
    name: 'User Two',
    email: 'user2@example.com',
    provider: 'credentials',
    avatar: '/avatars/02.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Away',
    category: 'Recenți',
    location: [45.9432, 24.9668] as [number, number],
  }, // Sibiu
  {
    id: '3',
    name: 'User Three',
    email: 'user3@example.com',
    provider: 'credentials',
    avatar: '/avatars/03.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Offline',
    category: 'Prieteni',
    location: [47.1585, 27.6014] as [number, number],
  }, // Iași
  {
    id: '4',
    name: 'User Four',
    email: 'user4@example.com',
    provider: 'credentials',
    avatar: '/avatars/04.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Online',
    category: 'Recenți',
    location: [46.7712, 23.6236] as [number, number],
  }, // Cluj
  {
    id: '5',
    name: 'User Five',
    email: 'user5@example.com',
    provider: 'credentials',
    avatar: '/avatars/05.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Away',
    category: 'Prieteni',
    location: [44.1812, 28.6348] as [number, number],
  }, // Constanța
];
