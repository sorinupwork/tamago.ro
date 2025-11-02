export type Car = {
  id: number;
  title: string;
  price: number;
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
