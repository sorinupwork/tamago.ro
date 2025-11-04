'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categoryMapping, categoryLabels } from '@/lib/categories';

type Props = {
  activeTab: keyof typeof categoryMapping;
  onChange: (tab: keyof typeof categoryMapping) => void;
  className?: string;
};

export const AutoTabs: React.FC<Props> = ({ activeTab, onChange, className }) => {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onChange(v as keyof typeof categoryMapping)} className={`w-full ${className}`}>
      <TabsList className='grid w-full grid-cols-4 h-12 gap-2 bg-muted/50'>
        {(Object.keys(categoryMapping) as (keyof typeof categoryMapping)[]).map((tab) => {
          const mapped = categoryMapping[tab as keyof typeof categoryMapping];
          const label = categoryLabels[mapped as keyof typeof categoryLabels] ?? String(tab);
          return (
            <TabsTrigger
              key={tab}
              value={tab}
              className='text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-black'
            >
              {label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
