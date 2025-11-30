import type { Car, CarBuy, SortCriteria } from '@/lib/types';
import { getPriceNumeric } from './helpers';

function getMileageValue(car: Car): number {
  if (car.category === 'buy') {
    const buyCar = car as CarBuy;
    return buyCar.minMileage || 0;
  }
  const mileageStr = String(car.mileage || '0');
  return parseFloat(mileageStr.replace(/,/g, ''));
}

function getYearValue(car: Car): number {
  if (car.category === 'buy') {
    const buyCar = car as CarBuy;
    return buyCar.minYear || 0;
  }
  return typeof car.year === 'number' ? car.year : parseFloat(String(car.year || '0'));
}

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
      const aYear = getYearValue(a);
      const bYear = getYearValue(b);
      result = sortCriteria.year === 'asc' ? aYear - bYear : bYear - aYear;
      if (result !== 0) return result;
    }
    if (sortCriteria.mileage) {
      const aMileage = getMileageValue(a);
      const bMileage = getMileageValue(b);
      result = sortCriteria.mileage === 'asc' ? aMileage - bMileage : bMileage - aMileage;
      if (result !== 0) return result;
    }
    return 0;
  });

  return sorted;
}
