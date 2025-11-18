import { categoryMapping } from '@/lib/categories';
import type { FilterState, SortCriteria, LocationFilter } from '@/lib/types';

export const defaultActiveTab: keyof typeof categoryMapping = 'vanzare';

export const defaultFilters: FilterState = {
  minEngineCapacity: '',
  maxEngineCapacity: '',
  minHorsepower: '',
  maxHorsepower: '',
  status: '',
  brand: '',
  fuel: [],
  transmission: [],
  bodyType: [],
  color: [],
  priceRange: [0, 1000000],
  yearRange: [1900, 2025], // Updated from [2000, 2025] to include older cars like 1960
  mileageRange: [0, 1000000],
  engineCapacityRange: [0, 5000],
  horsepowerRange: [0, 1000],
};

export const defaultSortCriteria: SortCriteria = {
  price: null,
  year: null,
  mileage: null,
  date: null,
};

export const defaultSearchQuery = '';

export const defaultLocationFilter: LocationFilter = { location: null, radius: 50 };

export const defaultCurrentPage = 1;

export const getInitialActiveTab = (searchParams: URLSearchParams): keyof typeof categoryMapping => {
  const categorieParam = searchParams.get('tip');
  return categorieParam && categorieParam in categoryMapping ? (categorieParam as keyof typeof categoryMapping) : defaultActiveTab;
};

export const getInitialFilters = (searchParams: URLSearchParams): FilterState => {
  const filters = { ...defaultFilters };
  filters.minEngineCapacity = searchParams.get('minEngineCapacity') || defaultFilters.minEngineCapacity;
  filters.maxEngineCapacity = searchParams.get('maxEngineCapacity') || defaultFilters.maxEngineCapacity;
  filters.minHorsepower = searchParams.get('minHorsepower') || defaultFilters.minHorsepower;
  filters.maxHorsepower = searchParams.get('maxHorsepower') || defaultFilters.maxHorsepower;
  filters.status = searchParams.get('status') || defaultFilters.status;
  filters.brand = searchParams.get('brand') || defaultFilters.brand;
  const fuel = searchParams.get('fuel');
  filters.fuel = fuel ? fuel.split(',') : defaultFilters.fuel;
  const transmission = searchParams.get('transmission');
  filters.transmission = transmission ? transmission.split(',') : defaultFilters.transmission;
  const bodyType = searchParams.get('bodyType');
  filters.bodyType = bodyType ? bodyType.split(',') : defaultFilters.bodyType;
  const color = searchParams.get('color');
  filters.color = color ? color.split(',') : defaultFilters.color;
  filters.priceRange = [
    parseInt(searchParams.get('priceMin') || defaultFilters.priceRange[0].toString()),
    parseInt(searchParams.get('priceMax') || defaultFilters.priceRange[1].toString()),
  ];
  filters.yearRange = [
    parseInt(searchParams.get('yearMin') || defaultFilters.yearRange[0].toString()),
    parseInt(searchParams.get('yearMax') || defaultFilters.yearRange[1].toString()),
  ];
  filters.mileageRange = [
    parseInt(searchParams.get('mileageMin') || defaultFilters.mileageRange[0].toString()),
    parseInt(searchParams.get('mileageMax') || defaultFilters.mileageRange[1].toString()),
  ];
  return filters;
};

export const getInitialSortCriteria = (searchParams: URLSearchParams): SortCriteria => {
  const sortCriteria = { ...defaultSortCriteria };
  const price = searchParams.get('price');
  sortCriteria.price = price && price !== '' ? (price as 'asc' | 'desc') : null;
  const year = searchParams.get('year');
  sortCriteria.year = year && year !== '' ? (year as 'asc' | 'desc') : null;
  const mileage = searchParams.get('mileage');
  sortCriteria.mileage = mileage && mileage !== '' ? (mileage as 'asc' | 'desc') : null;
  const date = searchParams.get('date');
  sortCriteria.date = date && date !== '' ? (date as 'asc' | 'desc') : null;
  return sortCriteria;
};

export const getInitialSearchQuery = (searchParams: URLSearchParams) => searchParams.get('searchQuery') || defaultSearchQuery;

export const getInitialLocationFilter = (searchParams: URLSearchParams): LocationFilter => {
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const address = searchParams.get('address');
  const radius = searchParams.get('radius');
  if (lat && lng && address && radius) {
    return {
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address,
        fullAddress: '',
      },
      radius: parseInt(radius),
    };
  }
  return defaultLocationFilter;
};

export const getInitialCurrentPage = (searchParams: URLSearchParams) =>
  parseInt(searchParams.get('currentPage') || defaultCurrentPage.toString());
