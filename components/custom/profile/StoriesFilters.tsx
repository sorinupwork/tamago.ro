import { Card } from '@/components/ui/card';
import AppSelectInput from '@/components/custom/input/AppSelectInput';

type StoriesFiltersProps = {
  sortBy: string;
  onSortChange: (value: string) => void;
};

export default function StoriesFilters({ sortBy, onSortChange }: StoriesFiltersProps) {
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'expiresAt', label: 'Expiring Soon' },
  ];

  return (
    <Card className='w-full p-4 rounded-xl'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h3 className='text-lg font-semibold'>Your Stories</h3>
        <AppSelectInput
          options={sortOptions}
          value={sortBy}
          onValueChange={(value) => onSortChange(value as string)}
          placeholder='Sort by Date'
          className='flex-1 sm:w-40'
        />
      </div>
    </Card>
  );
}
