import { categoryMapping } from '@/lib/categories';
import type { AutoFilterState, SortCriteria, LocationFilter } from '@/lib/types';

export const defaultActiveTab: keyof typeof categoryMapping = 'oferta';

export const defaultFilters: AutoFilterState = {
  status: '',
  brand: '',
  model: '',
  fuel: [],
  transmission: [],
  bodyType: [],
  color: [],
  traction: [],
  steeringWheelPosition: '',
  priceCurrency: 'EUR',
  priceRange: [0, 1000000],
  yearRange: [1900, 2025],
  mileageRange: [0, 1000000],
  engineCapacityRange: [0, 10],
  horsepowerRange: [0, 10000],
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

export const statusMap = { nou: 'new', folosit: 'used', deteriorat: 'damaged' } as const;

export const getInitialActiveTab = (searchParams: URLSearchParams): keyof typeof categoryMapping => {
  const categorieParam = searchParams.get('tip');
  return categorieParam && categorieParam in categoryMapping ? (categorieParam as keyof typeof categoryMapping) : defaultActiveTab;
};

export const getInitialFilters = (searchParams: URLSearchParams): AutoFilterState => {
  const filters = { ...defaultFilters };
  const stare = searchParams.get('stare');
  filters.status = (stare && statusMap[stare as keyof typeof statusMap]) || stare || defaultFilters.status;
  filters.brand = searchParams.get('marca') || defaultFilters.brand;
  filters.model = searchParams.get('model') || defaultFilters.model;
  filters.fuel = searchParams.getAll('combustibil');
  filters.transmission = searchParams.getAll('transmisie');
  filters.bodyType = searchParams.getAll('caroserie');
  filters.color = searchParams.getAll('culoare');
  filters.traction = searchParams.getAll('tractiune');
  filters.steeringWheelPosition = searchParams.get('volan') || defaultFilters.steeringWheelPosition;
  filters.priceCurrency = searchParams.get('moneda') || defaultFilters.priceCurrency;
  filters.priceRange = [
    parseInt(searchParams.get('pretMin') || defaultFilters.priceRange[0].toString()),
    parseInt(searchParams.get('pretMax') || defaultFilters.priceRange[1].toString()),
  ];
  filters.yearRange = [
    parseInt(searchParams.get('anMin') || defaultFilters.yearRange[0].toString()),
    parseInt(searchParams.get('anMax') || defaultFilters.yearRange[1].toString()),
  ];
  filters.mileageRange = [
    parseInt(searchParams.get('kilometrajMin') || defaultFilters.mileageRange[0].toString()),
    parseInt(searchParams.get('kilometrajMax') || defaultFilters.mileageRange[1].toString()),
  ];
  filters.engineCapacityRange = [
    parseInt(searchParams.get('capacitateMotorMin') || defaultFilters.engineCapacityRange[0].toString()),
    parseInt(searchParams.get('capacitateMotorMax') || defaultFilters.engineCapacityRange[1].toString()),
  ];
  filters.horsepowerRange = [
    parseInt(searchParams.get('caiPutereMin') || defaultFilters.horsepowerRange[0].toString()),
    parseInt(searchParams.get('caiPutereMax') || defaultFilters.horsepowerRange[1].toString()),
  ];
  return filters;
};

export const getInitialSortCriteria = (searchParams: URLSearchParams): SortCriteria => {
  const sortCriteria = { ...defaultSortCriteria };
  const pret = searchParams.get('pret');
  sortCriteria.price = pret && pret !== '' ? (pret as 'asc' | 'desc') : null;
  const an = searchParams.get('an');
  sortCriteria.year = an && an !== '' ? (an as 'asc' | 'desc') : null;
  const kilometraj = searchParams.get('kilometraj');
  sortCriteria.mileage = kilometraj && kilometraj !== '' ? (kilometraj as 'asc' | 'desc') : null;
  const data = searchParams.get('data');
  sortCriteria.date = data && data !== '' ? (data as 'asc' | 'desc') : null;
  return sortCriteria;
};

export const getInitialSearchQuery = (searchParams: URLSearchParams) => searchParams.get('cautare') || defaultSearchQuery;

export const getInitialLocationFilter = (searchParams: URLSearchParams): LocationFilter => {
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const raza = searchParams.get('raza');
  if (lat && lng && raza) {
    return {
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: '',
      },
      radius: parseInt(raza),
    };
  }
  return defaultLocationFilter;
};

export const getInitialCurrentPage = (searchParams: URLSearchParams) =>
  parseInt(searchParams.get('pagina') || defaultCurrentPage.toString());
