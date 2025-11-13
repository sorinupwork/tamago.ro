'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangleIcon } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/custom/empty/Empty';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className='flex grow items-center justify-center bg-background p-4'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangleIcon className="size-8 text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Eroare</EmptyTitle>
          <EmptyDescription>
            Ceva nu a mers bine. Încearcă să reîncarci pagina.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={reset} variant='secondary'>
            Încearcă din nou
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
