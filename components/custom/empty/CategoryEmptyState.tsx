'use client';

import { useRouter } from 'next/navigation';
import { Plus, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

type CategoryEmptyStateProps = {
  activeTab: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

const tabToOfertaMap: Record<string, string> = {
  sell: 'oferta',
  buy: 'cauta',
  rent: 'inchiriere',
  auction: 'licitatie',
};

export default function CategoryEmptyState({
  activeTab,
  title = 'Nicio mașină disponibilă',
  description = 'Nu am găsit mașini care să corespundă criteriilor tale. Încearcă să modifici filtrele sau adaugă un nou anunț.',
  buttonLabel = 'Adaugă anunț',
  onButtonClick,
}: CategoryEmptyStateProps) {
  const router = useRouter();
  const ofertaType = tabToOfertaMap[activeTab] || 'oferta';

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      router.push(`/categorii?tip=${ofertaType}`);
    }
  };

  return (
    <Empty variant='outline' className='col-span-full'>
      <EmptyHeader>
        <EmptyMedia>
          <AlertCircle className='h-6 w-6' />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button onClick={handleClick} className='mt-4 gap-2'>
        <Plus className='h-4 w-4' />
        {buttonLabel}
      </Button>
    </Empty>
  );
}
