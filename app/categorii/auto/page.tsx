'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { MapPin, Search } from 'lucide-react';

import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppInput } from '@/components/custom/input/AppInput';
import { AppSelect } from '@/components/custom/select/AppSelect';
import { AppSlider } from '@/components/custom/slider/AppSlider';
import { AppSelectWithCheckbox } from '@/components/custom/select/AppSelectWithCheckbox';
import { AppCombobox } from '@/components/custom/combobox/AppCombobox';
import { AppPagination } from '@/components/custom/pagination/AppPagination';
import { AppLocationInput } from '@/components/custom/input/AppLocationInput';
import { mockCars } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AutoTabs } from '@/components/custom/tabs/AutoTabs';
import { categoryMapping, categoryLabels } from '@/lib/categories';
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
    // For filters, only include changed fields
    const nonDefaultFilters: Record<string, string | number[] | string[]> = {};
    Object.keys(filters).forEach((key) => {
      const k = key as keyof FilterState;
      if (JSON.stringify(filters[k]) !== JSON.stringify(defaultFilters[k])) {
        nonDefaultFilters[k] = filters[k];
      }
    });
    if (Object.keys(nonDefaultFilters).length > 0) params.set('filters', JSON.stringify(nonDefaultFilters));
    // For sort, only include changed fields
    const nonDefaultSort: Record<string, 'asc' | 'desc' | null> = {};
    Object.keys(sortCriteria).forEach((key) => {
      const k = key as keyof SortCriteria;
      if (sortCriteria[k] !== defaultSortCriteria[k]) {
        nonDefaultSort[k] = sortCriteria[k];
      }
    });
    if (Object.keys(nonDefaultSort).length > 0) params.set('sortCriteria', JSON.stringify(nonDefaultSort));
    if (searchQuery !== defaultSearchQuery) params.set('searchQuery', searchQuery);
    if (JSON.stringify(locationFilter) !== JSON.stringify(defaultLocationFilter))
      params.set('locationFilter', JSON.stringify(locationFilter));
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
    } else if (key === 'priceRange') {
      setFilters((prev) => ({ ...prev, priceRange: defaultFilters.priceRange }));
      const newTotal = computeNewTotalPages({ ...filters, priceRange: defaultFilters.priceRange }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'yearRange') {
      setFilters((prev) => ({ ...prev, yearRange: defaultFilters.yearRange }));
      const newTotal = computeNewTotalPages({ ...filters, yearRange: defaultFilters.yearRange }, sortCriteria, searchQuery, locationFilter);
      setCurrentPage((cur) => Math.min(cur, newTotal));
    } else if (key === 'mileageRange') {
      setFilters((prev) => ({ ...prev, mileageRange: defaultFilters.mileageRange }));
      const newTotal = computeNewTotalPages({ ...filters, mileageRange: defaultFilters.mileageRange }, sortCriteria, searchQuery, locationFilter);
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
    if (filter.key === 'location') return JSON.stringify(locationFilter) !== JSON.stringify(defaultLocationFilter);
    if (filter.key === 'searchQuery') return searchQuery !== defaultSearchQuery;
    if (filter.key in sortCriteria) return sortCriteria[filter.key as keyof SortCriteria] !== defaultSortCriteria[filter.key as keyof SortCriteria];
    // For other filters (e.g., brand, fuel), assume getAppliedFilters already excludes defaults
    return true;
  });

  return (
    <div className='container mx-auto max-w-7xl'>
      <Breadcrumbs
        items={[{ label: 'Acasă', href: '/' }, { label: 'Categorii', href: '/categorii' }, { label: 'Auto' }]}
        className='mb-4'
      />

      {/* Tabs */}
      <div className='flex flex-wrap gap-2 mb-4 justify-center md:justify-start'>
        <AutoTabs activeTab={activeTab} onChange={(t) => setActiveTab(t)} />
      </div>

      {/* Search Bar */}
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
          value={locationFilter.location?.address || ''}
          onChange={handleLocationChange}
          placeholder='Locație'
          className='flex-1'
          filteredCars={filteredCars}
          leftIcon={MapPin}
        />
        <Button variant='default'>Caută</Button>
      </div>

      {/* Applied Filters Tags */}
      <div className='mb-4 flex flex-wrap gap-2 min-h-8'>
        {appliedFilters.length > 0 && (
          <>
            {appliedFilters.map((filter) => (
              <Badge
                key={`${filter.key}-${filter.value}`}
                variant='secondary'
                onClick={() => removeFilter(filter.key as keyof typeof filters | 'location', filter.value)}
                className='cursor-default'
              >
                {filter.label} ×
              </Badge>
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

      {/* Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
        <div className='flex items-center gap-4 col-span-full'>
          <AppSlider
            label={`Interval Preț: $${filters.priceRange[0]} - $${filters.priceRange[1]}`}
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            min={0}
            max={1000000}
            step={1000}
            className='grow'
          />
          <AppSlider
            label={`Interval An: ${filters.yearRange[0]} - ${filters.yearRange[1]}`}
            value={filters.yearRange}
            onValueChange={(value) => handleFilterChange('yearRange', value)}
            min={2000}
            max={2025}
            step={1}
            className='grow'
          />
          <AppSlider
            label={`Interval Kilometraj: ${filters.mileageRange[0]} - ${filters.mileageRange[1]} km`}
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
        <AppSelectWithCheckbox
          options={[
            { value: 'Petrol', label: 'Benzină' },
            { value: 'Diesel', label: 'Motorină' },
            { value: 'Hybrid', label: 'Hibrid' },
            { value: 'Electric', label: 'Electric' },
          ]}
          selected={filters.fuel}
          onChange={(value, checked) => handleMultiFilterChange('fuel', value, checked)}
          placeholder='Tip Combustibil'
        />
        <AppSelectWithCheckbox
          options={[
            { value: 'Manual', label: 'Manuală' },
            { value: 'Automatic', label: 'Automată' },
          ]}
          selected={filters.transmission}
          onChange={(value, checked) => handleMultiFilterChange('transmission', value, checked)}
          placeholder='Transmisie'
        />
        <AppSelectWithCheckbox
          options={[
            { value: 'SUV', label: 'SUV' },
            { value: 'Sedan', label: 'Sedan' },
            { value: 'Hatchback', label: 'Hatchback' },
            { value: 'Coupe', label: 'Coupe' },
          ]}
          selected={filters.bodyType}
          onChange={(value, checked) => handleMultiFilterChange('bodyType', value, checked)}
          placeholder='Tip Caroserie'
        />
        <AppSelect
          options={[
            { value: 'new', label: 'Nou' },
            { value: 'used', label: 'Second Hand' },
            { value: 'damaged', label: 'Deteriorat' },
          ]}
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
          placeholder='Status'
        />
      </div>

      {/* Sort */}
      <div className='mb-4 flex justify-center md:justify-start'>
        <div className='flex grow flex-col sm:flex-row sm:flex-wrap gap-2'>
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după preț' },
              { value: 'asc', label: 'Preț: Crescător' },
              { value: 'desc', label: 'Preț: Descrescător' },
            ]}
            value={sortCriteria.price || 'none'}
            onValueChange={(value) => handleSortChange('price', value === 'none' ? null : (value as 'asc' | 'desc'))}
            placeholder='Sortează după preț'
            className='flex-1'
          />
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după an' },
              { value: 'asc', label: 'An: Vechi la Nou' },
              { value: 'desc', label: 'An: Nou la Vechi' },
            ]}
            value={sortCriteria.year || 'none'}
            onValueChange={(value) => handleSortChange('year', value === 'none' ? null : (value as 'asc' | 'desc'))}
            placeholder='Sortează după an'
            className='flex-1'
          />
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după kilometraj' },
              { value: 'asc', label: 'Kilometraj: Crescător' },
              { value: 'desc', label: 'Kilometraj: Descrescător' },
            ]}
            value={sortCriteria.mileage || 'none'}
            onValueChange={(value) => handleSortChange('mileage', value === 'none' ? null : (value as 'asc' | 'desc'))}
            placeholder='Sortează după kilometraj'
            className='flex-1'
          />
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după dată' },
              { value: 'desc', label: 'Cele Mai Noi' },
              { value: 'asc', label: 'Cele Mai Vechi' },
            ]}
            value={sortCriteria.date || 'none'}
            onValueChange={(value) => handleSortChange('date', value === 'none' ? null : (value as 'asc' | 'desc'))}
            placeholder='Sortează după dată'
            className='flex-1'
          />
        </div>
      </div>

      {/* Car List */}
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
          <Link key={car.id} href={`/categorii/auto/${car.category}/${car.id}`} className=''>
            <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102 animate-in fade-in-0 slide-in-from-bottom-4'>
              <Image src={car.images[0]} alt={car.title} width={400} height={192} className='w-full h-48 object-cover' />
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg font-semibold line-clamp-2'>{car.title}</CardTitle>
                  <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='ml-2'>
                    {categoryLabels[car.category as keyof typeof categoryLabels]}
                  </Badge>
                </div>
                <p className='text-2xl font-bold text-green-600'>${car.price.toLocaleString('en-US')}</p>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='space-y-1 text-sm text-muted-foreground'>
                  <p>
                    An: {car.year} | Kilometraj: {car.mileage.toLocaleString('en-US')} km
                  </p>
                  <p>
                    Combustibil: {car.fuel} | Transmisie: {car.transmission}
                  </p>
                  <p>
                    Locație: {car.location} | Caroserie: {car.bodyType}
                  </p>
                  <p className='text-xs'>
                    Culoare: {car.color} | Vânzător: {car.sellerType}
                  </p>
                </div>
                <p className='text-xs text-muted-foreground mt-2'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className='mt-8' />
    </div>
  );
}
