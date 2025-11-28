'use client';

import { useState, useEffect, useMemo, use, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
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
import { fetchCarsServerAction } from '@/actions/auto/actions';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/ui/use-mobile';
import { categoryMapping } from '@/lib/categories';
import { carModelsByBrand, steeringWheelOptions, tractionOptions } from '@/lib/mockData';
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
  statusMap,
} from '@/lib/auto/initializers';
import type { AutoFilterState, SortCriteria, LocationData, LocationFilter, Car, RawCarDoc } from '@/lib/types';
import { mapRawCarToPost } from '@/lib/auto/helpers'; 

type AutoPageClientProps = {
  initialResult: Promise<{ items: RawCarDoc[]; total: number; hasMore: boolean }>;
  initialPage: number;
  initialTip: string;
};

export default function AutoPageClient({ initialResult, initialPage, initialTip }: AutoPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const result = use(initialResult);

  const initialCars = useMemo(
    () =>
      result.items.map((doc: RawCarDoc) =>
        mapRawCarToPost(doc, (categoryMapping[initialTip as keyof typeof categoryMapping] as 'sell' | 'buy' | 'rent' | 'auction') || 'sell')
      ),
    [result, initialTip]
  );

  const [activeTab, setActiveTab] = useState<keyof typeof categoryMapping>(initialTip as keyof typeof categoryMapping);
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [filters, setFilters] = useState<AutoFilterState>(getInitialFilters(searchParams));
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(getInitialSortCriteria(searchParams));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery(searchParams));
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(getInitialLocationFilter(searchParams));
  const [resetKey, setResetKey] = useState(0);
  const isMobile = useIsMobile();

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setCars([]);
      const newCars = await fetchCarsServerAction({
        activeTab,
        searchQuery,
        filters,
        sortCriteria,
        locationFilter,
      });
      startTransition(() => {
        setCars(newCars);
        setCurrentPage(1);
      });
    });
  }, [activeTab, searchQuery, filters, sortCriteria, locationFilter]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== defaultActiveTab) params.set('tip', activeTab);

    if (filters.brand !== defaultFilters.brand) params.set('marca', filters.brand);
    if (filters.model !== defaultFilters.model) params.set('model', filters.model);
    if (filters.steeringWheelPosition !== defaultFilters.steeringWheelPosition) params.set('volan', filters.steeringWheelPosition);
    if (filters.priceCurrency !== defaultFilters.priceCurrency) params.set('moneda', filters.priceCurrency);
    if (filters.fuel.length > 0) filters.fuel.forEach((f) => params.append('combustibil', f));
    if (filters.transmission.length > 0) filters.transmission.forEach((t) => params.append('transmisie', t));
    if (filters.bodyType.length > 0) filters.bodyType.forEach((b) => params.append('caroserie', b));
    if (filters.color.length > 0) filters.color.forEach((c) => params.append('culoare', c));
    if (filters.traction.length > 0) filters.traction.forEach((tr) => params.append('tractiune', tr));
    if (filters.status !== defaultFilters.status) {
      const stare = Object.keys(statusMap).find((k) => statusMap[k as keyof typeof statusMap] === filters.status) || filters.status;
      params.set('stare', stare);
    }
    if (filters.priceRange[0] !== defaultFilters.priceRange[0] || filters.priceRange[1] !== defaultFilters.priceRange[1]) {
      params.set('pretMin', filters.priceRange[0].toString());
      params.set('pretMax', filters.priceRange[1].toString());
    }
    if (filters.yearRange[0] !== defaultFilters.yearRange[0] || filters.yearRange[1] !== defaultFilters.yearRange[1]) {
      params.set('anMin', filters.yearRange[0].toString());
      params.set('anMax', filters.yearRange[1].toString());
    }
    if (filters.mileageRange[0] !== defaultFilters.mileageRange[0] || filters.mileageRange[1] !== defaultFilters.mileageRange[1]) {
      params.set('kilometrajMin', filters.mileageRange[0].toString());
      params.set('kilometrajMax', filters.mileageRange[1].toString());
    }
    if (
      filters.engineCapacityRange[0] !== defaultFilters.engineCapacityRange[0] ||
      filters.engineCapacityRange[1] !== defaultFilters.engineCapacityRange[1]
    ) {
      params.set('capacitateMin', filters.engineCapacityRange[0].toString());
      params.set('capacitateMax', filters.engineCapacityRange[1].toString());
    }
    if (
      filters.horsepowerRange[0] !== defaultFilters.horsepowerRange[0] ||
      filters.horsepowerRange[1] !== defaultFilters.horsepowerRange[1]
    ) {
      params.set('caiPutereMin', filters.horsepowerRange[0].toString());
      params.set('caiPutereMax', filters.horsepowerRange[1].toString());
    }

    if (sortCriteria.price) params.set('pret', sortCriteria.price);
    if (sortCriteria.year) params.set('an', sortCriteria.year);
    if (sortCriteria.mileage) params.set('kilometraj', sortCriteria.mileage);
    if (sortCriteria.date) params.set('data', sortCriteria.date);

    if (searchQuery !== defaultSearchQuery) params.set('cautare', searchQuery);
    if (locationFilter.location) {
      params.set('lat', locationFilter.location.lat.toString());
      params.set('lng', locationFilter.location.lng.toString());
      params.set('raza', locationFilter.radius.toString());
    }
    if (currentPage !== defaultCurrentPage) {
      params.set('pagina', currentPage.toString());
    } else {
      params.delete('pagina');
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl || window.location.pathname, { scroll: false });
  }, [activeTab, filters, sortCriteria, searchQuery, locationFilter, currentPage, router]);

  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(cars.map((car) => car.brand))];
    return brands.map((brand) => ({ value: brand, label: brand }));
  }, [cars]);

  const uniqueModels = useMemo(() => {
    if (!filters.brand) return [];
    const models = carModelsByBrand[filters.brand as keyof typeof carModelsByBrand] || [];
    return models;
  }, [filters.brand]);

  const uniqueColors = useMemo(() => {
    const colors = [...new Set(cars.map((car) => car.color).filter((c) => c))];
    return colors.map((color) => ({ value: color, label: color }));
  }, [cars]);

  const uniqueBodyTypes = useMemo(() => {
    const types = [...new Set(cars.map((car) => car.bodyType))];
    return types.map((type) => ({ value: type, label: type }));
  }, [cars]);

  const filteredCars = useMemo(() => {
    const filtered = getFilteredCars(cars, filters, searchQuery, activeTab, categoryMapping, locationFilter);
    return getSortedCars(filtered, sortCriteria);
  }, [cars, filters, sortCriteria, searchQuery, activeTab, locationFilter]);

  const { totalPages, paginatedItems } = paginateArray(filteredCars, currentPage);

  const cardsPerPage = Math.min(Math.max(paginatedItems.length, 1), 3);

  const handleFilterChange = (key: keyof AutoFilterState, value: string | number[] | string[]) => {
    startTransition(() => {
      setCars([]);
      setFilters((prev) => ({ ...prev, [key]: value }) as AutoFilterState);
      setCurrentPage(1);
    });
  };

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setCars([]);
      setSearchQuery(value);
      setCurrentPage(1);
    });
  };

  const handleLocationChange = (location: LocationData | null, radius: number) => {
    startTransition(() => {
      setCars([]);
      setLocationFilter({ location, radius });
      setCurrentPage(1);
    });
  };

  const removeFilter = (key: string, value: string) => {
    startTransition(() => {
      setCars([]);
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
      } else if (key === 'price' || key === 'year' || key === 'mileage' || key === 'date') {
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
        setFilters((prev) => ({ ...prev, [key]: defaultFilters[key as keyof AutoFilterState] }));
        setCurrentPage(1);
      }
    });
  };

  const resetAllFilters = () => {
    startTransition(() => {
      setCars([]);
      setFilters(defaultFilters);
      setSortCriteria(defaultSortCriteria);
      setSearchQuery(defaultSearchQuery);
      setLocationFilter(defaultLocationFilter);
      setCurrentPage(defaultCurrentPage);
      setResetKey((prev) => prev + 1);
    });
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
            startTransition(() => {
              setCars([]);
              setActiveTab(t);
              setCurrentPage(1);
            });
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
          showLabelDesc={false}
        />
        <Button variant='default'>Caută</Button>
      </div>

      <div className='mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        <div className='flex flex-col gap-2'>
          <AppSlider
            label='Preț'
            min={0}
            max={1000000}
            step={1000}
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            currency={filters.priceCurrency || 'EUR'}
          />
          <AppSelectInput
            options={[
              { value: 'EUR', label: 'EUR' },
              { value: 'USD', label: 'USD' },
              { value: 'RON', label: 'RON' },
              { value: 'GBP', label: 'GBP' },
            ]}
            value={filters.priceCurrency}
            onValueChange={(value) => handleFilterChange('priceCurrency', value as string)}
            multiple={false}
            placeholder='Monedă'
          />
        </div>
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
          options={uniqueBrands}
          value={filters.brand}
          onValueChange={(value) => {
            handleFilterChange('brand', value);
            handleFilterChange('model', '');
          }}
          placeholder='Marcă'
        />
        <AppSelectInput
          options={uniqueModels}
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
          options={uniqueBodyTypes}
          value={filters.bodyType}
          onValueChange={(value) => handleFilterChange('bodyType', value as string[])}
          multiple={true}
          placeholder='Tip Caroserie'
        />
        <AppSelectInput
          options={uniqueColors}
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
        <h3 className='text-sm font-semibold text-gray-700'>Sortare după</h3>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3'>
          {/* Price Sort */}
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-gray-600'>Preț</p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={sortCriteria.price === 'asc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, price: prev.price === 'asc' ? null : 'asc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronUp className='h-4 w-4' /> Cresc.
              </Button>
              <Button
                size='sm'
                variant={sortCriteria.price === 'desc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, price: prev.price === 'desc' ? null : 'desc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronDown className='h-4 w-4' /> Desc.
              </Button>
            </div>
          </div>

          {/* Year Sort */}
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-gray-600'>An</p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={sortCriteria.year === 'asc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, year: prev.year === 'asc' ? null : 'asc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronUp className='h-4 w-4' /> Cresc.
              </Button>
              <Button
                size='sm'
                variant={sortCriteria.year === 'desc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, year: prev.year === 'desc' ? null : 'desc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronDown className='h-4 w-4' /> Desc.
              </Button>
            </div>
          </div>

          {/* Mileage Sort */}
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-gray-600'>Kilometraj</p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={sortCriteria.mileage === 'asc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, mileage: prev.mileage === 'asc' ? null : 'asc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronUp className='h-4 w-4' /> Cresc.
              </Button>
              <Button
                size='sm'
                variant={sortCriteria.mileage === 'desc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, mileage: prev.mileage === 'desc' ? null : 'desc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronDown className='h-4 w-4' /> Desc.
              </Button>
            </div>
          </div>

          {/* Date Sort */}
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-gray-600'>Dată</p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={sortCriteria.date === 'asc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, date: prev.date === 'asc' ? null : 'asc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronUp className='h-4 w-4' /> Vechi
              </Button>
              <Button
                size='sm'
                variant={sortCriteria.date === 'desc' ? 'default' : 'outline'}
                onClick={() => {
                  startTransition(() => {
                    setCars([]);
                    setSortCriteria((prev) => ({ ...prev, date: prev.date === 'desc' ? null : 'desc' }));
                    setCurrentPage(1);
                  });
                }}
                className='flex-1 gap-1'
              >
                <ChevronDown className='h-4 w-4' /> Nou
              </Button>
            </div>
          </div>
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
        ) : (
          paginatedItems.map((car) => <CarCard key={car.id} car={car} cardsPerPage={cardsPerPage} />)
        )}
      </div>

      {!isPending && <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className='mt-8' />}
    </div>
  );
}
