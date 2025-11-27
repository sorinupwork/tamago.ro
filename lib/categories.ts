import { ShoppingCart, HandHeart, Calendar, Gavel } from 'lucide-react';

export const categories = [
  { key: 'sell', label: 'Ofertă', icon: ShoppingCart, href: '/categorii?tip=oferta' },
  { key: 'buy', label: 'Cerere', icon: HandHeart, href: '/categorii?tip=cerere' },
  { key: 'rent', label: 'Închiriere', icon: Calendar, href: '/categorii?tip=inchiriere' },
  { key: 'auction', label: 'Licitație', icon: Gavel, href: '/categorii?tip=licitatie' },
];

export const categoryMapping = {
  oferta: 'sell',
  cerere: 'buy',
  inchiriere: 'rent',
  licitatie: 'auction',
} as const;

export const reverseCategoryMapping = {
  sell: 'oferta',
  buy: 'cerere',
  rent: 'inchiriere',
  auction: 'licitatie',
} as const;

