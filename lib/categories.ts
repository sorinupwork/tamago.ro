import { ShoppingCart, HandHeart, Calendar, Gavel } from 'lucide-react';

export const categories = [
  { key: 'sell', label: 'Vânzare', icon: ShoppingCart },
  { key: 'buy', label: 'Cumpărare', icon: HandHeart },
  { key: 'rent', label: 'Închiriere', icon: Calendar },
  { key: 'auction', label: 'Licitație', icon: Gavel },
];

export const categoryMapping = {
  vanzare: 'sell',
  cumparare: 'buy',
  inchiriere: 'rent',
  licitatie: 'auction',
} as const;

export const categoryLabels = {
  sell: 'Vânzare',
  buy: 'Cumpărare',
  rent: 'Închiriere',
  auction: 'Licitație',
} as const;


