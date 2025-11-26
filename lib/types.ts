import { ObjectId } from 'mongodb';

export type RawCarDoc = {
  _id: ObjectId | string;
  title?: string;
  price?: string | number;
  year?: string;
  brand?: string;
  mileage?: string;
  fuel?: string;
  transmission?: string;
  location?: { lat: number; lng: number; address: string };
  uploadedFiles?: string[];

  images?: string[];
  carType?: string;
  color?: string;
  engineCapacity?: string;
  horsePower?: string;
  horsepower?: number;

  status?: string;
  description?: string;
  features?: string | string[];
  period?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  traction?: string;
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  contactPhone?: string;
  contactEmail?: string;
  options?: string[];
  minPrice?: string;
  maxPrice?: string;
  dateAdded?: string;
  sellerType?: string;
  carCategory?: 'sell' | 'buy' | 'rent' | 'auction';
  userId?: string;
  history?: CarHistoryItem[];

  urlCategory?: string;
  views?: number;
};

export type Car = {
  id: string;
  title: string;
  price: string;
  year: number;
  brand: string;
  mileage: number;
  fuel: string;
  transmission: string;
  location: string;
  images: string[];
  color: string;
  bodyType: string;
  engineCapacity?: number;
  horsepower?: number;
  status?: string;
  description?: string;
  features?: string[];
  period?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  traction?: string;
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  contactPhone: string;
  contactEmail: string;
  options?: string[];
  minPrice?: string;
  maxPrice?: string;
  dateAdded: string;
  sellerType: 'private' | 'firm';
  category: 'sell' | 'buy' | 'rent' | 'auction';
  userId?: string;
  history?: CarHistoryItem[];

  lat?: number;
  lng?: number;
};

export type CarHistoryItem = {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  year?: number;
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
  provider?: 'credentials' | 'google' | 'facebook' | 'instagram';
  avatar?: string;
  image?: string | null;

  coverImage?: string | null;
  emailVerified?: boolean | Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  role?: 'user' | 'admin';
  badges?: string[];
  platforms?: string[];
  progress?: { posts: number; friends: number; points: number };
  rewards?: { freePosts: number; premiumAccess: boolean };
  status?: string;
  category?: string;
  location?: [number, number];
  address?: string;

  privacySettings?: {
    emailPublic: boolean;
    phonePublic: boolean;
    locationPublic: boolean;
    profileVisible: boolean;
  };

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
};

export type LocationFilter = {
  location: LocationData | null;
  radius: number;
};
