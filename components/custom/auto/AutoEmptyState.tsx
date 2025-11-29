'use client';

import { useRouter } from 'next/navigation';
import { Plus, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/custom/empty/Empty';

type AutoEmptyStateProps = {
  activeTab: string;
};

const tabToOfertaMap: Record<string, string> = {
  sell: 'oferta',
  buy: 'cauta',
  rent: 'inchiriere',
  auction: 'licitatie',
};

export default function AutoEmptyState({ activeTab }: AutoEmptyStateProps) {
  const router = useRouter();
  const ofertaType = tabToOfertaMap[activeTab] || 'oferta';

  const handleAddListing = () => {
    router.push(`/categorii?tip=${ofertaType}`);
  };

  return (
    <Empty variant='outline' className='col-span-full'>
      <EmptyHeader>
        <EmptyMedia>
          <AlertCircle className='h-6 w-6' />
        </EmptyMedia>
        <EmptyTitle>Nicio mașină disponibilă</EmptyTitle>
        <EmptyDescription>
          Nu am găsit mașini care să corespundă criteriilor tale. Încearcă să modifici filtrele sau adaugă un nou anunț.
        </EmptyDescription>
      </EmptyHeader>
      <Button onClick={handleAddListing} className='mt-4 gap-2'>
        <Plus className='h-4 w-4' />
        Adaugă anunț
      </Button>
    </Empty>
  );
}
