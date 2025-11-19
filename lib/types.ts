import { ObjectId } from 'mongodb';

export type Car = {
  id: string; // Changed to string for _id
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
  is4x4?: boolean;
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
};

export type Post = {
  id: string; // Changed from number to string for _id
  title: string;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  verified?: boolean;
  isNew?: boolean;
  imageUrl?: string;
  category: string; // Add category for navigation
};

export type Subcategory = {
  id: number;
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType;
};

export type User = {
  id: string; // MongoDB _id as string
  name: string;
  email: string;
  password?: string; // Only for credentials provider; hashed in DB
  provider: 'credentials' | 'google' | 'facebook' | 'instagram';
  avatar?: string; // Changed from image to avatar for consistency with mock data
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  role?: 'user' | 'admin'; // Optional for future roles
  badges?: string[]; // Array of badge names (e.g., ['First Post', 'Verified'])
  progress?: { posts: number; friends: number; points: number }; // Progress metrics
  rewards?: { freePosts: number; premiumAccess: boolean }; // Rewards like free posts
  status?: string; // Added for mock data and StoriesSection
  category?: string; // Added for mock data and StoriesSection
  location?: [number, number]; // Added for mock data
};

export type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
};

export type FilterState = {
  minEngineCapacity: string;
  maxEngineCapacity: string;
  minHorsepower: string;
  maxHorsepower: string;
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

export type FeedPost = {
  id: number;
  user: User;
  text: string;
  image?: string;
  likes: number;
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
  is4x4?: boolean;
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
};
