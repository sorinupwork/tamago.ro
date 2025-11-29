'use client';

import { AlertCircle } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

type FormNotReadyEmptyStateProps = {
  subcategoryName?: string;
  title?: string;
  description?: string;
};

export default function FormNotReadyEmptyState({
  subcategoryName,
  title = 'Formularul nu este disponibil',
  description = 'Pentru această subcategorie încă nu am pregătit formularul. Revino în curând!',
}: FormNotReadyEmptyStateProps) {
  return (
    <Empty variant='outline' className='col-span-full'>
      <EmptyHeader>
        <EmptyMedia>
          <AlertCircle className='h-6 w-6' />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {subcategoryName
            ? `Formularul pentru "${subcategoryName}" încă nu este disponibil. Revino în curând!`
            : description}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
