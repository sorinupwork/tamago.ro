'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
import { calculateDistance } from '@/lib/services';

export default function AutoPage() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy' | 'rent' | 'auction'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedSearch');
      if (saved) {
        const data = JSON.parse(saved);
        return data.activeTab || 'sell';
      }
    }
    return 'sell';
  });
  const cars = mockCars;
  const [filters, setFilters] = useState({
    minEngineCapacity: '',
    maxEngineCapacity: '',
    minHorsepower: '',
    maxHorsepower: '',
    status: '',
    brand: '',
    fuel: [] as string[],
    transmission: [] as string[],
    bodyType: [] as string[],
    color: [] as string[],
    priceRange: [0, 100000],
    yearRange: [2000, 2023],
    mileageRange: [0, 300000],
    engineCapacityRange: [0, 5000],
    horsepowerRange: [0, 1000],
  });
  const [sortCriteria, setSortCriteria] = useState<{
    price: 'asc' | 'desc' | null;
    year: 'asc' | 'desc' | null;
    mileage: 'asc' | 'desc' | null;
    date: 'asc' | 'desc' | null;
  }>({
    price: null,
    year: null,
    mileage: null,
    date: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<{ location: { lat: number; lng: number; address: string; fullAddress: string } | null; radius: number }>({ location: null, radius: 50 });

  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(cars.map((car) => car.brand))];
    return brands.map((brand) => ({ value: brand, label: brand }));
  }, [cars]);

  // Apply filters and sorts
  const filteredCars = useMemo(() => {
    let filtered = cars;
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
    if (activeTab) filtered = filtered.filter((car) => car.category === activeTab);
    const loc = locationFilter.location;
    if (loc) {
      filtered = filtered.filter((car) => {
        if (car.lat && car.lng) {
          const distance = calculateDistance(loc.lat, loc.lng, car.lat, car.lng);
          return distance <= locationFilter.radius;
        }
        return true; // If no lat/lng, include
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let result = 0;
      if (sortCriteria.date) {
        result =
          sortCriteria.date === 'asc'
            ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        if (result !== 0) return result;
      }
      if (sortCriteria.price) {
        result = sortCriteria.price === 'asc' ? a.price - b.price : b.price - a.price;
        if (result !== 0) return result;
      }
      if (sortCriteria.year) {
        result = sortCriteria.year === 'asc' ? a.year - b.year : b.year - a.year;
        if (result !== 0) return result;
      }
      if (sortCriteria.mileage) {
        result = sortCriteria.mileage === 'asc' ? a.mileage - b.mileage : b.mileage - a.mileage;
        if (result !== 0) return result;
      }
      return 0;
    });

    return filtered;
  }, [cars, filters, sortCriteria, searchQuery, activeTab, locationFilter]);

  // Pagination logic
  const perPages = [];
  let remaining = filteredCars.length;
  let page = 1;
  while (remaining > 0) {
    const perPageCalc = Math.min(page === 1 ? 1 : page === 2 ? 2 : 3, remaining);
    perPages.push(perPageCalc);
    remaining -= perPageCalc;
    page++;
  }
  const totalPages = perPages.length;
  const startIndex = perPages.slice(0, currentPage - 1).reduce((sum, p) => sum + p, 0);
  const endIndex = startIndex + perPages[currentPage - 1];
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  const handleFilterChange = (key: string, value: string | number[] | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiFilterChange = (key: keyof typeof filters, value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked ? [...(prev[key] as string[]), value] : (prev[key] as string[]).filter((item) => item !== value),
    }));
  };

  const removeFilter = (key: keyof typeof filters, value: string) => {
    if (Array.isArray(filters[key])) {
      handleMultiFilterChange(key, value, false);
    } else {
      setFilters((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const resetAllFilters = () => {
    setFilters({
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
    });
    setSortCriteria({
      price: null,
      year: null,
      mileage: null,
      date: null,
    });
    setSearchQuery('');
    setLocationFilter({ location: null, radius: 50 });
    setCurrentPage(1);
  };

  const saveSearch = () => {
    const searchData = { filters, sortCriteria, searchQuery, activeTab, locationFilter };
    localStorage.setItem('savedSearch', JSON.stringify(searchData));
    alert('Căutare salvată!');
  };

  const appliedFilters = [
    ...filters.fuel.map((f) => ({ key: 'fuel', value: f, label: `Combustibil: ${f}` })),
    ...filters.transmission.map((t) => ({ key: 'transmission', value: t, label: `Transmisie: ${t}` })),
    ...filters.bodyType.map((b) => ({ key: 'bodyType', value: b, label: `Caroserie: ${b}` })),
    ...filters.color.map((c) => ({ key: 'color', value: c, label: `Culoare: ${c}` })),
    ...(filters.brand ? [{ key: 'brand', value: filters.brand, label: `Marcă: ${filters.brand}` }] : []),
    ...(locationFilter.location ? [{ key: 'location', value: locationFilter.location.address, label: `Locație: ${locationFilter.location.address}` }] : []),
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
    ...(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000
      ? [
          {
            key: 'priceRange',
            value: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
            label: `Interval Preț: $${filters.priceRange[0]} - $${filters.priceRange[1]}`,
          },
        ]
      : []),
    ...(filters.yearRange[0] !== 2000 || filters.yearRange[1] !== 2023
      ? [
          {
            key: 'yearRange',
            value: `${filters.yearRange[0]}-${filters.yearRange[1]}`,
            label: `Interval An: ${filters.yearRange[0]} - ${filters.yearRange[1]}`,
          },
        ]
      : []),
    ...(filters.mileageRange[0] !== 0 || filters.mileageRange[1] !== 300000
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

  const handleLocationChange = (location: { lat: number; lng: number; address: string; fullAddress: string } | null, radius: number) => {
    setLocationFilter({ location, radius });
  };

  return (
    <div className='container mx-auto max-w-7xl'>
      <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: 'Categorii', href: '/categorii' }, { label: 'Auto' }]} />

      <h1 className='text-3xl font-bold mb-4 text-center md:text-left'>Auto - Mașini</h1>

      {/* Tabs */}
      <div className='flex flex-wrap gap-2 mb-6 justify-center md:justify-start'>
        {(['sell', 'buy', 'rent', 'auction'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className='transition-all duration-200 hover:scale-105'
          >
            {tab === 'sell' ? 'Vânzare' : tab === 'buy' ? 'Cumpărare' : tab === 'rent' ? 'Închiriere' : 'Licitație'}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className='mb-6 flex gap-2 justify-center md:justify-start'>
        <AppInput
          placeholder='Caută mașini (marcă, model...)'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-1'
        />
        <AppLocationInput
          value={locationFilter.location?.address || ''}
          onChange={handleLocationChange}
          placeholder='Locație'
          className='flex-1'
          filteredCars={filteredCars}
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
                className='cursor-pointer'
                onClick={() => removeFilter(filter.key as keyof typeof filters, filter.value)}
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
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6'>
        <div className='flex items-center gap-6 col-span-full'>
          <AppSlider
            label={`Interval Preț: $${filters.priceRange[0]} - $${filters.priceRange[1]}`}
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            min={0}
            max={100000}
            step={1000}
            className='grow'
          />
          <AppSlider
            label={`Interval An: ${filters.yearRange[0]} - ${filters.yearRange[1]}`}
            value={filters.yearRange}
            onValueChange={(value) => handleFilterChange('yearRange', value)}
            min={2000}
            max={2023}
            step={1}
            className='grow'
          />
          <AppSlider
            label={`Interval Kilometraj: ${filters.mileageRange[0]} - ${filters.mileageRange[1]} km`}
            value={filters.mileageRange}
            onValueChange={(value) => handleFilterChange('mileageRange', value)}
            min={0}
            max={300000}
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
      <div className='mb-6 flex justify-center md:justify-start'>
        <div className='flex gap-2'>
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după preț' },
              { value: 'asc', label: 'Preț: Crescător' },
              { value: 'desc', label: 'Preț: Descrescător' },
            ]}
            value={sortCriteria.price || 'none'}
            onValueChange={(value) => setSortCriteria((prev) => ({ ...prev, price: value === 'none' ? null : (value as 'asc' | 'desc') }))}
            placeholder='Sortează după preț'
            className='w-full sm:w-48'
          />
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după an' },
              { value: 'asc', label: 'An: Vechi la Nou' },
              { value: 'desc', label: 'An: Nou la Vechi' },
            ]}
            value={sortCriteria.year || 'none'}
            onValueChange={(value) => setSortCriteria((prev) => ({ ...prev, year: value === 'none' ? null : (value as 'asc' | 'desc') }))}
            placeholder='Sortează după an'
            className='w-full sm:w-48'
          />
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după kilometraj' },
              { value: 'asc', label: 'Kilometraj: Crescător' },
              { value: 'desc', label: 'Kilometraj: Descrescător' },
            ]}
            value={sortCriteria.mileage || 'none'}
            onValueChange={(value) =>
              setSortCriteria((prev) => ({ ...prev, mileage: value === 'none' ? null : (value as 'asc' | 'desc') }))
            }
            placeholder='Sortează după kilometraj'
            className='w-full sm:w-48'
          />
          <AppSelect
            options={[
              { value: 'none', label: 'Sortează după dată' },
              { value: 'desc', label: 'Cele Mai Noi' },
              { value: 'asc', label: 'Cele Mai Vechi' },
            ]}
            value={sortCriteria.date || 'none'}
            onValueChange={(value) => setSortCriteria((prev) => ({ ...prev, date: value === 'none' ? null : (value as 'asc' | 'desc') }))}
            placeholder='Sortează după dată'
            className='w-full sm:w-48'
          />
        </div>
      </div>

      {/* Car List */}
      <div
        className={cn(
          'grid gap-6',
          paginatedCars.length === 1 ? 'grid-cols-1' : paginatedCars.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        )}
      >
        {paginatedCars.map((car) => (
          <Link key={car.id} href={`/categorii/auto/${car.category}/${car.id}`} className=''>
            <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4'>
              <Image src={car.images[0]} alt={car.title} width={400} height={192} className='w-full h-48 object-cover' />
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg font-semibold line-clamp-2'>{car.title}</CardTitle>
                  <Badge variant={car.category === 'auction' ? 'destructive' : 'secondary'} className='ml-2'>
                    {car.category === 'sell'
                      ? 'Vânzare'
                      : car.category === 'buy'
                      ? 'Cumpărare'
                      : car.category === 'rent'
                      ? 'Închiriere'
                      : 'Licitație'}
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
