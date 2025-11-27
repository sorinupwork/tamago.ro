import { Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import AppInput from '@/components/custom/input/AppInput';
import AppSelectInput from '@/components/custom/input/AppSelectInput';
import AppCheckbox from '@/components/custom/input/AppCheckbox';

type FeedFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  showPosts: boolean;
  showPolls: boolean;
  onFilterToggle: (which: 'posts' | 'polls', value: boolean) => void;
};

export default function FeedFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showPosts,
  showPolls,
  onFilterToggle,
}: FeedFiltersProps) {
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'comments', label: 'Most Commented' },
    { value: 'views', label: 'Most Viewed' },
  ];

  return (
    <Card className='w-full p-4 rounded-xl'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <AppInput
            type='text'
            placeholder='Search in feed...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='flex-1'
            leftIcon={Search}
          />
          <AppSelectInput
            options={sortOptions}
            value={sortBy}
            onValueChange={(value) => onSortChange(value as string)}
            placeholder='Sort by Date'
            className='flex-1'
          />
        </div>

        <div className='flex flex-wrap gap-6'>
          <div className='flex items-center gap-3'>
            <AppCheckbox
              label='Posts'
              value={showPosts}
              onChange={(value) => onFilterToggle('posts', value as boolean)}
              htmlFor='posts-filter'
            />
          </div>
          <div className='flex items-center gap-3'>
            <AppCheckbox
              label='Polls'
              value={showPolls}
              onChange={(value) => onFilterToggle('polls', value as boolean)}
              htmlFor='polls-filter'
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
