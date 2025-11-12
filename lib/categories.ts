import { ShoppingCart, HandHeart, Calendar, Gavel } from 'lucide-react';

export const categories = [
  { key: 'sell', label: 'Ofertă', icon: ShoppingCart, href: '/categorii?tip=vanzare' },
  { key: 'buy', label: 'Cerere', icon: HandHeart, href: '/categorii?tip=cumparare' },
  { key: 'rent', label: 'Închiriere', icon: Calendar, href: '/categorii?tip=inchiriere' },
  { key: 'auction', label: 'Licitație', icon: Gavel, href: '/categorii?tip=licitatie' },
];

export const categoryMapping = {
  vanzare: 'sell',
  cumparare: 'buy',
  inchiriere: 'rent',
  licitatie: 'auction',
} as const;

export const categoryLabels = {
  sell: 'Ofertă',
  buy: 'Cerere',
  rent: 'Închiriere',
  auction: 'Licitație',
} as const;


