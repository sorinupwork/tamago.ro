'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { mockCars } from '@/lib/mockData';

export default function AutoPage() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy' | 'rent' | 'auction'>('sell');
  const cars = mockCars;
  const [filters, setFilters] = useState({
    minEngineCapacity: '',
    maxEngineCapacity: '',
    minHorsepower: '',
    maxHorsepower: '',
    status: '',
    brand: '',
    location: '',
    fuel: [] as string[],
    transmission: [] as string[],
    bodyType: [] as string[],
    color: [] as string[],
    priceRange: [0, 100000],
    yearRange: [2000, 2023],
    mileageRange: [0, 300000],
    engineCapacityRange: [0, 5000], // Assuming max 5000cc
    horsepowerRange: [0, 1000], // Assuming max 1000hp
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
    date: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters and sorts
  const filteredCars = useMemo(() => {
    let filtered = cars.filter((car) => car.category === activeTab);
    // New range filters
    const minEC = filters.minEngineCapacity ? parseInt(filters.minEngineCapacity) : filters.engineCapacityRange[0];
    const maxEC = filters.maxEngineCapacity ? parseInt(filters.maxEngineCapacity) : filters.engineCapacityRange[1];
    const minHP = filters.minHorsepower ? parseInt(filters.minHorsepower) : filters.horsepowerRange[0];
    const maxHP = filters.maxHorsepower ? parseInt(filters.maxHorsepower) : filters.horsepowerRange[1];
    filtered = filtered.filter((car) => (car.engineCapacity || 0) >= minEC && (car.engineCapacity || 0) <= maxEC);
    filtered = filtered.filter((car) => (car.horsepower || 0) >= minHP && (car.horsepower || 0) <= maxHP);
    if (filters.status) filtered = filtered.filter((car) => car.status === filters.status);
    // Use sliders
    filtered = filtered.filter((car) => car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]);
    filtered = filtered.filter((car) => car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1]);
    filtered = filtered.filter((car) => car.mileage >= filters.mileageRange[0] && car.mileage <= filters.mileageRange[1]);
    if (filters.brand) filtered = filtered.filter((car) => car.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    if (filters.location) filtered = filtered.filter((car) => car.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (searchQuery)
      filtered = filtered.filter(
        (car) => car.title.toLowerCase().includes(searchQuery.toLowerCase()) || car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (filters.fuel.length > 0) filtered = filtered.filter((car) => filters.fuel.includes(car.fuel));
    if (filters.transmission.length > 0) filtered = filtered.filter((car) => filters.transmission.includes(car.transmission));
    if (filters.bodyType.length > 0) filtered = filtered.filter((car) => filters.bodyType.includes(car.bodyType));
    if (filters.color.length > 0) filtered = filtered.filter((car) => filters.color.includes(car.color));

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
  }, [cars, activeTab, filters, sortCriteria, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      location: '',
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
    setSearchQuery('');
  };

  const appliedFilters = [
    ...filters.fuel.map((f) => ({ key: 'fuel', value: f, label: `Combustibil: ${f}` })),
    ...filters.transmission.map((t) => ({ key: 'transmission', value: t, label: `Transmisie: ${t}` })),
    ...filters.bodyType.map((b) => ({ key: 'bodyType', value: b, label: `Caroserie: ${b}` })),
    ...filters.color.map((c) => ({ key: 'color', value: c, label: `Culoare: ${c}` })),
    ...(filters.brand ? [{ key: 'brand', value: filters.brand, label: `Marcă: ${filters.brand}` }] : []),
    ...(filters.location ? [{ key: 'location', value: filters.location, label: `Locație: ${filters.location}` }] : []),
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
  ];

  return (
    <div className='container mx-auto p-4 max-w-7xl'>
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
        <Input
          type='text'
          placeholder='Caută mașini (marcă, model...)'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full max-w-sm'
        />
        <Input
          type='text'
          placeholder='Locație'
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className='w-full max-w-sm'
        />
        <Button variant='default'>Caută</Button>
      </div>

      {/* Applied Filters Tags */}
      {appliedFilters.length > 0 && (
        <div className='mb-4 flex flex-wrap gap-2'>
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
        </div>
      )}

      {/* Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
        <Input
          type='number'
          placeholder='Capacitate Motor Min (cc)'
          value={filters.minEngineCapacity}
          onChange={(e) => handleFilterChange('minEngineCapacity', e.target.value)}
        />
        <Input
          type='number'
          placeholder='Capacitate Motor Max (cc)'
          value={filters.maxEngineCapacity}
          onChange={(e) => handleFilterChange('maxEngineCapacity', e.target.value)}
        />
        <Input
          type='number'
          placeholder='Cai Putere Min'
          value={filters.minHorsepower}
          onChange={(e) => handleFilterChange('minHorsepower', e.target.value)}
        />
        <Input
          type='number'
          placeholder='Cai Putere Max'
          value={filters.maxHorsepower}
          onChange={(e) => handleFilterChange('maxHorsepower', e.target.value)}
        />
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='new'>Nou</SelectItem>
            <SelectItem value='used'>Second Hand</SelectItem>
            <SelectItem value='damaged'>Deteriorat</SelectItem>
          </SelectContent>
        </Select>
        <Input type='text' placeholder='Marcă' value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)} />
        <div>
          <label className='text-sm font-medium'>
            Interval Preț: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            max={100000}
            min={0}
            step={1000}
            className='mt-2'
          />
        </div>
        <div>
          <label className='text-sm font-medium'>
            Interval An: {filters.yearRange[0]} - {filters.yearRange[1]}
          </label>
          <Slider
            value={filters.yearRange}
            onValueChange={(value) => handleFilterChange('yearRange', value)}
            max={2023}
            min={2000}
            step={1}
            className='mt-2'
          />
        </div>
        <div>
          <label className='text-sm font-medium'>
            Interval Kilometraj: {filters.mileageRange[0]} - {filters.mileageRange[1]} km
          </label>
          <Slider
            value={filters.mileageRange}
            onValueChange={(value) => handleFilterChange('mileageRange', value)}
            max={300000}
            min={0}
            step={5000}
            className='mt-2'
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start'>
              Tip Combustibil ({filters.fuel.length} selectat{filters.fuel.length !== 1 ? 'e' : ''})
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56'>
            <div className='flex flex-col gap-2'>
              {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
                <div key={fuel} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.fuel.includes(fuel)}
                    onCheckedChange={(checked) => handleMultiFilterChange('fuel', fuel, checked as boolean)}
                  />
                  <label>
                    {fuel === 'Petrol' ? 'Benzină' : fuel === 'Diesel' ? 'Motorină' : fuel === 'Hybrid' ? 'Hibrid' : 'Electric'}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start'>
              Transmisie ({filters.transmission.length} selectat{filters.transmission.length !== 1 ? 'e' : ''})
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56'>
            <div className='flex flex-col gap-2'>
              {['Manual', 'Automatic'].map((trans) => (
                <div key={trans} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.transmission.includes(trans)}
                    onCheckedChange={(checked) => handleMultiFilterChange('transmission', trans, checked as boolean)}
                  />
                  <label>{trans === 'Manual' ? 'Manuală' : 'Automată'}</label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start'>
              Tip Caroserie ({filters.bodyType.length} selectat{filters.bodyType.length !== 1 ? 'e' : ''})
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56'>
            <div className='flex flex-col gap-2'>
              {['SUV', 'Sedan', 'Hatchback', 'Coupe'].map((body) => (
                <div key={body} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.bodyType.includes(body)}
                    onCheckedChange={(checked) => handleMultiFilterChange('bodyType', body, checked as boolean)}
                  />
                  <label>{body}</label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start'>
              Culoare ({filters.color.length} selectat{filters.color.length !== 1 ? 'e' : ''})
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56'>
            <div className='flex flex-col gap-2'>
              {['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray', 'Green'].map((color) => (
                <div key={color} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={filters.color.includes(color)}
                    onCheckedChange={(checked) => handleMultiFilterChange('color', color, checked as boolean)}
                  />
                  <label>
                    {color === 'Black'
                      ? 'Negru'
                      : color === 'White'
                      ? 'Alb'
                      : color === 'Silver'
                      ? 'Argintiu'
                      : color === 'Blue'
                      ? 'Albastru'
                      : color === 'Red'
                      ? 'Roșu'
                      : color === 'Gray'
                      ? 'Gri'
                      : 'Verde'}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Sort */}
      <div className='mb-6 flex justify-center md:justify-start'>
        <div className='flex gap-2'>
          <Select
            value={sortCriteria.price || 'none'}
            onValueChange={(value) => setSortCriteria((prev) => ({ ...prev, price: value === 'none' ? null : (value as 'asc' | 'desc') }))}
          >
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='Sortează după preț' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>Niciunul</SelectItem>
              <SelectItem value='asc'>Preț: Crescător</SelectItem>
              <SelectItem value='desc'>Preț: Descrescător</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortCriteria.year || 'none'}
            onValueChange={(value) => setSortCriteria((prev) => ({ ...prev, year: value === 'none' ? null : (value as 'asc' | 'desc') }))}
          >
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='Sortează după an' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>Niciunul</SelectItem>
              <SelectItem value='asc'>An: Vechi la Nou</SelectItem>
              <SelectItem value='desc'>An: Nou la Vechi</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortCriteria.mileage || 'none'}
            onValueChange={(value) =>
              setSortCriteria((prev) => ({ ...prev, mileage: value === 'none' ? null : (value as 'asc' | 'desc') }))
            }
          >
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='Sortează după kilometraj' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>Niciunul</SelectItem>
              <SelectItem value='asc'>Kilometraj: Crescător</SelectItem>
              <SelectItem value='desc'>Kilometraj: Descrescător</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortCriteria.date || 'none'}
            onValueChange={(value) => setSortCriteria((prev) => ({ ...prev, date: value === 'none' ? null : (value as 'asc' | 'desc') }))}
          >
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder='Sortează după dată' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>Niciunul</SelectItem>
              <SelectItem value='desc'>Cele Mai Noi</SelectItem>
              <SelectItem value='asc'>Cele Mai Vechi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Car List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {paginatedCars.map((car) => (
          <Link key={car.id} href={`/categorii/auto/${car.category}/${car.id}`}>
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
      {totalPages > 1 && (
        <Pagination className='mt-8'>
          <PaginationContent className='flex-wrap justify-center'>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
