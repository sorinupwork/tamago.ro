import { ObjectId } from 'mongodb';

export type CarHistoryItem = {
  id?: string;
  title: string;
  description?: string;
  icon?: string; // string key for icon mapping e.g. 'Wrench' 'FileText' 'Droplet' 'Calendar'
  year?: number;
};

export type RawCarDoc = {
  _id: ObjectId | string;
  title?: string;
  price?: string | number;
  year?: string;
  brand?: string;
  mileage?: string;
  fuel?: string;
  transmission?: string;
  location?: string | { lat: number; lng: number; address: string; fullAddress: string };
  uploadedFiles?: string[];
  carType?: string;
  color?: string;
  engineCapacity?: string;
  horsePower?: string;
  status?: string;
  description?: string;
  features?: string | string[];
  period?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  traction?: string; // 'integrala' | 'fata' | 'spate'
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  options?: string[];
  minPrice?: string;
  maxPrice?: string;
  urlCategory?: string;
  carCategory?: 'sell' | 'buy' | 'rent' | 'auction';
  views?: number;
  userId?: string;
  history?: CarHistoryItem[]; // list of history items
};

export type Car = {
  id: string;
  title: string;
  price: string;
  currency?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  year: number;
  brand: string;
  category: 'sell' | 'buy' | 'rent' | 'auction';
  mileage: number;
  fuel: string;
  transmission: string;
  location: string;
  images: string[];
  dateAdded: string;
  sellerType: 'private' | 'firm';
  contactPhone: string;
  contactEmail: string;
  bodyType: string;
  color: string;
  engineCapacity?: number;
  horsepower?: number;
  status?: string;
  description?: string;
  features?: string[];
  traction?: string; // 'integrala' | 'fata' | 'spate'
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  options?: string[];
  lat?: number;
  lng?: number;
  minPrice?: string;
  maxPrice?: string;
  userId?: string;
  history?: CarHistoryItem[];
};

export type Post = {
  id: string;
  title: string;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  verified?: boolean;
  isNew?: boolean;
  imageUrl?: string;
  category: string;
};

export type FeedPost = {
  id: number;
  user: User;
  text: string;
  image?: string;
  likes: number;
};

export type Reaction = {
  likes: { total: number; userIds: string[] };
  comments: {
    id: string;
    text: string;
    userId: string;
    createdAt: string;
    replies: { id: string; text: string; userId: string; createdAt: string }[];
  }[];
};

export type FeedItem = {
  id: string;
  type: 'post' | 'poll';
  text?: string;
  files?: { url: string; key: string; filename: string; contentType?: string; size: number; thumbnailUrl?: string }[];
  tags?: string[];
  question?: string;
  options?: string[];
  votes?: number[];
  votedUsers?: string[];
  createdAt: string;
  userId?: string;
  user: User | null;
  reactions: Reaction;
};

export type StoryWithUser = {
  id: string;
  caption: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number; thumbnailUrl?: string }[];
  createdAt: string;
  expiresAt: string;
  userId?: string;
  user: User | null;
  reactions: Reaction;
};

export type Subcategory = {
  id: number;
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType;
};

export type User = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  password?: string;
  provider?: 'credentials' | 'google' | 'facebook' | 'instagram'; // made optional
  avatar?: string;
  image?: string | null;
  coverImage?: string | null;
  emailVerified?: boolean | Date | string | null; // accept boolean from session or Date/string from DB
  createdAt?: Date | string;
  updatedAt?: Date | string;
  role?: 'user' | 'admin';
  badges?: string[];
  platforms?: string[]; // added platforms
  progress?: { posts: number; friends: number; points: number };
  rewards?: { freePosts: number; premiumAccess: boolean };
  status?: string;
  category?: string;
  location?: [number, number];
  videoUrl?: string;
};

export type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
};

export type AutoFilterState = {
  status: string;
  brand: string;
  fuel: string[];
  transmission: string[];
  bodyType: string[];
  color: string[];
  priceRange: number[];
  yearRange: number[];
  mileageRange: number[];
  engineCapacityRange: number[];
  horsepowerRange: number[];
};

export type SortCriteria = {
  price: 'asc' | 'desc' | null;
  year: 'asc' | 'desc' | null;
  mileage: 'asc' | 'desc' | null;
  date: 'asc' | 'desc' | null;
};

export type LocationData = {
  lat: number;
  lng: number;
  address: string;
  fullAddress: string;
};

export type LocationFilter = {
  location: LocationData | null;
  radius: number;
};
