import { Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import AppInput from '@/components/custom/input/AppInput';
import AppSelectInput from '@/components/custom/input/AppSelectInput';

type PostsFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
};

export default function PostsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: PostsFiltersProps) {
  const categoryOptions = [
    { value: 'all', label: 'Toate Categoriile' },
    { value: 'sell', label: 'Vânzare' },
    { value: 'buy', label: 'Cumpărare' },
    { value: 'auction', label: 'Licitație' },
    { value: 'rent', label: 'Închiriere' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Toate Statusurile' },
    { value: 'active', label: 'Activ' },
    { value: 'draft', label: 'Schiță' },
    { value: 'sold', label: 'Vândut' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Sortează după Dată' },
    { value: 'views', label: 'Sortează după Vizualizări' },
  ];

  return (
    <Card className='w-full p-4 rounded-xl'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <AppInput
          type='text'
          placeholder='Caută postări...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='flex-1'
          leftIcon={Search}
        />
        <AppSelectInput
          options={categoryOptions}
          value={categoryFilter}
          onValueChange={(value) => onCategoryChange(value as string)}
          placeholder='Toate Categoriile'
          className='flex-1'
        />
        <AppSelectInput
          options={statusOptions}
          value={statusFilter}
          onValueChange={(value) => onStatusChange(value as string)}
          placeholder='Toate Statusurile'
          className='flex-1'
        />
        <AppSelectInput
          options={sortOptions}
          value={sortBy}
          onValueChange={(value) => onSortChange(value as string)}
          placeholder='Sortează după Dată'
          className='flex-1'
        />
      </div>
    </Card>
  );
}
