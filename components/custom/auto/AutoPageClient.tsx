'use client';

import { useState, useEffect, useMemo, use, useRef, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Search, X } from 'lucide-react';
import { debounce } from 'lodash';
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
import CarCard from '@/components/custom/card/CarCard';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import { fetchCarMakes, fetchCarModels } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/ui/use-mobile';
import { categoryMapping } from '@/lib/categories';
import { steeringWheelOptions, tractionOptions, carTypeOptions, colorOptions } from '@/lib/mockData';
import { calcTotalPages } from '@/lib/auto/pagination';

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
  statusMap,
} from '@/lib/auto/initializers';
import type { AutoFilterState, SortCriteria, LocationData, LocationFilter, RawCarDoc, Car } from '@/lib/types';
import { mapRawCarToPost } from '@/lib/auto/helpers';
import CategoryEmptyState from '@/components/custom/empty/CategoryEmptyState';
import { getAppliedFilters } from '@/lib/auto/filters';

type AutoPageClientProps = {
  initialResult: Promise<{ items: RawCarDoc[]; total: number; hasMore: boolean }>;
  initialPage: number;
  initialTip: string;
};

export default function AutoPageClient({ initialResult, initialPage, initialTip }: AutoPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const result = use(initialResult);

  const [activeTab, setActiveTab] = useState<keyof typeof categoryMapping>(initialTip as keyof typeof categoryMapping);
  const [filters, setFilters] = useState<AutoFilterState>(getInitialFilters(searchParams));
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(getInitialSortCriteria(searchParams));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery(searchParams));
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(getInitialSearchQuery(searchParams));
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(getInitialLocationFilter(searchParams));
  const [resetKey, setResetKey] = useState(0);
  const isMobile = useIsMobile();

  const updateUrl = (
    newActiveTab: keyof typeof categoryMapping,
    newFilters: AutoFilterState,
    newSortCriteria: SortCriteria,
    newSearchQuery: string,
    newLocationFilter: LocationFilter,
    newCurrentPage: number
  ) => {
    const params = new URLSearchParams();
    if (newActiveTab !== defaultActiveTab) params.set('tip', newActiveTab);

    if (newFilters.brand !== defaultFilters.brand) params.set('marca', newFilters.brand);
    if (newFilters.model !== defaultFilters.model) params.set('model', newFilters.model);
    if (newFilters.steeringWheelPosition !== defaultFilters.steeringWheelPosition) params.set('volan', newFilters.steeringWheelPosition);
    if (newFilters.priceCurrency.length > 0) newFilters.priceCurrency.forEach((c) => params.append('moneda', c));
    if (newFilters.fuel.length > 0) newFilters.fuel.forEach((f) => params.append('combustibil', f));
    if (newFilters.transmission.length > 0) newFilters.transmission.forEach((t) => params.append('transmisie', t));
    if (newFilters.bodyType.length > 0) newFilters.bodyType.forEach((b) => params.append('caroserie', b));
    if (newFilters.color.length > 0) newFilters.color.forEach((c) => params.append('culoare', c));
    if (newFilters.traction.length > 0) newFilters.traction.forEach((tr) => params.append('tractiune', tr));
    if (newFilters.status !== defaultFilters.status) {
      const stare = Object.keys(statusMap).find((k) => statusMap[k as keyof typeof statusMap] === newFilters.status) || newFilters.status;
      params.set('stare', stare);
    }
    if (newFilters.priceRange[0] !== defaultFilters.priceRange[0] || newFilters.priceRange[1] !== defaultFilters.priceRange[1]) {
      params.set('pretMin', newFilters.priceRange[0].toString());
      params.set('pretMax', newFilters.priceRange[1].toString());
    }
    if (newFilters.yearRange[0] !== defaultFilters.yearRange[0] || newFilters.yearRange[1] !== defaultFilters.yearRange[1]) {
      params.set('anMin', newFilters.yearRange[0].toString());
      params.set('anMax', newFilters.yearRange[1].toString());
    }
    if (newFilters.mileageRange[0] !== defaultFilters.mileageRange[0] || newFilters.mileageRange[1] !== defaultFilters.mileageRange[1]) {
      params.set('kilometrajMin', newFilters.mileageRange[0].toString());
      params.set('kilometrajMax', newFilters.mileageRange[1].toString());
    }
    if (
      newFilters.engineCapacityRange[0] !== defaultFilters.engineCapacityRange[0] ||
      newFilters.engineCapacityRange[1] !== defaultFilters.engineCapacityRange[1]
    ) {
      params.set('capacitateMin', newFilters.engineCapacityRange[0].toString());
      params.set('capacitateMax', newFilters.engineCapacityRange[1].toString());
    }
    if (
      newFilters.horsepowerRange[0] !== defaultFilters.horsepowerRange[0] ||
      newFilters.horsepowerRange[1] !== defaultFilters.horsepowerRange[1]
    ) {
      params.set('caiPutereMin', newFilters.horsepowerRange[0].toString());
      params.set('caiPutereMax', newFilters.horsepowerRange[1].toString());
    }

    if (newSortCriteria.price) params.set('pret', newSortCriteria.price);
    if (newSortCriteria.year) params.set('an', newSortCriteria.year);
    if (newSortCriteria.mileage) params.set('kilometraj', newSortCriteria.mileage);
    if (newSortCriteria.date) params.set('data', newSortCriteria.date);

    if (newSearchQuery !== defaultSearchQuery) params.set('cautare', newSearchQuery);
    if (newLocationFilter.location) {
      params.set('lat', newLocationFilter.location.lat.toString());
      params.set('lng', newLocationFilter.location.lng.toString());
      params.set('raza', newLocationFilter.radius.toString());
    }

    if (newCurrentPage !== defaultCurrentPage) {
      params.set('pagina', newCurrentPage.toString());
    } else {
      params.delete('pagina');
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';

    const currentParams = new URLSearchParams(searchParams.toString());
    const currentUrl = currentParams.toString() ? `?${currentParams.toString()}` : '';

    if (newUrl !== currentUrl) {
      startTransition(() => {
        router.push(newUrl || window.location.pathname);
      });
    }
  };

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (initialTip && initialTip in categoryMapping) {
      setActiveTab(initialTip as keyof typeof categoryMapping);
    }
  }, [initialTip]);



  const cars = useMemo(
    () =>
      result.items.map((doc: RawCarDoc) =>
        mapRawCarToPost(doc, (categoryMapping[activeTab as keyof typeof categoryMapping] as 'sell' | 'buy' | 'rent' | 'auction') || 'sell')
      ),
    [result, activeTab]
  );
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce((query: string) => {
      setDebouncedSearchQuery(query);
      updateUrl(activeTab, filters, sortCriteria, query, locationFilter, 1);
    }, 300);

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [activeTab, filters, sortCriteria, locationFilter]);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearchRef.current?.(value);
  };

  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadBrands = async () => {
      const fetchedBrands = await fetchCarMakes();
      setBrands(fetchedBrands);
    };
    loadBrands();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (filters.brand) {
        const fetchedModels = await fetchCarModels(filters.brand);
        setModels(fetchedModels);
      } else {
        setModels([]);
      }
    };
    loadModels();
  }, [filters.brand]);

  const paginatedItems = cars;
  const totalPages = calcTotalPages(result.total);
  const cardsPerPage = Math.min(Math.max(paginatedItems.length, 1), 3);

  const handleFilterChange = (key: keyof AutoFilterState, value: string | number[] | string[]) => {
    const newFilters = { ...filters, [key]: value } as AutoFilterState;
    setFilters(newFilters);
    setCurrentPage(1);
    updateUrl(activeTab, newFilters, sortCriteria, debouncedSearchQuery, locationFilter, 1);
  };

  const handleLocationChange = (location: LocationData | null, radius: number) => {
    const newLocationFilter = { location, radius };
    setLocationFilter(newLocationFilter);
    setCurrentPage(1);
    updateUrl(activeTab, filters, sortCriteria, debouncedSearchQuery, newLocationFilter, 1);
  };

  const removeFilter = (key: string, value: string) => {
    let newFilters = { ...filters };
    let newSortCriteria = { ...sortCriteria };
    let newSearchQuery = debouncedSearchQuery;
    let newLocationFilter = { ...locationFilter };

    if (key === 'searchQuery') {
      setSearchQuery(defaultSearchQuery);
      setDebouncedSearchQuery(defaultSearchQuery);
      newSearchQuery = defaultSearchQuery;
    } else if (key === 'location') {
      setLocationFilter(defaultLocationFilter);
      setResetKey((prev) => prev + 1);
      newLocationFilter = defaultLocationFilter;
    } else if (key === 'priceRange') {
      newFilters.priceRange = defaultFilters.priceRange;
    } else if (key === 'yearRange') {
      newFilters.yearRange = defaultFilters.yearRange;
    } else if (key === 'mileageRange') {
      newFilters.mileageRange = defaultFilters.mileageRange;
    } else if (key === 'engineCapacityRange') {
      newFilters.engineCapacityRange = defaultFilters.engineCapacityRange;
    } else if (key === 'horsepowerRange') {
      newFilters.horsepowerRange = defaultFilters.horsepowerRange;
    } else if (key === 'price' || key === 'year' || key === 'mileage' || key === 'date') {
      newSortCriteria = { ...sortCriteria, [key]: null };
    } else if (key in filters && Array.isArray((filters as Record<string, unknown>)[key])) {
      newFilters = {
        ...filters,
        [key]: ((filters as Record<string, unknown>)[key] as string[]).filter((item) => item !== value),
      } as AutoFilterState;
    } else {
      newFilters = { ...filters, [key]: defaultFilters[key as keyof AutoFilterState] };
    }

    setFilters(newFilters);
    setSortCriteria(newSortCriteria);
    setLocationFilter(newLocationFilter);
    setCurrentPage(1);
    updateUrl(activeTab, newFilters, newSortCriteria, newSearchQuery, newLocationFilter, 1);
  };

  const resetAllFilters = () => {
    setFilters(defaultFilters);
    setSortCriteria(defaultSortCriteria);
    setSearchQuery(defaultSearchQuery);
    setDebouncedSearchQuery(defaultSearchQuery);
    setLocationFilter(defaultLocationFilter);
    setCurrentPage(defaultCurrentPage);
    setResetKey((prev) => prev + 1);
    updateUrl(activeTab, defaultFilters, defaultSortCriteria, defaultSearchQuery, defaultLocationFilter, defaultCurrentPage);
  };

  const handleTabChange = (tab: keyof typeof categoryMapping) => {
    setActiveTab(tab);
    setCurrentPage(1);
    updateUrl(tab, filters, sortCriteria, debouncedSearchQuery, locationFilter, 1);
  };

  const handleSortChange = (key: keyof SortCriteria, value: 'asc' | 'desc' | null) => {
    const newSortCriteria = { ...sortCriteria, [key]: value };
    setSortCriteria(newSortCriteria);
    setCurrentPage(1);
    updateUrl(activeTab, filters, newSortCriteria, debouncedSearchQuery, locationFilter, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(activeTab, filters, sortCriteria, debouncedSearchQuery, locationFilter, page);
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

  const appliedFilters = useMemo(
    () =>
      getAppliedFilters(filters, sortCriteria, debouncedSearchQuery, locationFilter).filter((filter) => {
        if (filter.key === 'priceRange') return JSON.stringify(filters.priceRange) !== JSON.stringify(defaultFilters.priceRange);
        if (filter.key === 'yearRange') return JSON.stringify(filters.yearRange) !== JSON.stringify(defaultFilters.yearRange);
        if (filter.key === 'mileageRange') return JSON.stringify(filters.mileageRange) !== JSON.stringify(defaultFilters.mileageRange);
        if (filter.key === 'engineCapacityRange')
          return JSON.stringify(filters.engineCapacityRange) !== JSON.stringify(defaultFilters.engineCapacityRange);
        if (filter.key === 'horsepowerRange')
          return JSON.stringify(filters.horsepowerRange) !== JSON.stringify(defaultFilters.horsepowerRange);
        if (filter.key === 'location') return JSON.stringify(locationFilter) !== JSON.stringify(defaultLocationFilter);
        if (filter.key === 'searchQuery') return debouncedSearchQuery !== defaultSearchQuery;
        if (filter.key in sortCriteria)
          return sortCriteria[filter.key as keyof SortCriteria] !== defaultSortCriteria[filter.key as keyof SortCriteria];
        return true;
      }),
    [filters, sortCriteria, debouncedSearchQuery, locationFilter]
  );

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
          onChange={handleTabChange}
        />
      </div>

      <div className='mb-4 flex flex-col sm:flex-row gap-2 justify-center md:justify-start'>
        <AppInput
          placeholder='Caută mașini (marcă, model...)'
          value={searchQuery}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          className='flex-1'
          leftIcon={Search}
        />
        <AppLocationInput
          key={resetKey}
          location={locationFilter.location}
          onChange={handleLocationChange}
          placeholder='Locație'
          className='flex-1'
          filteredCars={cars}
          leftIcon={MapPin}
          showLabelDesc={false}
        />
        <Button variant='default'>Caută</Button>
      </div>

      <div className='mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        <AppSlider
          label='Preț'
          min={0}
          max={1000000}
          step={10000}
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value)}
          currency='€'
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
          max={10000}
          step={100}
          value={filters.horsepowerRange}
          onValueChange={(value) => handleFilterChange('horsepowerRange', value)}
          currency='CP'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4'>
        <AppSelectInput
          options={[
            { value: 'new', label: 'Nou' },
            { value: 'used', label: 'Folosit' },
            { value: 'damaged', label: 'Deteriorat' },
          ]}
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value as string)}
          multiple={false}
          placeholder='Stare'
        />
        <AppCombobox
          options={brands}
          value={filters.brand}
          onValueChange={(value) => {
            const newFilters = { ...filters, brand: value, model: '' } as AutoFilterState;
            setFilters(newFilters);
            setCurrentPage(1);
            updateUrl(activeTab, newFilters, sortCriteria, debouncedSearchQuery, locationFilter, 1);
          }}
          placeholder='Marcă'
        />
        <AppSelectInput
          options={models}
          value={filters.model}
          onValueChange={(value) => handleFilterChange('model', value as string)}
          multiple={false}
          placeholder='Model'
          disabled={!filters.brand}
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
            { value: 'Semi-Automatic', label: 'Semi-automată' },
          ]}
          value={filters.transmission}
          onValueChange={(value) => handleFilterChange('transmission', value as string[])}
          multiple={true}
          placeholder='Transmisie'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4'>
        <AppSelectInput
          options={carTypeOptions}
          value={filters.bodyType}
          onValueChange={(value) => handleFilterChange('bodyType', value as string[])}
          multiple={true}
          placeholder='Tip Caroserie'
        />
        <AppSelectInput
          options={colorOptions}
          value={filters.color}
          onValueChange={(value) => handleFilterChange('color', value as string[])}
          multiple={true}
          placeholder='Culoare'
        />
        <AppSelectInput
          options={steeringWheelOptions}
          value={filters.steeringWheelPosition}
          onValueChange={(value) => handleFilterChange('steeringWheelPosition', value as string)}
          multiple={false}
          placeholder='Poziție Volan'
        />
        <AppSelectInput
          options={tractionOptions}
          value={filters.traction}
          onValueChange={(value) => handleFilterChange('traction', value as string[])}
          multiple={true}
          placeholder='Tracțiune'
        />
      </div>

      <div className='mb-4 flex flex-col gap-4'>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3'>
          <AppSelectInput
            options={[
              { value: 'none', label: 'Fără sortare' },
              { value: 'asc', label: 'Crescător' },
              { value: 'desc', label: 'Descrescător' },
            ]}
            value={sortCriteria.price || 'none'}
            onValueChange={(value) => {
              handleSortChange('price', value === 'none' ? null : (value as 'asc' | 'desc'));
            }}
            label='Preț'
          />
          <AppSelectInput
            options={[
              { value: 'none', label: 'Fără sortare' },
              { value: 'asc', label: 'Crescător' },
              { value: 'desc', label: 'Descrescător' },
            ]}
            value={sortCriteria.year || 'none'}
            onValueChange={(value) => {
              handleSortChange('year', value === 'none' ? null : (value as 'asc' | 'desc'));
            }}
            label='An'
          />
          <AppSelectInput
            options={[
              { value: 'none', label: 'Fără sortare' },
              { value: 'asc', label: 'Crescător' },
              { value: 'desc', label: 'Descrescător' },
            ]}
            value={sortCriteria.mileage || 'none'}
            onValueChange={(value) => {
              handleSortChange('mileage', value === 'none' ? null : (value as 'asc' | 'desc'));
            }}
            label='Kilometraj'
          />
          <AppSelectInput
            options={[
              { value: 'none', label: 'Fără sortare' },
              { value: 'asc', label: 'Vechi' },
              { value: 'desc', label: 'Nou' },
            ]}
            value={sortCriteria.date || 'none'}
            onValueChange={(value) => {
              handleSortChange('date', value === 'none' ? null : (value as 'asc' | 'desc'));
            }}
            label='Dată'
          />
        </div>
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
            <X className='h-2 w-2' />
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
        {isPending ? (
          <SkeletonLoading variant='auto' className='col-span-full' />
        ) : paginatedItems.length === 0 ? (
          <CategoryEmptyState
            activeTab={activeTab}
            title='Nicio mașină disponibilă'
            description='Nu am găsit mașini care să corespundă criteriilor tale. Încearcă să modifici filtrele sau adaugă un nou anunț.'
            buttonLabel='Adaugă anunț'
          />
        ) : (
          paginatedItems.map((car) => <CarCard key={car.id} car={car} cardsPerPage={cardsPerPage} />)
        )}
      </div>

      {!isPending && paginatedItems.length > 0 && (
        <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className='mt-8' />
      )}
    </div>
  );
}
