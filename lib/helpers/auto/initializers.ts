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
  priceRange: [0, 100000],
  yearRange: [2000, 2023],
  mileageRange: [0, 300000],
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
  const filtersParam = searchParams.get('filters');
  const nonDefault = filtersParam ? JSON.parse(filtersParam) : {};
  return { ...defaultFilters, ...nonDefault };
};

export const getInitialSortCriteria = (searchParams: URLSearchParams): SortCriteria => {
  const sortParam = searchParams.get('sortCriteria');
  const nonDefault = sortParam ? JSON.parse(sortParam) : {};
  return { ...defaultSortCriteria, ...nonDefault };
};

export const getInitialSearchQuery = (searchParams: URLSearchParams) =>
  searchParams.get('searchQuery') || defaultSearchQuery;

export const getInitialLocationFilter = (searchParams: URLSearchParams): LocationFilter => {
  const locationParam = searchParams.get('locationFilter');
  const nonDefault = locationParam ? JSON.parse(locationParam) : {};
  return { ...defaultLocationFilter, ...nonDefault };
};

export const getInitialCurrentPage = (searchParams: URLSearchParams) =>
  parseInt(searchParams.get('currentPage') || defaultCurrentPage.toString());
