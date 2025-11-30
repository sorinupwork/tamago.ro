import { ObjectId } from 'mongodb';

// ============================================================================
// SHARED TYPES
// ============================================================================

export type CarHistoryItem = {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  year?: number;
};

export type FileObject = {
  url: string;
  key: string;
  filename: string;
  contentType?: string;
  size: number;
  thumbnailUrl?: string;
};

// ============================================================================
// RAW MONGODB DOCUMENT (Database Layer)
// ============================================================================

export type RawCarDoc = {
  _id: ObjectId | string;
  title?: string;
  description?: string;
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  minEngineCapacity?: number;
  maxEngineCapacity?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  currency?: string;
  location?: { lat: number; lng: number; address: string };
  year?: string | number;
  brand?: string;
  model?: string;
  mileage?: string | number;
  fuel?: string;
  transmission?: string;
  color?: string;
  engineCapacity?: string | number;
  carType?: string;
  horsePower?: string | number;
  minHorsePower?: string | number;
  maxHorsePower?: string | number;
  status?: string;
  features?: string | string[];
  traction?: string;
  steeringWheelPosition?: 'left' | 'right';
  uploadedFiles?: string[];
  images?: string[];
  options?: string[];
  contactPhone?: string;
  contactEmail?: string;
  sellerType?: string;
  userId?: string;
  user?: User | null;
  history?: CarHistoryItem[];
  urlCategory?: string;
  views?: number;
  carCategory?: 'sell' | 'buy' | 'rent' | 'auction';
  bids?: unknown[];
  currentBidder?: string;
  currentBidAmount?: number;
};

// ============================================================================
// CAR TYPES
// ============================================================================

type BaseCarProperties = {
  id: string;
  title: string;
  description?: string;
  location: string;
  lat?: number;
  lng?: number;
  brand: string;
  model?: string;
  year: number;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  bodyType: string;
  horsePower?: number;
  engineCapacity?: number;
  traction?: string;
  steeringWheelPosition?: 'left' | 'right';
  status?: string;
  features?: string[];
  images: string[];
  options?: string[];
  history?: CarHistoryItem[];
  contactPhone?: string;
  contactEmail?: string;
  sellerType: 'private' | 'firm';
  userId?: string;
  user?: User | null;
  views?: number;
  createdAt: string;
  currency?: string;
};

export type CarSell = BaseCarProperties & {
  category: 'sell';
  price: string;
};

export type CarBuy = BaseCarProperties & {
  category: 'buy';
  minPrice: string;
  maxPrice: string;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  minEngineCapacity?: number;
  maxEngineCapacity?: number;
  minHorsePower?: number;
  maxHorsePower?: number;
};

export type CarRent = BaseCarProperties & {
  category: 'rent';
  price: string;
  period: string;
  startDate: string;
  endDate: string;
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
};

export type Bid = {
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number;
  createdAt: string;
};

export type CarAuction = BaseCarProperties & {
  category: 'auction';
  price: string;
  endDate: string;
  bids?: Bid[];
  currentBidder?: string;
  currentBidAmount?: number;
};

export type Car = CarSell | CarBuy | CarRent | CarAuction;

export type Post = Car & {
  isNew?: boolean;
  verified?: boolean;
  favoritesCount?: number;
};

// ============================================================================
// SOCIAL FEED TYPES
// ============================================================================

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

export type FeedPost = {
  id: string;
  type: 'post' | 'poll';
  text?: string;
  question?: string;
  options?: string[];
  files?: FileObject[];
  createdAt: string;
  tags?: string[];
  userId?: string;
  user: User | null;
  reactions: Reaction;
  votes?: number[];
  votedUsers?: string[];
};

export type FeedItem = {
  id: string;
  type: 'post' | 'poll';
  text?: string;
  files?: FileObject[];
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

export type StoryPost = {
  id: string;
  caption: string;
  files: FileObject[];
  createdAt: string;
  expiresAt: string;
  userId?: string;
  user: User | null;
  reactions: Reaction;
};

export type StoryWithUser = StoryPost;

export type Follows = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
};

// ============================================================================
// USER & SESSION
// ============================================================================

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

export type Session = {
  user?: User;
  expires: string;
  token?: string;
};

export type Favorites = {
  id: string;
  userId: string;
  postId: string;
  postType: 'car' | 'feed' | 'story';
  createdAt: string;
  user?: User;
  car?: Car;
  feedPost?: FeedPost;
  storyPost?: StoryPost;
};

// ============================================================================
// UI & FILTER
// ============================================================================

export type Subcategory = {
  id: number;
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType;
};

export type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
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

export type AutoFilterState = {
  status: string;
  brand: string;
  model: string;
  fuel: string[];
  transmission: string[];
  bodyType: string[];
  color: string[];
  traction: string[];
  steeringWheelPosition: string;
  priceCurrency: string[];
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
