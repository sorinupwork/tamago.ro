import { calculateDistance } from '@/lib/services';
import type { Car, FilterState, SortCriteria, LocationFilter } from '@/lib/types';
import { defaultFilters } from './initializers';

export function getFilteredCars(
  cars: Car[],
  filters: FilterState,
  searchQuery: string,
  activeTab: string,
  categoryMapping: Record<string, string>,
  locationFilter: LocationFilter
): Car[] {
  let filtered = cars.slice();

  const minEC = filters.minEngineCapacity ? parseInt(filters.minEngineCapacity) : filters.engineCapacityRange[0];
  const maxEC = filters.maxEngineCapacity ? parseInt(filters.maxEngineCapacity) : filters.engineCapacityRange[1];
  const minHP = filters.minHorsepower ? parseInt(filters.minHorsepower) : filters.horsepowerRange[0];
  const maxHP = filters.maxHorsepower ? parseInt(filters.maxHorsepower) : filters.horsepowerRange[1];

  filtered = filtered.filter((car) => (car.engineCapacity || 0) >= minEC && (car.engineCapacity || 0) <= maxEC);
  filtered = filtered.filter((car) => (car.horsepower || 0) >= minHP && (car.horsepower || 0) <= maxHP);
  if (filters.status) filtered = filtered.filter((car) => car.status === filters.status);
  filtered = filtered.filter((car) => car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]);
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
    filtered = filtered.filter((car) => {
      if (car.lat && car.lng) {
        const distance = calculateDistance(loc.lat, loc.lng, car.lat, car.lng);
        return distance <= locationFilter.radius;
      }
      return true;
    });
  }

  return filtered;
}

// build applied filters badges data
export function getAppliedFilters(
  filters: FilterState,
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
    ...(filters.minEngineCapacity || filters.maxEngineCapacity
      ? [
          {
            key: 'engineCapacity',
            value: `${filters.minEngineCapacity}-${filters.maxEngineCapacity}`,
            label: `Capacitate: ${filters.minEngineCapacity || filters.engineCapacityRange[0]}-${
              filters.maxEngineCapacity || filters.engineCapacityRange[1]
            }`,
          },
        ]
      : []),
    ...(filters.minHorsepower || filters.maxHorsepower
      ? [
          {
            key: 'horsepower',
            value: `${filters.minHorsepower}-${filters.maxHorsepower}`,
            label: `Cai Putere: ${filters.minHorsepower || filters.horsepowerRange[0]}-${
              filters.maxHorsepower || filters.horsepowerRange[1]
            }`,
          },
        ]
      : []),
    ...(filters.status ? [{ key: 'status', value: filters.status, label: `Status: ${filters.status}` }] : []),
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
    ...(sortCriteria.price
      ? [
          {
            key: 'sortPrice',
            value: sortCriteria.price,
            label: `Sortare Preț: ${sortCriteria.price === 'asc' ? 'Crescător' : 'Descrescător'}`,
          },
        ]
      : []),
    ...(sortCriteria.year
      ? [
          {
            key: 'sortYear',
            value: sortCriteria.year,
            label: `Sortare An: ${sortCriteria.year === 'asc' ? 'Vechi la Nou' : 'Nou la Vechi'}`,
          },
        ]
      : []),
    ...(sortCriteria.mileage
      ? [
          {
            key: 'sortMileage',
            value: sortCriteria.mileage,
            label: `Sortare Kilometraj: ${sortCriteria.mileage === 'asc' ? 'Crescător' : 'Descrescător'}`,
          },
        ]
      : []),
    ...(sortCriteria.date
      ? [
          {
            key: 'sortDate',
            value: sortCriteria.date,
            label: `Sortare Dată: ${sortCriteria.date === 'asc' ? 'Cele Mai Vechi' : 'Cele Mai Noi'}`,
          },
        ]
      : []),
  ];
}
