import React from 'react';
import { Search } from 'lucide-react';

import { AppInput } from '@/components/custom/input/AppInput';
import { AppSelect } from '@/components/custom/select/AppSelect';

type ChatFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
};

export const ChatFilters: React.FC<ChatFiltersProps> = ({ search, setSearch, sort, setSort }) => {
  return (
    <>
      <AppInput
        placeholder='Caută utilizatori...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={Search}
        className='mb-4'
      />
      <div className='flex gap-2 mb-4'>
        <AppSelect
          options={[
            { value: 'name', label: 'După nume' },
            { value: 'status', label: 'După status' },
          ]}
          value={sort}
          onValueChange={setSort}
          placeholder='Sortează'
          className='w-full'
        />
      </div>
    </>
  );
};
