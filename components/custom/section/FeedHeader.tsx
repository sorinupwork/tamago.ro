'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageSquare, Search } from 'lucide-react';

import AppInput from '../input/AppInput';
import AppSelectInput from '../input/AppSelectInput';
import AppCheckbox from '../input/AppCheckbox';

export default function FeedHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('tags') || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('type') === 'both'
      ? ['post', 'poll']
      : searchParams.get('type') === 'post'
        ? ['post']
        : searchParams.get('type') === 'poll'
          ? ['poll']
          : ['post', 'poll']
  );
  const [sort, setSort] = useState(searchParams.get('sortBy') || 'newest');

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleTypeChange = (value: boolean | string[]) => {
    const types = value as string[];
    setSelectedTypes(types);
    const type = types.length === 2 ? 'both' : types.length === 1 ? types[0] : 'both';
    updateParams('type', type);
  };

  return (
    <div className='flex flex-row items-center justify-between gap-4 flex-wrap'>
      <div className='flex items-center gap-2 flex-1 min-w-0'>
        <MessageSquare className='w-5 h-5' />
        <span className='font-semibold'>Feed</span>
        <div className='flex-1 min-w-0'>
          <AppInput
            leftIcon={Search}
            placeholder='Caută după tag-uri (separate prin virgulă)'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateParams('tags', e.target.value);
            }}
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <AppCheckbox
          multiple={true}
          options={[
            { value: 'post', label: 'Postări' },
            { value: 'poll', label: 'Sondaje' },
          ]}
          value={selectedTypes}
          onChange={handleTypeChange}
          orientation='horizontal'
        />
        <AppSelectInput
          options={[
            { value: 'newest', label: 'Cele mai noi' },
            { value: 'latest', label: 'Cele mai vechi' },
          ]}
          value={sort}
          onValueChange={(v) => {
            setSort(v as string);
            updateParams('sortBy', v as string);
          }}
          placeholder='Sortează după'
        />
      </div>
    </div>
  );
}
