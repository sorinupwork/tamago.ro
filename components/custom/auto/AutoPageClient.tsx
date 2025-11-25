'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import AppInput from '@/components/custom/input/AppInput';
import AppSelectInput from '@/components/custom/input/AppSelectInput';
import AppSlider from '@/components/custom/input/AppSlider';
import AppCombobox from '@/components/custom/input/AppCombobox';
import AppPagination from '@/components/custom/pagination/AppPagination';
import AppLocationInput from '@/components/custom/input/AppLocationInput';
import AutoTabs from '@/components/custom/tabs/AutoTabs';
import CarCard from '@/components/custom/auto/CarCard';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { getSellAutoCars, getBuyAutoCars, getRentAutoCars, getAuctionAutoCars } from '@/actions/auto/actions';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { categoryMapping } from '@/lib/categories';
import { getSortedCars } from '@/lib/auto/sorting';
import { getFilteredCars, getAppliedFilters } from '@/lib/auto/filters';
import { paginateArray } from '@/lib/auto/pagination';
import {
  defaultActiveTab,
  defaultFilters,
  defaultSortCriteria,
  defaultSearchQuery,
  defaultLocationFilter,
  defaultCurrentPage,
  getInitialFilters,
  getInitialSortCriteria,
  getInitialSearchQuery,
  getInitialLocationFilter,
} from '@/lib/auto/initializers';
import type { AutoFilterState, SortCriteria, LocationData, LocationFilter, Car, RawCarDoc } from '@/lib/types';

interface AutoPageClientProps {
  initialResult: Promise<{ items: RawCarDoc[]; total: number; hasMore: boolean }>;
  initialPage: number;
  initialTip: string;
}

