'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import { calcTotalPages, paginateArray } from '@/lib/auto/pagination';
import {
  defaultActiveTab,
  defaultFilters,
  defaultSortCriteria,
  defaultSearchQuery,
  defaultLocationFilter,
  defaultCurrentPage,
  getInitialActiveTab,
  getInitialFilters,
  getInitialSortCriteria,
  getInitialSearchQuery,
  getInitialLocationFilter,
  getInitialCurrentPage,
} from '@/lib/auto/initializers';
import type { AutoFilterState, SortCriteria, LocationData, LocationFilter, Car, RawCarDoc } from '@/lib/types';

export default function AutoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<keyof typeof categoryMapping>(getInitialActiveTab(searchParams));
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AutoFilterState>(getInitialFilters(searchParams));
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(getInitialSortCriteria(searchParams));
  const [currentPage, setCurrentPage] = useState(getInitialCurrentPage(searchParams));
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery(searchParams));
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(getInitialLocationFilter(searchParams));
  const [resetKey, setResetKey] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      let carsData: RawCarDoc[];
      switch (activeTab) {
        case 'vanzare':
          carsData = await getSellAutoCars();
          break;
        case 'cumparare':
          carsData = await getBuyAutoCars();
          break;
        case 'inchiriere':
          carsData = await getRentAutoCars();
          break;
        case 'licitatie':
          carsData = await getAuctionAutoCars();
          break;
        default:
          carsData = [];
          break;
      }

      const mappedCars: Car[] = carsData.map((doc: RawCarDoc) => ({
        id: doc._id.toString(),
        title: doc.title || '',
        price: String(doc.price || '0'),
        currency: doc.currency || 'RON',
        period: doc.period || '',
        startDate: doc.startDate || '',
        endDate: doc.endDate || '',
        year: parseInt(doc.year || '2020') || 2020,
        brand: doc.brand || '',
        category: activeTab === 'vanzare' ? 'sell' : activeTab === 'cumparare' ? 'buy' : activeTab === 'inchiriere' ? 'rent' : 'auction',
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
        status: doc.status === 'new' ? 'nou' : doc.status === 'used' ? 'folosit' : doc.status === 'damaged' ? 'deteriorat' : 'folosit',
        description: doc.description,
        features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
        traction: doc.traction || '',
        history: doc.history || [],
        withDriver: doc.withDriver || false,
        driverName: doc.driverName || '',
        driverContact: doc.driverContact || '',
        driverTelephone: doc.driverTelephone || '',
        options: doc.options || [],
        lat: typeof doc.location === 'object' && doc.location?.lat ? doc.location.lat : 44.4268, // Default to Bucharest
        lng: typeof doc.location === 'object' && doc.location?.lng ? doc.location.lng : 26.1025, // Default to Bucharest
        minPrice: doc.minPrice,
        maxPrice: doc.maxPrice,
        userId: doc.userId ? doc.userId.toString() : '',
      }));
      setCars(mappedCars);
      setLoading(false);
    };
    fetchCars();
  }, [activeTab]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== defaultActiveTab) params.set('tip', activeTab);

    Object.keys(filters).forEach((key) => {
      const k = key as keyof AutoFilterState;
      if (JSON.stringify(filters[k]) !== JSON.stringify(defaultFilters[k])) {
        if (k === 'priceRange') {
          params.set('pretMin', filters[k][0].toString());
          params.set('pretMax', filters[k][1].toString());
        } else if (k === 'yearRange') {
          params.set('anMin', filters[k][0].toString());
          params.set('anMax', filters[k][1].toString());
        } else if (k === 'mileageRange') {
          params.set('kilometrajMin', filters[k][0].toString());
          params.set('kilometrajMax', filters[k][1].toString());
        } else if (k === 'engineCapacityRange') {
          params.set('capacitateMotorMin', filters[k][0].toString());
          params.set('capacitateMotorMax', filters[k][1].toString());
        } else if (k === 'horsepowerRange') {
          params.set('caiPutereMin', filters[k][0].toString());
          params.set('caiPutereMax', filters[k][1].toString());
        } else if (Array.isArray(filters[k])) {
          (filters[k] as string[]).forEach((val) =>
            params.append(
              k === 'fuel'
                ? 'combustibil'
                : k === 'transmission'
                  ? 'transmisie'
                  : k === 'bodyType'
                    ? 'caroserie'
                    : k === 'color'
                      ? 'culoare'
                      : k,
              val
            )
          );
        } else {
          params.set(k === 'brand' ? 'marca' : k === 'status' ? 'stare' : k, filters[k].toString());
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

  const computeNewTotalPages = (nextFilters: AutoFilterState, nextSort: SortCriteria, nextSearch: string, nextLocation: LocationFilter) => {
    const filtered = getFilteredCars(cars, nextFilters, nextSearch, activeTab, categoryMapping, nextLocation);
    const sorted = getSortedCars(filtered, nextSort);
    return calcTotalPages(sorted.length);
  };

  const { totalPages, paginatedItems } = paginateArray(filteredCars, currentPage);

  const cardsPerPage = Math.min(Math.max(paginatedItems.length, 1), 3);

  const handleFilterChange = (key: keyof AutoFilterState, value: string | number[] | string[]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value } as AutoFilterState;
      const newTotal = computeNewTotalPages(next, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
      return next;
    });
  };

  const handleMultiFilterChange = (key: keyof AutoFilterState, value: string, checked: boolean) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        [key]: checked ? [...(prev[key] as string[]), value] : (prev[key] as string[]).filter((item) => item !== value),
      } as AutoFilterState;
      const newTotal = computeNewTotalPages(next, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
      return next;
    });
  };

  const handleSearchChange = (value: string) => {
    const next = value;
    const newTotal = computeNewTotalPages(filters, sortCriteria, next, locationFilter);
    setCurrentPage((cur) => Math.min(cur, newTotal));
    setSearchQuery(next);
  };

  const handleSortChange = (key: keyof SortCriteria, val: 'asc' | 'desc' | null) => {
    setSortCriteria((prev: typeof sortCriteria) => {
      const next = { ...prev, [key]: val } as SortCriteria;
      const newTotal = computeNewTotalPages(filters, next, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
      return next;
    });
  };

  const handleLocationChange = (location: LocationData | null, radius: number) => {
    const next = { location, radius } as LocationFilter;
    const newTotal = computeNewTotalPages(filters, sortCriteria, searchQuery, next);
    setCurrentPage((cur) => Math.min(cur, newTotal));
    setLocationFilter(next);
  };

  const removeFilter = (key: keyof AutoFilterState | 'location' | 'searchQuery' | keyof SortCriteria, value: string) => {
    if (key === 'searchQuery') {
      setSearchQuery(defaultSearchQuery);
      const newTotal = computeNewTotalPages(filters, sortCriteria, defaultSearchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'location') {
      const next = defaultLocationFilter;
      const newTotal = computeNewTotalPages(filters, sortCriteria, searchQuery, next);
      setCurrentPage((cur) => Math.min(cur, newTotal));
      setLocationFilter(next);
      setResetKey((prev) => prev + 1);
    } else if (key === 'priceRange') {
      setFilters((prev) => ({ ...prev, priceRange: defaultFilters.priceRange }));
      const newTotal = computeNewTotalPages(
        { ...filters, priceRange: defaultFilters.priceRange },
        sortCriteria,
        searchQuery,
        locationFilter
      );
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'yearRange') {
      setFilters((prev) => ({ ...prev, yearRange: defaultFilters.yearRange }));
      const newTotal = computeNewTotalPages({ ...filters, yearRange: defaultFilters.yearRange }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'mileageRange') {
      setFilters((prev) => ({ ...prev, mileageRange: defaultFilters.mileageRange }));
      const newTotal = computeNewTotalPages(
        { ...filters, mileageRange: defaultFilters.mileageRange },
        sortCriteria,
        searchQuery,
        locationFilter
      );
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'engineCapacityRange') {
      setFilters((prev) => ({ ...prev, engineCapacityRange: defaultFilters.engineCapacityRange }));
      const newTotal = computeNewTotalPages(
        { ...filters, engineCapacityRange: defaultFilters.engineCapacityRange },
        sortCriteria,
        searchQuery,
        locationFilter
      );
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'horsepowerRange') {
      setFilters((prev) => ({ ...prev, horsepowerRange: defaultFilters.horsepowerRange }));
      const newTotal = computeNewTotalPages(
        { ...filters, horsepowerRange: defaultFilters.horsepowerRange },
        sortCriteria,
        searchQuery,
        locationFilter
      );
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key in sortCriteria) {
      handleSortChange(key as keyof SortCriteria, null);
    } else if (Array.isArray(filters[key as keyof AutoFilterState])) {
      handleMultiFilterChange(key as keyof AutoFilterState, value, false);
    } else {
      setFilters((prev) => {
        const next = { ...prev, [key as keyof AutoFilterState]: '' } as AutoFilterState;
        const newTotal = computeNewTotalPages(next, sortCriteria, searchQuery, locationFilter);
        setCurrentPage((cur) => Math.min(cur, newTotal));
        return next;
      });
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
        <AutoTabs activeTab={activeTab} onChange={(t) => setActiveTab(t)} />
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

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4'>
        <div className=' col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <AppSlider
            label={`Interval Preț`}
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            min={0}
            max={1000000}
            step={1000}
            className='grow'
          />
          <AppSlider
            label={`Interval An`}
            value={filters.yearRange}
            onValueChange={(value) => handleFilterChange('yearRange', value)}
            min={1900}
            max={2025}
            step={1}
            className='grow'
          />
          <AppSlider
            label={`Interval Kilometraj`}
            value={filters.mileageRange}
            onValueChange={(value) => handleFilterChange('mileageRange', value)}
            min={0}
            max={1000000}
            step={5000}
            className='grow'
          />
          <AppSlider
            label={`Interval Capacitate Motor (cc)`}
            value={filters.engineCapacityRange}
            onValueChange={(value) => handleFilterChange('engineCapacityRange', value)}
            min={0}
            max={10000}
            step={100}
            className='grow'
          />
          <AppSlider
            label={`Interval Cai Putere`}
            value={filters.horsepowerRange}
            onValueChange={(value) => handleFilterChange('horsepowerRange', value)}
            min={0}
            max={10000}
            step={10}
            className='grow'
          />
        </div>

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
      </div>

      <div className='mb-4 flex justify-center md:justify-start'>
        <div className='flex grow flex-col sm:flex-row sm:flex-wrap gap-2'>
          <AppSelectInput
            options={[
              { value: 'none', label: 'Sortează după preț' },
              { value: 'asc', label: 'Preț: Crescător' },
              { value: 'desc', label: 'Preț: Descrescător' },
            ]}
            value={sortCriteria.price || 'none'}
            onValueChange={(value) => handleSortChange('price', (value as string) === 'none' ? null : (value as string as 'asc' | 'desc'))}
            multiple={false}
            placeholder='Sortează după preț'
            className='flex-1'
          />
          <AppSelectInput
            options={[
              { value: 'none', label: 'Sortează după an' },
              { value: 'asc', label: 'An: Vechi la Nou' },
              { value: 'desc', label: 'An: Nou la Vechi' },
            ]}
            value={sortCriteria.year || 'none'}
            onValueChange={(value) => handleSortChange('year', (value as string) === 'none' ? null : (value as string as 'asc' | 'desc'))}
            multiple={false}
            placeholder='Sortează după an'
            className='flex-1'
          />
          <AppSelectInput
            options={[
              { value: 'none', label: 'Sortează după kilometraj' },
              { value: 'asc', label: 'Kilometraj: Crescător' },
              { value: 'desc', label: 'Kilometraj: Descrescător' },
            ]}
            value={sortCriteria.mileage || 'none'}
            onValueChange={(value) =>
              handleSortChange('mileage', (value as string) === 'none' ? null : (value as string as 'asc' | 'desc'))
            }
            multiple={false}
            placeholder='Sortează după kilometraj'
            className='flex-1'
          />
          <AppSelectInput
            options={[
              { value: 'none', label: 'Sortează după dată' },
              { value: 'desc', label: 'Cele Mai Noi' },
              { value: 'asc', label: 'Cele Mai Vechi' },
            ]}
            value={sortCriteria.date || 'none'}
            onValueChange={(value) => handleSortChange('date', (value as string) === 'none' ? null : (value as string as 'asc' | 'desc'))}
            multiple={false}
            placeholder='Sortează după dată'
            className='flex-1'
          />
        </div>
      </div>

      <div className='mb-4 flex flex-wrap gap-2 min-h-8'>
        {appliedFilters.length > 0 && (
          <>
            {appliedFilters.map((filter) => (
              <Button
                key={`${filter.key}-${filter.value}`}
                variant='secondary'
                size='sm'
                onClick={() => removeFilter(filter.key as keyof typeof filters | 'location', filter.value)}
              >
                {filter.label} ×
              </Button>
            ))}
            <Button variant='outline' size='sm' onClick={resetAllFilters}>
              Reset All
            </Button>
            <Button variant='default' size='sm' onClick={saveSearch}>
              Save Search
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
          <SkeletonLoading variant='auto' className='w-full col-span-full' />
        ) : (
          paginatedItems.map((car) => <CarCard key={car.id} car={car} cardsPerPage={cardsPerPage} />)
        )}
      </div>

      <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className='mt-8' />
    </div>
  );
}
