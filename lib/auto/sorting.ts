import type { Car, SortCriteria } from '@/lib/types';

export function getSortedCars(cars: Car[], sortCriteria: SortCriteria): Car[] {
  const sorted = cars.slice();

  sorted.sort((a, b) => {
    let result = 0;
    if (sortCriteria.date) {
      result =
        sortCriteria.date === 'asc'
          ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      if (result !== 0) return result;
    }
    if (sortCriteria.price) {
      result =
        sortCriteria.price === 'asc'
          ? parseFloat(a.price.replace(/\./g, '')) - parseFloat(b.price.replace(/\./g, ''))
          : parseFloat(b.price.replace(/\./g, '')) - parseFloat(a.price.replace(/\./g, ''));
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
