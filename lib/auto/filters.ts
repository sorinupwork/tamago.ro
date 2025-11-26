import { calculateDistance } from '@/lib/services';
import type { Car, AutoFilterState, SortCriteria, LocationFilter } from '@/lib/types';
import { defaultFilters } from './initializers';

export function getFilteredCars(
  cars: Car[],
  filters: AutoFilterState,
  searchQuery: string,
  activeTab: string,
  categoryMapping: Record<string, string>,
  locationFilter: LocationFilter
): Car[] {
  let filtered = cars.slice();
  const parsePrice = (val?: string) => {
    if (!val) return 0;
    const s = String(val).trim();
    const hasComma = s.indexOf(',') !== -1;
    const hasDot = s.indexOf('.') !== -1;
    try {
      if (hasComma && hasDot) {
        return parseFloat(s.replace(/\./g, '').replace(/,/g, '.')) || 0;
      }
      if (hasDot && !hasComma) {
        const parts = s.split('.');
        if (parts.length > 1 && parts[1].length === 3) {
          return parseFloat(s.replace(/\./g, '')) || 0;
        }
        return parseFloat(s) || 0;
      }
      if (hasComma && !hasDot) {
        return parseFloat(s.replace(/,/g, '.')) || 0;
      }
      return parseFloat(s) || 0;
    } catch (e) {
      return 0;
    }
  };
  filtered = filtered.filter(
    (car) => (car.engineCapacity || 0) >= filters.engineCapacityRange[0] && (car.engineCapacity || 0) <= filters.engineCapacityRange[1]
  );
  filtered = filtered.filter(
    (car) => (car.horsepower || 0) >= filters.horsepowerRange[0] && (car.horsepower || 0) <= filters.horsepowerRange[1]
  );
  if (filters.status) filtered = filtered.filter((car) => car.status === filters.status);
  filtered = filtered.filter((car) => {
    const priceNum = parsePrice(car.price);
    return priceNum >= filters.priceRange[0] && priceNum <= filters.priceRange[1];
  });
  filtered = filtered.filter((car) => car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1]);
  filtered = filtered.filter((car) => car.mileage >= filters.mileageRange[0] && car.mileage <= filters.mileageRange[1]);
  if (filters.brand) filtered = filtered.filter((car) => car.brand.toLowerCase().includes(filters.brand.toLowerCase()));
  if (searchQuery)
    filtered = filtered.filter(
      (car) => car.title.toLowerCase().includes(searchQuery.toLowerCase()) || car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  if (filters.fuel.length > 0) filtered = filtered.filter((car) => filters.fuel.includes(car.fuel));
  if (filters.transmission.length > 0) filtered = filtered.filter((car) => filters.transmission.includes(car.transmission));
  if (filters.bodyType.length > 0) filtered = filtered.filter((car) => filters.bodyType.includes(car.bodyType));
  if (filters.color.length > 0) filtered = filtered.filter((car) => filters.color.includes(car.color));
  if (activeTab) filtered = filtered.filter((car) => car.category === categoryMapping[activeTab as string]);

  const loc = locationFilter.location;
  if (loc) {
    console.log('Filtering by location:', loc.lat, loc.lng, 'radius:', locationFilter.radius);
    filtered = filtered.filter((car) => {
      if (car.lat && car.lng) {
        const distance = calculateDistance(loc.lat, loc.lng, car.lat, car.lng);
        console.log(`Car ${car.id} at ${car.lat}, ${car.lng}, distance: ${distance} km`);
        return distance <= locationFilter.radius;
      }
      console.log(`Car ${car.id} has no lat/lng`);
      return true;
    });
  }

  return filtered;
}

