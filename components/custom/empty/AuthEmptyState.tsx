'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

type AuthEmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onLoginClick?: () => void;
};

const defaultText = {
  title: 'Conectează-te pentru a continua',
  description: 'Trebuie să fii conectat pentru a accesa această funcție. Conectează-te pentru a începe.',
  buttonLabel: 'Conectează-te',
};

export default function AuthEmptyState({
  icon: Icon,
  title = defaultText.title,
  description = defaultText.description,
  buttonLabel = defaultText.buttonLabel,
  onLoginClick,
}: AuthEmptyStateProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/cont');
    }
  };

  return (
    <div className='min-h-[300px] flex items-center justify-center'>
      <Empty>
        <EmptyHeader>
          {Icon && (
            <EmptyMedia>
              <Icon className='w-12 h-12 p-2' />
            </EmptyMedia>
          )}
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <Button onClick={handleClick} className='mt-4'>
          {buttonLabel}
        </Button>
      </Empty>
    </div>
  );
}
