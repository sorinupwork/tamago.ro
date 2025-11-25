'use client';

import React, { useState } from 'react';
import { PlusCircle, Trash } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppInput from '@/components/custom/input/AppInput';
import AppSelectInput from '@/components/custom/input/AppSelectInput';
import type { CarHistoryItem } from '@/lib/types';

type Option = { value: string; label: React.ReactNode; icon?: LucideIcon };

type Props = {
  history: CarHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<CarHistoryItem[]>>;
  iconOptions: Option[];
  className?: string;
  label?: string;
};

export default function CarHighlightsForm({ history, setHistory, iconOptions, className = '', label = 'Istoric Mașină' }: Props) {
  const [histTitle, setHistTitle] = useState('');
  const [histDesc, setHistDesc] = useState('');
  const [histIcon, setHistIcon] = useState<string>(iconOptions?.[0]?.value ?? 'Wrench');

  return (
    <div className={className}>
      <h4 className='text-sm font-semibold mb-2'>{label}</h4>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 items-end'>
        <AppInput value={histTitle} onChange={(e) => setHistTitle(e.target.value)} label='Titlu' placeholder='Ex: Revizie generală' />
        <AppSelectInput
          options={iconOptions}
          value={histIcon}
          onValueChange={(v) => setHistIcon(v as string)}
          placeholder='Selectați icon'
          label='Tag'
        />

        <div className='col-span-1 md:col-span-2 flex items-end gap-2'>
          <AppInput
            value={histDesc}
            onChange={(e) => setHistDesc(e.target.value)}
            label='Scurtă descriere'
            placeholder='Ex: Revizie la 60.000 km'
          />
          <Button
            type='button'
            variant={'secondary'}
            onClick={() => {
              if (!histTitle) return;
              setHistory((h) => [...h, { title: histTitle, description: histDesc, icon: histIcon }]);
              setHistTitle('');
              setHistDesc('');
            }}
          >
            <PlusCircle className='w-4 h-4' /> Adaugă
          </Button>
        </div>
        <div className='flex flex-wrap gap-2 col-span-full'>
          {history.map((h, i) => (
            <div key={i} className='flex items-center gap-2 rounded border px-2 py-1'>
              <span className='text-sm font-medium'>{h.title}</span>
              <Button type='button' variant={'ghost'} size={'sm'} onClick={() => setHistory((prev) => prev.filter((_, idx) => idx !== i))}>
                <Trash className='w-3 h-3' />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