export function getAppliedFilters(
  filters: AutoFilterState,
  sortCriteria: SortCriteria,
  searchQuery: string,
  locationFilter: LocationFilter
): { key: string; value: string; label: string }[] {
  return [
    ...filters.fuel.map((f: string) => ({ key: 'fuel', value: f, label: `Combustibil: ${f}` })),
    ...filters.transmission.map((t: string) => ({ key: 'transmission', value: t, label: `Transmisie: ${t}` })),
    ...filters.bodyType.map((b: string) => ({ key: 'bodyType', value: b, label: `Caroserie: ${b}` })),
    ...filters.color.map((c: string) => ({ key: 'color', value: c, label: `Culoare: ${c}` })),
    ...(filters.brand ? [{ key: 'brand', value: filters.brand, label: `Marcă: ${filters.brand}` }] : []),
    ...(locationFilter.location
      ? [{ key: 'location', value: locationFilter.location.address, label: `Locație: ${locationFilter.location.address}` }]
      : []),
    ...(filters.status
      ? [{ key: 'status', value: filters.status, label: `Stare: ${filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}` }]
      : []),
    ...(searchQuery ? [{ key: 'searchQuery', value: searchQuery, label: `Căutare: ${searchQuery}` }] : []),
    ...(filters.priceRange[0] !== defaultFilters.priceRange[0] || filters.priceRange[1] !== defaultFilters.priceRange[1]
      ? [
          {
            key: 'priceRange',
            value: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
            label: `Interval Preț: $${filters.priceRange[0]} - $${filters.priceRange[1]}`,
          },
        ]
      : []),
    ...(filters.yearRange[0] !== defaultFilters.yearRange[0] || filters.yearRange[1] !== defaultFilters.yearRange[1]
      ? [
          {
            key: 'yearRange',
            value: `${filters.yearRange[0]}-${filters.yearRange[1]}`,
            label: `Interval An: ${filters.yearRange[0]} - ${filters.yearRange[1]}`,
          },
        ]
      : []),
    ...(filters.mileageRange[0] !== defaultFilters.mileageRange[0] || filters.mileageRange[1] !== defaultFilters.mileageRange[1]
      ? [
          {
            key: 'mileageRange',
            value: `${filters.mileageRange[0]}-${filters.mileageRange[1]}`,
            label: `Interval Kilometraj: ${filters.mileageRange[0]} - ${filters.mileageRange[1]} km`,
          },
        ]
      : []),
    ...(filters.engineCapacityRange[0] !== defaultFilters.engineCapacityRange[0] ||
    filters.engineCapacityRange[1] !== defaultFilters.engineCapacityRange[1]
      ? [
          {
            key: 'engineCapacityRange',
            value: `${filters.engineCapacityRange[0]}-${filters.engineCapacityRange[1]}`,
            label: `Interval Capacitate Motor: ${filters.engineCapacityRange[0]} - ${filters.engineCapacityRange[1]} cc`,
          },
        ]
      : []),
    ...(filters.horsepowerRange[0] !== defaultFilters.horsepowerRange[0] || filters.horsepowerRange[1] !== defaultFilters.horsepowerRange[1]
      ? [
          {
            key: 'horsepowerRange',
            value: `${filters.horsepowerRange[0]}-${filters.horsepowerRange[1]}`,
            label: `Interval Cai Putere: ${filters.horsepowerRange[0]} - ${filters.horsepowerRange[1]}`,
          },
        ]
      : []),
    ...(sortCriteria.price
      ? [
          {
            key: 'price',
            value: sortCriteria.price,
            label: `Sortare Preț: ${sortCriteria.price === 'asc' ? 'Crescător' : 'Descrescător'}`,
          },
        ]
      : []),
    ...(sortCriteria.year
      ? [
          {
            key: 'year',
            value: sortCriteria.year,
            label: `Sortare An: ${sortCriteria.year === 'asc' ? 'Vechi la Nou' : 'Nou la Vechi'}`,
          },
        ]
      : []),
    ...(sortCriteria.mileage
      ? [
          {
            key: 'mileage',
            value: sortCriteria.mileage,
            label: `Sortare Kilometraj: ${sortCriteria.mileage === 'asc' ? 'Crescător' : 'Descrescător'}`,
          },
        ]
      : []),
    ...(sortCriteria.date
      ? [
          {
            key: 'date',
            value: sortCriteria.date,
            label: `Sortare Dată: ${sortCriteria.date === 'asc' ? 'Cele Mai Vechi' : 'Cele Mai Noi'}`,
          },
        ]
      : []),
  ];
}