export default function AutoPageClient({ initialResult, initialPage, initialTip }: AutoPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const result = use(initialResult);
  const initialCars = useMemo(
    () =>
      result.items.map((doc: RawCarDoc) => ({
        id: doc._id.toString(),
        title: doc.title || '',
        price: String(doc.price || '0'),
        currency: doc.currency || 'RON',
        period: doc.period || '',
        startDate: doc.startDate || '',
        endDate: doc.endDate || '',
        year: parseInt(doc.year || '2020') || 2020,
        brand: doc.brand || '',
        category: (initialTip === 'vanzare'
          ? 'sell'
          : initialTip === 'cumparare'
            ? 'buy'
            : initialTip === 'inchiriere'
              ? 'rent'
              : 'auction') as 'sell' | 'buy' | 'rent' | 'auction',
        mileage: parseInt(doc.mileage || '0') || 0,
        fuel: doc.fuel || '',
        transmission: doc.transmission || '',
        location: typeof doc.location === 'string' ? doc.location : doc.location?.address || '',
        images: doc.uploadedFiles && doc.uploadedFiles.length > 0 ? doc.uploadedFiles : ['/placeholder.svg'],
        dateAdded: new Date().toISOString(),
        sellerType: 'private' as const,
        contactPhone: '123456789',
        contactEmail: 'email@example.com',
        bodyType: doc.carType || '',
        color: doc.color || '',
        engineCapacity: doc.engineCapacity ? parseFloat(doc.engineCapacity) : undefined,
        horsepower: doc.horsePower ? parseInt(doc.horsePower) : undefined,
        status: doc.status || 'used',
        description: doc.description,
        features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
        traction: doc.traction || '',
        withDriver: doc.withDriver || false,
        driverName: doc.driverName || '',
        driverContact: doc.driverContact || '',
        driverTelephone: doc.driverTelephone || '',
        options: doc.options || [],
        lat: typeof doc.location === 'object' ? doc.location?.lat : 45.9432,
        lng: typeof doc.location === 'object' ? doc.location?.lng : 24.9668,
        minPrice: doc.minPrice,
        maxPrice: doc.maxPrice,
        userId: doc.userId ? doc.userId.toString() : '',
      })),
    [result, initialTip]
  );
  const [activeTab, setActiveTab] = useState<keyof typeof categoryMapping>(initialTip as keyof typeof categoryMapping);
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AutoFilterState>(getInitialFilters(searchParams));
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(getInitialSortCriteria(searchParams));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery(searchParams));
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(getInitialLocationFilter(searchParams));
  const [resetKey, setResetKey] = useState(0);
  const isMobile = useIsMobile();

  const currentSort = useMemo(() => {
    const key = Object.keys(sortCriteria).find((k) => sortCriteria[k as keyof SortCriteria]);
    if (key) {
      return `${key}_${sortCriteria[key as keyof SortCriteria]}`;
    }
    return '';
  }, [sortCriteria]);

  useEffect(() => {
    result.items.map((doc: RawCarDoc) => ({
      id: doc._id.toString(),
      title: doc.title || '',
      price: String(doc.price || '0'),
      currency: doc.currency || 'RON',
      period: doc.period || '',
      startDate: doc.startDate || '',
      endDate: doc.endDate || '',
      year: parseInt(doc.year || '2020') || 2020,
      brand: doc.brand || '',
      category: initialTip === 'vanzare' ? 'sell' : initialTip === 'cumparare' ? 'buy' : initialTip === 'inchiriere' ? 'rent' : 'auction',
      mileage: parseInt(doc.mileage || '0') || 0,
      fuel: doc.fuel || '',
      transmission: doc.transmission || '',
      location: typeof doc.location === 'string' ? doc.location : doc.location?.address || '',
      images: doc.uploadedFiles && doc.uploadedFiles.length > 0 ? doc.uploadedFiles : ['/placeholder.svg'],
      dateAdded: new Date().toISOString(),
      sellerType: 'private',
      contactPhone: '123456789',
      contactEmail: 'email@example.com',
      bodyType: doc.carType || '',
      color: doc.color || '',
      engineCapacity: doc.engineCapacity ? parseFloat(doc.engineCapacity) : undefined,
      horsepower: doc.horsePower ? parseInt(doc.horsePower) : undefined,
      status: doc.status || 'used',
      description: doc.description,
      features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
      traction: doc.traction || '',
      withDriver: doc.withDriver || false,
      driverName: doc.driverName || '',
      driverContact: doc.driverContact || '',
      driverTelephone: doc.driverTelephone || '',
      options: doc.options || [],
      lat: typeof doc.location === 'object' ? doc.location?.lat : 45.9432,
      lng: typeof doc.location === 'object' ? doc.location?.lng : 24.9668,
      minPrice: doc.minPrice,
      maxPrice: doc.maxPrice,
      userId: doc.userId ? doc.userId.toString() : '',
    }));
  }, [result, initialTip]);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        search: searchQuery,
        status: filters.status || undefined,
        sortBy: Object.keys(sortCriteria).find((key) => sortCriteria[key as keyof SortCriteria])
          ? `${Object.keys(sortCriteria).find((key) => sortCriteria[key as keyof SortCriteria])}_${sortCriteria[Object.keys(sortCriteria).find((key) => sortCriteria[key as keyof SortCriteria]) as keyof SortCriteria]}`
          : undefined,
        brand: filters.brand || undefined,
        fuel: filters.fuel.length > 0 ? filters.fuel : undefined,
        transmission: filters.transmission.length > 0 ? filters.transmission : undefined,
        bodyType: filters.bodyType.length > 0 ? filters.bodyType : undefined,
        priceMin: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        priceMax: filters.priceRange[1] < 1000000 ? filters.priceRange[1] : undefined,
        yearMin: filters.yearRange[0] > 1900 ? filters.yearRange[0] : undefined,
        yearMax: filters.yearRange[1] < 2025 ? filters.yearRange[1] : undefined,
        mileageMin: filters.mileageRange[0] > 0 ? filters.mileageRange[0] : undefined,
        mileageMax: filters.mileageRange[1] < 1000000 ? filters.mileageRange[1] : undefined,
        engineCapacityMin: filters.engineCapacityRange[0] > 0 ? filters.engineCapacityRange[0] : undefined,
        engineCapacityMax: filters.engineCapacityRange[1] < 10 ? filters.engineCapacityRange[1] : undefined,
        horsepowerMin: filters.horsepowerRange[0] > 0 ? filters.horsepowerRange[0] : undefined,
        horsepowerMax: filters.horsepowerRange[1] < 1000 ? filters.horsepowerRange[1] : undefined,
      };
      let result;
      switch (activeTab) {
        case 'vanzare':
          result = await getSellAutoCars(params);
          break;
        case 'cumparare':
          result = await getBuyAutoCars(params);
          break;
        case 'inchiriere':
          result = await getRentAutoCars(params);
          break;
        case 'licitatie':
          result = await getAuctionAutoCars(params);
          break;
        default:
          result = { items: [], total: 0, hasMore: false };
          break;
      }
      const mappedCars: Car[] = result.items.map((doc: RawCarDoc) => ({
        id: doc._id.toString(),
        title: doc.title || '',
        price: String(doc.price || '0'),
        currency: doc.currency || 'RON',
        period: doc.period || '',
        startDate: doc.startDate || '',
        endDate: doc.endDate || '',
        year: parseInt(doc.year || '2020') || 2020,
        brand: doc.brand || '',
        category: (activeTab === 'vanzare'
          ? 'sell'
          : activeTab === 'cumparare'
            ? 'buy'
            : activeTab === 'inchiriere'
              ? 'rent'
              : 'auction') as 'sell' | 'buy' | 'rent' | 'auction',
        mileage: parseInt(doc.mileage || '0') || 0,
        fuel: doc.fuel || '',
        transmission: doc.transmission || '',
        location: typeof doc.location === 'string' ? doc.location : doc.location?.address || '',
        images: doc.uploadedFiles && doc.uploadedFiles.length > 0 ? doc.uploadedFiles : ['/placeholder.svg'],
        dateAdded: new Date().toISOString(),
        sellerType: 'private' as const,
        contactPhone: '123456789',
        contactEmail: 'email@example.com',
        bodyType: doc.carType || '',
        color: doc.color || '',
        engineCapacity: doc.engineCapacity ? parseFloat(doc.engineCapacity) : undefined,
        horsepower: doc.horsePower ? parseInt(doc.horsePower) : undefined,
        status: doc.status || 'used',
        description: doc.description,
        features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
        traction: doc.traction || '',
        withDriver: doc.withDriver || false,
        driverName: doc.driverName || '',
        driverContact: doc.driverContact || '',
        driverTelephone: doc.driverTelephone || '',
        options: doc.options || [],
        lat: typeof doc.location === 'object' ? doc.location?.lat : 45.9432,
        lng: typeof doc.location === 'object' ? doc.location?.lng : 24.9668,
        minPrice: doc.minPrice,
        maxPrice: doc.maxPrice,
        userId: doc.userId ? doc.userId.toString() : '',
      }));
      setCars(mappedCars);
      setLoading(false);
    };
    fetchCars();
  }, [activeTab, searchQuery, filters, sortCriteria]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== defaultActiveTab) params.set('tip', activeTab);

    Object.keys(filters).forEach((key) => {
      const k = key as keyof AutoFilterState;
      if (JSON.stringify(filters[k]) !== JSON.stringify(defaultFilters[k])) {
        if (k === 'priceRange') {
          params.set('pretMin', filters.priceRange[0].toString());
          params.set('pretMax', filters.priceRange[1].toString());
        } else if (k === 'yearRange') {
          params.set('anMin', filters.yearRange[0].toString());
          params.set('anMax', filters.yearRange[1].toString());
        } else if (k === 'mileageRange') {
          params.set('kilometrajMin', filters.mileageRange[0].toString());
          params.set('kilometrajMax', filters.mileageRange[1].toString());
        } else if (k === 'engineCapacityRange') {
          params.set('capacitateMin', filters.engineCapacityRange[0].toString());
          params.set('capacitateMax', filters.engineCapacityRange[1].toString());
        } else if (k === 'horsepowerRange') {
          params.set('caiPutereMin', filters.horsepowerRange[0].toString());
          params.set('caiPutereMax', filters.horsepowerRange[1].toString());
        } else if (Array.isArray(filters[k])) {
          if ((filters[k] as string[]).length > 0) params.set(k, (filters[k] as string[]).join(','));
        } else {
          params.set(k, filters[k] as string);
        }
      }
    });

    Object.keys(sortCriteria).forEach((key) => {
      const k = key as keyof SortCriteria;
      if (sortCriteria[k] !== defaultSortCriteria[k]) {
        params.set(
          k === 'price' ? 'pret' : k === 'year' ? 'an' : k === 'mileage' ? 'kilometraj' : k === 'date' ? 'data' : k,
          sortCriteria[k] || ''
        );
      }
    });

    if (searchQuery !== defaultSearchQuery) params.set('cautare', searchQuery);
    if (locationFilter.location) {
      params.set('lat', locationFilter.location.lat.toString());
      params.set('lng', locationFilter.location.lng.toString());
      params.set('raza', locationFilter.radius.toString());
      params.set('adresa', locationFilter.location.address);
    }
    if (currentPage !== defaultCurrentPage) params.set('pagina', currentPage.toString());
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl || window.location.pathname, { scroll: false });
  }, [activeTab, filters, sortCriteria, searchQuery, locationFilter, currentPage, router]);

  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(cars.map((car) => car.brand))];
    return brands.map((brand) => ({ value: brand, label: brand }));
  }, [cars]);

  const filteredCars = useMemo(() => {
    const filtered = getFilteredCars(cars, filters, searchQuery, activeTab, categoryMapping, locationFilter);
    return getSortedCars(filtered, sortCriteria);
  }, [cars, filters, sortCriteria, searchQuery, activeTab, locationFilter]);

  const { totalPages, paginatedItems } = paginateArray(filteredCars, currentPage);

  const cardsPerPage = Math.min(Math.max(paginatedItems.length, 1), 3);

  const handleFilterChange = (key: keyof AutoFilterState, value: string | number[] | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }) as AutoFilterState);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (location: LocationData | null, radius: number) => {
    setLocationFilter({ location, radius });
    setCurrentPage(1);
  };

  const removeFilter = (key: string, value: string) => {
    if (key === 'searchQuery') {
      setSearchQuery(defaultSearchQuery);
      setCurrentPage(1);
    } else if (key === 'location') {
      setLocationFilter(defaultLocationFilter);
      setResetKey((prev) => prev + 1);
      setCurrentPage(1);
    } else if (key === 'priceRange') {
      setFilters((prev) => ({ ...prev, priceRange: defaultFilters.priceRange }));
      setCurrentPage(1);
    } else if (key === 'yearRange') {
      setFilters((prev) => ({ ...prev, yearRange: defaultFilters.yearRange }));
      setCurrentPage(1);
    } else if (key === 'mileageRange') {
      setFilters((prev) => ({ ...prev, mileageRange: defaultFilters.mileageRange }));
      setCurrentPage(1);
    } else if (key === 'engineCapacityRange') {
      setFilters((prev) => ({ ...prev, engineCapacityRange: defaultFilters.engineCapacityRange }));
      setCurrentPage(1);
    } else if (key === 'horsepowerRange') {
      setFilters((prev) => ({ ...prev, horsepowerRange: defaultFilters.horsepowerRange }));
      setCurrentPage(1);
    } else if (key === 'price' || key === 'year' || key === 'mileage') {
      setSortCriteria((prev) => ({ ...prev, [key]: null }));
      setCurrentPage(1);
    } else if (key in filters && Array.isArray((filters as Record<string, unknown>)[key])) {
      setFilters(
        (prev) =>
          ({
            ...prev,
            [key]: ((prev as Record<string, unknown>)[key] as string[]).filter((item) => item !== value),
          }) as AutoFilterState
      );
      setCurrentPage(1);
    } else {
      setFilters((prev) => ({ ...prev, [key]: '' }));
      setCurrentPage(1);
    }
  };

  const resetAllFilters = () => {
    setFilters(defaultFilters);
    setSortCriteria(defaultSortCriteria);
    setSearchQuery(defaultSearchQuery);
    setLocationFilter(defaultLocationFilter);
    setCurrentPage(defaultCurrentPage);
    setResetKey((prev) => prev + 1);
    router.replace(window.location.pathname);
  };

  const saveSearch = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiat în clipboard!', {
        description: window.location.href,
      });
    } catch {
      toast.error('Eroare la copierea link-ului.');
    }
  };

  const appliedFilters = getAppliedFilters(filters, sortCriteria, searchQuery, locationFilter).filter((filter) => {
    if (filter.key === 'priceRange') return JSON.stringify(filters.priceRange) !== JSON.stringify(defaultFilters.priceRange);
    if (filter.key === 'yearRange') return JSON.stringify(filters.yearRange) !== JSON.stringify(defaultFilters.yearRange);
    if (filter.key === 'mileageRange') return JSON.stringify(filters.mileageRange) !== JSON.stringify(defaultFilters.mileageRange);
    if (filter.key === 'engineCapacityRange')
      return JSON.stringify(filters.engineCapacityRange) !== JSON.stringify(defaultFilters.engineCapacityRange);
    if (filter.key === 'horsepowerRange') return JSON.stringify(filters.horsepowerRange) !== JSON.stringify(defaultFilters.horsepowerRange);
    if (filter.key === 'location') return JSON.stringify(locationFilter) !== JSON.stringify(defaultLocationFilter);
    if (filter.key === 'searchQuery') return searchQuery !== defaultSearchQuery;
    if (filter.key in sortCriteria)
      return sortCriteria[filter.key as keyof SortCriteria] !== defaultSortCriteria[filter.key as keyof SortCriteria];
    return true;
  });

  return (
    <div className='container mx-auto max-w-7xl p-2'>
      <div className='overflow-x-hidden'>
        <Breadcrumbs
          items={[{ label: 'Acasă', href: '/' }, { label: 'Categorii', href: '/categorii' }, { label: 'Auto' }]}
          className='wrap-break-word mb-4'
        />
      </div>

      <div className='flex flex-wrap gap-2 mb-4 justify-center md:justify-start'>
        <AutoTabs
          activeTab={activeTab}
          onChange={(t) => {
            setActiveTab(t);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className='mb-4 flex flex-col sm:flex-row gap-2 justify-center md:justify-start'>
        <AppInput
          placeholder='Caută mașini (marcă, model...)'
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='flex-1'
          leftIcon={Search}
        />
        <AppLocationInput
          key={resetKey}
          location={locationFilter.location}
          onChange={handleLocationChange}
          placeholder='Locație'
          className='flex-1'
          filteredCars={filteredCars}
          leftIcon={MapPin}
        />
        <Button variant='default'>Caută</Button>
      </div>

      <div className='mb-4 flex justify-center md:justify-start gap-4'>
        <AppSlider
          label='Preț'
          min={0}
          max={1000000}
          step={1000}
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value)}
          currency='RON'
        />
        <AppSlider
          label='An'
          min={1900}
          max={2025}
          step={1}
          value={filters.yearRange}
          onValueChange={(value) => handleFilterChange('yearRange', value)}
        />
        <AppSlider
          label='Kilometraj'
          min={0}
          max={1000000}
          step={1000}
          value={filters.mileageRange}
          onValueChange={(value) => handleFilterChange('mileageRange', value)}
          currency='km'
        />
        <AppSlider
          label='Capacitate Motor'
          min={0}
          max={10}
          step={0.1}
          value={filters.engineCapacityRange}
          onValueChange={(value) => handleFilterChange('engineCapacityRange', value)}
          currency='L'
        />
        <AppSlider
          label='Cai Putere'
          min={0}
          max={1000}
          step={10}
          value={filters.horsepowerRange}
          onValueChange={(value) => handleFilterChange('horsepowerRange', value)}
          currency='CP'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4'>
        <AppSelectInput
          options={[
            { value: 'all', label: 'Status' },
            { value: 'nou', label: 'Nou' },
            { value: 'folosit', label: 'Second Hand' },
            { value: 'deteriorat', label: 'Deteriorat' },
          ]}
          value={filters.status || 'all'}
          onValueChange={(value) => handleFilterChange('status', (value as string) === 'all' ? '' : (value as string))}
          multiple={false}
          placeholder='Status'
        />
        <AppCombobox
          options={uniqueBrands}
          value={filters.brand}
          onValueChange={(value) => handleFilterChange('brand', value)}
          placeholder='Marcă'
        />
        <AppSelectInput
          options={[
            { value: 'Petrol', label: 'Benzină' },
            { value: 'Diesel', label: 'Motorină' },
            { value: 'Hybrid', label: 'Hibrid' },
            { value: 'Electric', label: 'Electric' },
          ]}
          value={filters.fuel}
          onValueChange={(value) => handleFilterChange('fuel', value as string[])}
          multiple={true}
          placeholder='Tip Combustibil'
        />
        <AppSelectInput
          options={[
            { value: 'Manual', label: 'Manuală' },
            { value: 'Automatic', label: 'Automată' },
          ]}
          value={filters.transmission}
          onValueChange={(value) => handleFilterChange('transmission', value as string[])}
          multiple={true}
          placeholder='Transmisie'
        />
        <AppSelectInput
          options={[
            { value: 'SUV', label: 'SUV' },
            { value: 'Sedan', label: 'Sedan' },
            { value: 'Hatchback', label: 'Hatchback' },
            { value: 'Coupe', label: 'Coupe' },
          ]}
          value={filters.bodyType}
          onValueChange={(value) => handleFilterChange('bodyType', value as string[])}
          multiple={true}
          placeholder='Tip Caroserie'
        />
      </div>

      <div className='mb-4 flex justify-center md:justify-start'>
        <Select
          value={currentSort}
          onValueChange={(value) => {
            const [key, order] = value.split('_');
            setSortCriteria((prev) => {
              const newCriteria = { ...prev };
              Object.keys(newCriteria).forEach((k) => (newCriteria[k as keyof SortCriteria] = null));
              newCriteria[key as keyof SortCriteria] = order as 'asc' | 'desc';
              return newCriteria;
            });
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Sortează după' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='price_asc'>Preț crescător</SelectItem>
            <SelectItem value='price_desc'>Preț descrescător</SelectItem>
            <SelectItem value='year_asc'>An crescător</SelectItem>
            <SelectItem value='year_desc'>An descrescător</SelectItem>
            <SelectItem value='mileage_asc'>Kilometraj crescător</SelectItem>
            <SelectItem value='mileage_desc'>Kilometraj descrescător</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mb-4 flex flex-wrap gap-2 min-h-8'>
        {appliedFilters.map((filter, index) => (
          <Button
            key={index}
            variant='outline'
            size='sm'
            onClick={() => removeFilter(filter.key, filter.value)}
            className='flex items-center gap-1'
          >
            {filter.label}
            <X className='h-3 w-3' />
          </Button>
        ))}
        {appliedFilters.length > 0 && (
          <>
            <Button variant='destructive' size='sm' onClick={resetAllFilters}>
              Resetează toate
            </Button>
            <Button variant='secondary' size='sm' onClick={saveSearch}>
              Salvează căutarea
            </Button>
          </>
        )}
      </div>

      <div
        className={cn(
          'grid gap-6 w-full',
          isMobile
            ? 'grid-cols-1'
            : paginatedItems.length === 1
              ? 'grid-cols-1'
              : paginatedItems.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
        )}
      >
        {loading ? (
          <SkeletonLoading variant='auto' className='col-span-full' />
        ) : (
          paginatedItems.map((car) => <CarCard key={car.id} car={car} cardsPerPage={cardsPerPage} />)
        )}
      </div>

      <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className='mt-8' />
    </div>
  );
}
