import type { Car } from '@/lib/types';

export function getPriceValue(car: Car): string {
  if (car.category === 'buy') {
    return car.minPrice;
  }
  return car.price;
}

export function getPriceNumeric(car: Car): number {
  const priceStr = getPriceValue(car);
  const lastCommaIdx = priceStr.lastIndexOf(',');
  const lastDotIdx = priceStr.lastIndexOf('.');

  if (lastCommaIdx > lastDotIdx) {
    return parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));
  } else {
    return parseFloat(priceStr.replace(/,/g, ''));
  }
}

export function getMaxPrice(car: Car): string {
  if (car.category === 'buy') {
    return car.maxPrice;
  }
  return car.price;
}

export function getMaxPriceNumeric(car: Car): number {
  const priceStr = getMaxPrice(car);
  const lastCommaIdx = priceStr.lastIndexOf(',');
  const lastDotIdx = priceStr.lastIndexOf('.');

  if (lastCommaIdx > lastDotIdx) {
    return parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));
  } else {
    return parseFloat(priceStr.replace(/,/g, ''));
  }
}

export function getDisplayPrice(car: Car): string {
  if (car.category === 'buy') {
    return `${car.minPrice} - ${car.maxPrice}`;
  }
  return car.price;
}

export function getPriceWithCurrency(car: Car): string {
  return `${getDisplayPrice(car)} ${car.currency || 'RON'}`;
}
