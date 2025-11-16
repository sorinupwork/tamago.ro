'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, Search } from 'lucide-react';

import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { AppInput } from '@/components/custom/input/AppInput';
import { AppSelectInput } from '@/components/custom/input/AppSelectInput';
import { AppSlider } from '@/components/custom/input/AppSlider';
import { AppCombobox } from '@/components/custom/input/AppCombobox';
import { AppPagination } from '@/components/custom/pagination/AppPagination';
import { AppLocationInput } from '@/components/custom/input/AppLocationInput';
import { mockCars } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AutoTabs } from '@/components/custom/tabs/AutoTabs';
import { categoryMapping } from '@/lib/categories';
import { getFilteredCars, getAppliedFilters } from '@/lib/helpers/auto/filters';
import { getSortedCars } from '@/lib/helpers/auto/sorting';
import { calcTotalPages, paginateArray } from '@/lib/helpers/auto/pagination';
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
} from '@/lib/helpers/auto/initializers';
import type { FilterState, SortCriteria, LocationData, LocationFilter } from '@/lib/types';
import { CarCard } from '@/components/custom/auto/CarCard';

export default function AutoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<keyof typeof categoryMapping>(getInitialActiveTab(searchParams));
  const cars = mockCars;
  const [filters, setFilters] = useState<FilterState>(getInitialFilters(searchParams));
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(getInitialSortCriteria(searchParams));
  const [currentPage, setCurrentPage] = useState(getInitialCurrentPage(searchParams));
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery(searchParams));
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(getInitialLocationFilter(searchParams));
  const [resetKey, setResetKey] = useState(0);
  const isMobile = useIsMobile();

  // Update URL when state changes, only include non-default values
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== defaultActiveTab) params.set('tip', activeTab);
    // For filters, only include changed fields as individual params
    Object.keys(filters).forEach((key) => {
      const k = key as keyof FilterState;
      if (JSON.stringify(filters[k]) !== JSON.stringify(defaultFilters[k])) {
        if (k === 'priceRange') {
          params.set('priceMin', filters[k][0].toString());
          params.set('priceMax', filters[k][1].toString());
        } else if (k === 'yearRange') {
          params.set('yearMin', filters[k][0].toString());
          params.set('yearMax', filters[k][1].toString());
        } else if (k === 'mileageRange') {
          params.set('mileageMin', filters[k][0].toString());
          params.set('mileageMax', filters[k][1].toString());
        } else if (Array.isArray(filters[k])) {
          params.set(k, (filters[k] as string[]).join(','));
        } else {
          params.set(k, filters[k].toString());
        }
      }
    });
    // For sort, only include changed fields as individual params
    Object.keys(sortCriteria).forEach((key) => {
      const k = key as keyof SortCriteria;
      if (sortCriteria[k] !== defaultSortCriteria[k]) {
        params.set(k, sortCriteria[k] || '');
      }
    });
    if (searchQuery !== defaultSearchQuery) params.set('searchQuery', searchQuery);
    if (locationFilter.location) {
      params.set('lat', locationFilter.location.lat.toString());
      params.set('lng', locationFilter.location.lng.toString());
      params.set('radius', locationFilter.radius.toString());
    }
    if (currentPage !== defaultCurrentPage) params.set('currentPage', currentPage.toString());
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

  const computeNewTotalPages = (nextFilters: FilterState, nextSort: SortCriteria, nextSearch: string, nextLocation: LocationFilter) => {
    const filtered = getFilteredCars(cars, nextFilters, nextSearch, activeTab, categoryMapping, nextLocation);
    const sorted = getSortedCars(filtered, nextSort);
    return calcTotalPages(sorted.length);
  };

  const { totalPages, paginatedItems } = paginateArray(filteredCars, currentPage);

  const handleFilterChange = (key: keyof FilterState, value: string | number[] | string[]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value } as FilterState;
      const newTotal = computeNewTotalPages(next, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
      return next;
    });
  };

  const handleMultiFilterChange = (key: keyof FilterState, value: string, checked: boolean) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        [key]: checked ? [...(prev[key] as string[]), value] : (prev[key] as string[]).filter((item) => item !== value),
      } as FilterState;
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

  const removeFilter = (key: keyof FilterState | 'location' | 'searchQuery' | keyof SortCriteria, value: string) => {
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
    } else if (key === 'minEngineCapacity') {
      setFilters((prev) => ({ ...prev, minEngineCapacity: '' }));
      const newTotal = computeNewTotalPages({ ...filters, minEngineCapacity: '' }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'maxEngineCapacity') {
      setFilters((prev) => ({ ...prev, maxEngineCapacity: '' }));
      const newTotal = computeNewTotalPages({ ...filters, maxEngineCapacity: '' }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'minHorsepower') {
      setFilters((prev) => ({ ...prev, minHorsepower: '' }));
      const newTotal = computeNewTotalPages({ ...filters, minHorsepower: '' }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'maxHorsepower') {
      setFilters((prev) => ({ ...prev, maxHorsepower: '' }));
      const newTotal = computeNewTotalPages({ ...filters, maxHorsepower: '' }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key in sortCriteria) {
      handleSortChange(key as keyof SortCriteria, null);
    } else if (Array.isArray(filters[key as keyof FilterState])) {
      handleMultiFilterChange(key as keyof FilterState, value, false);
    } else {
      setFilters((prev) => {
        const next = { ...prev, [key as keyof FilterState]: '' } as FilterState;
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
    if (filter.key === 'minEngineCapacity') return filters.minEngineCapacity !== defaultFilters.minEngineCapacity;
    if (filter.key === 'maxEngineCapacity') return filters.maxEngineCapacity !== defaultFilters.maxEngineCapacity;
    if (filter.key === 'minHorsepower') return filters.minHorsepower !== defaultFilters.minHorsepower;
    if (filter.key === 'maxHorsepower') return filters.maxHorsepower !== defaultFilters.maxHorsepower;
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

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
        <div className='flex items-center gap-4 col-span-full'>
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
            min={2000}
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
        </div>
        <AppInput
          type='number'
          placeholder='Capacitate Motor Min (cc)'
          value={filters.minEngineCapacity}
          onChange={(e) => handleFilterChange('minEngineCapacity', e.target.value)}
          min={0}
        />
        <AppInput
          type='number'
          placeholder='Capacitate Motor Max (cc)'
          value={filters.maxEngineCapacity}
          onChange={(e) => handleFilterChange('maxEngineCapacity', e.target.value)}
          min={0}
        />
        <AppInput
          type='number'
          placeholder='Cai Putere Min'
          value={filters.minHorsepower}
          onChange={(e) => handleFilterChange('minHorsepower', e.target.value)}
          min={0}
        />
        <AppInput
          type='number'
          placeholder='Cai Putere Max'
          value={filters.maxHorsepower}
          onChange={(e) => handleFilterChange('maxHorsepower', e.target.value)}
          min={0}
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
        <AppSelectInput
          options={[
            { value: 'all', label: 'Status' },
            { value: 'new', label: 'Nou' },
            { value: 'used', label: 'Second Hand' },
            { value: 'damaged', label: 'Deteriorat' },
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

      <div
        className={cn(
          'grid gap-6',
          isMobile
            ? 'grid-cols-1'
            : paginatedItems.length === 1
            ? 'grid-cols-1'
            : paginatedItems.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-3'
        )}
      >
        {paginatedItems.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className='mt-8' />
    </div>
  );
}
