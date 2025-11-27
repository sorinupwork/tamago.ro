import type { Car, SortCriteria } from '@/lib/types';
import { getPriceNumeric } from './car-helpers';

export function getSortedCars(cars: Car[], sortCriteria: SortCriteria): Car[] {
  const sorted = cars.slice();

  sorted.sort((a, b) => {
    let result = 0;
    if (sortCriteria.date) {
      result =
        sortCriteria.date === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (result !== 0) return result;
    }
    if (sortCriteria.price) {
      const aPrice = getPriceNumeric(a);
      const bPrice = getPriceNumeric(b);
      result = sortCriteria.price === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      if (result !== 0) return result;
    }
    if (sortCriteria.year) {
      result = sortCriteria.year === 'asc' ? a.year - b.year : b.year - a.year;
      if (result !== 0) return result;
    }
    if (sortCriteria.mileage) {
      result = sortCriteria.mileage === 'asc' ? a.mileage - b.mileage : b.mileage - a.mileage;
      if (result !== 0) return result;
    }
    return 0;
  });

  return sorted;
}
