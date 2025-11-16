export type Car = {
  id: number;
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
};

export type Post = {
  id: number;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  verified: boolean;
  isNew: boolean;
  imageUrl: string;
};

export type Subcategory = {
  id: number;
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType;
};

export type User = {
  id: number;
  name: string;
  avatar: string;
  status: string;
  category: string;
  location: [number, number];
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
