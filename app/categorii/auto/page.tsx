'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Car, mockCars } from '@/lib/mockData';

export default function AutoPage() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy' | 'rent' | 'auction'>('sell');
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    brand: '',
    minMileage: '',
    maxMileage: '',
    fuel: '',
    transmission: '',
    location: '',
    bodyType: '',
    color: '',
    priceRange: [0, 100000],
    yearRange: [2000, 2023],
    mileageRange: [0, 300000],
  });
  const [sortBy, setSortBy] = useState<
    | 'price-asc'
    | 'price-desc'
    | 'year-asc'
    | 'year-desc'
    | 'mileage-asc'
    | 'mileage-desc'
    | 'fuel-asc'
    | 'transmission-asc'
    | 'bodyType-asc'
    | 'color-asc'
    | 'date-desc'
    | 'brand-asc'
    | 'location-asc'
  >('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Apply filters and sorts
  const filteredCars = useMemo(() => {
    let filtered = cars.filter((car) => car.category === activeTab);
    // Use inputs if set, else sliders
    const minP = filters.minPrice ? parseInt(filters.minPrice) : filters.priceRange[0];
    const maxP = filters.maxPrice ? parseInt(filters.maxPrice) : filters.priceRange[1];
    const minY = filters.minYear ? parseInt(filters.minYear) : filters.yearRange[0];
    const maxY = filters.maxYear ? parseInt(filters.maxYear) : filters.yearRange[1];
    const minM = filters.minMileage ? parseInt(filters.minMileage) : filters.mileageRange[0];
    const maxM = filters.maxMileage ? parseInt(filters.maxMileage) : filters.mileageRange[1];
    filtered = filtered.filter((car) => car.price >= minP && car.price <= maxP);
    filtered = filtered.filter((car) => car.year >= minY && car.year <= maxY);
    filtered = filtered.filter((car) => car.mileage >= minM && car.mileage <= maxM);
    if (filters.brand) filtered = filtered.filter((car) => car.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    if (filters.fuel) filtered = filtered.filter((car) => car.fuel === filters.fuel);
    if (filters.transmission) filtered = filtered.filter((car) => car.transmission === filters.transmission);
    if (filters.location) filtered = filtered.filter((car) => car.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.bodyType) filtered = filtered.filter((car) => car.bodyType === filters.bodyType);
    if (filters.color) filtered = filtered.filter((car) => car.color === filters.color);

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'year-asc') return a.year - b.year;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
      if (sortBy === 'mileage-desc') return b.mileage - a.mileage;
      if (sortBy === 'fuel-asc') return a.fuel.localeCompare(b.fuel);
      if (sortBy === 'transmission-asc') return a.transmission.localeCompare(b.transmission);
      if (sortBy === 'bodyType-asc') return a.bodyType.localeCompare(b.bodyType);
      if (sortBy === 'color-asc') return a.color.localeCompare(b.color);
      if (sortBy === 'brand-asc') return a.brand.localeCompare(b.brand);
      if (sortBy === 'location-asc') return a.location.localeCompare(b.location);
      if (sortBy === 'date-desc') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });

    return filtered;
  }, [cars, activeTab, filters, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className='container mx-auto p-4 max-w-7xl'>
      {/* Breadcrumbs */}
      <Breadcrumb className='mb-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Acasă</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/categorii'>Categorii</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Auto</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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

      {/* Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
        <Input
          type='number'
          placeholder='Preț Minim'
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        <Input
          type='number'
          placeholder='Preț Maxim'
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
        <Input
          type='number'
          placeholder='An Minim'
          value={filters.minYear}
          onChange={(e) => handleFilterChange('minYear', e.target.value)}
        />
        <Input
          type='number'
          placeholder='An Maxim'
          value={filters.maxYear}
          onChange={(e) => handleFilterChange('maxYear', e.target.value)}
        />
        <Input
          type='number'
          placeholder='Kilometraj Minim'
          value={filters.minMileage}
          onChange={(e) => handleFilterChange('minMileage', e.target.value)}
        />
        <Input
          type='number'
          placeholder='Kilometraj Maxim'
          value={filters.maxMileage}
          onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
        />
        <Input type='text' placeholder='Marcă' value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)} />
        <Input
          type='text'
          placeholder='Locație'
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
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
        <Select value={filters.fuel} onValueChange={(value) => handleFilterChange('fuel', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Tip Combustibil' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Petrol'>Benzină</SelectItem>
            <SelectItem value='Diesel'>Motorină</SelectItem>
            <SelectItem value='Hybrid'>Hibrid</SelectItem>
            <SelectItem value='Electric'>Electric</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.transmission} onValueChange={(value) => handleFilterChange('transmission', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Transmisie' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Manual'>Manuală</SelectItem>
            <SelectItem value='Automatic'>Automată</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.bodyType} onValueChange={(value) => handleFilterChange('bodyType', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Tip Caroserie' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='SUV'>SUV</SelectItem>
            <SelectItem value='Sedan'>Sedan</SelectItem>
            <SelectItem value='Hatchback'>Hatchback</SelectItem>
            <SelectItem value='Coupe'>Coupe</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Culoare' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Black'>Negru</SelectItem>
            <SelectItem value='White'>Alb</SelectItem>
            <SelectItem value='Silver'>Argintiu</SelectItem>
            <SelectItem value='Blue'>Albastru</SelectItem>
            <SelectItem value='Red'>Roșu</SelectItem>
            <SelectItem value='Gray'>Gri</SelectItem>
            <SelectItem value='Green'>Verde</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className='mb-6 flex justify-center md:justify-start'>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue placeholder='Sortează după' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='price-asc'>Preț: Crescător</SelectItem>
            <SelectItem value='price-desc'>Preț: Descrescător</SelectItem>
            <SelectItem value='year-asc'>An: Vechi la Nou</SelectItem>
            <SelectItem value='year-desc'>An: Nou la Vechi</SelectItem>
            <SelectItem value='mileage-asc'>Kilometraj: Crescător</SelectItem>
            <SelectItem value='mileage-desc'>Kilometraj: Descrescător</SelectItem>
            <SelectItem value='fuel-asc'>Combustibil: A-Z</SelectItem>
            <SelectItem value='transmission-asc'>Transmisie: A-Z</SelectItem>
            <SelectItem value='bodyType-asc'>Caroserie: A-Z</SelectItem>
            <SelectItem value='color-asc'>Culoare: A-Z</SelectItem>
            <SelectItem value='brand-asc'>Marcă: A-Z</SelectItem>
            <SelectItem value='location-asc'>Locație: A-Z</SelectItem>
            <SelectItem value='date-desc'>Cele Mai Noi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Car List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {paginatedCars.map((car) => (
          <Link key={car.id} href={`/categorii/auto/${car.category}/${car.id}`}>
            <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4'>
              <img src={car.images[0]} alt={car.title} className='w-full h-48 object-cover' />
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
