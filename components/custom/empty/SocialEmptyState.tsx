'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

type SocialEmptyStateProps = {
  type?: 'posts' | 'polls' | 'stories' | 'feed';
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonLabel?: string;
};

const defaultTexts: Record<string, { title: string; description: string; buttonLabel: string }> = {
  posts: {
    title: 'Nu există postări încă',
    description: 'Fii primul care creează o postare și începe conversația!',
    buttonLabel: 'Creează o Postare',
  },
  polls: {
    title: 'Nu există sondaje încă',
    description: 'Fii primul care creează un sondaj și angajează comunitatea!',
    buttonLabel: 'Creează un Sondaj',
  },
  stories: {
    title: 'Nu există povești încă',
    description: 'Fii primul care împărtășește o poveste și angajează comunitatea!',
    buttonLabel: 'Adaugă o Poveste',
  },
  feed: {
    title: 'Nu există conținut în feed',
    description: 'Fii activ și angajează-te cu comunitatea pentru a vedea mai mult conținut!',
    buttonLabel: 'Explorează Categorii',
  },
};

export default function SocialEmptyState({
  type = 'feed',
  title,
  description,
  showButton = true,
  buttonLabel,
}: SocialEmptyStateProps) {
  const router = useRouter();
  const config = defaultTexts[type] || defaultTexts.feed;

  const handleClick = () => {
    if (type === 'feed') {
      router.push('/categorii');
    }
  };

  return (
    <Empty variant='outline'>
      <EmptyHeader>
        <EmptyMedia>
          <MessageSquare className='h-6 w-6' />
        </EmptyMedia>
        <EmptyTitle>{title || config.title}</EmptyTitle>
        <EmptyDescription>{description || config.description}</EmptyDescription>
      </EmptyHeader>
      {showButton && type === 'feed' && (
        <Button onClick={handleClick} className='mt-4 gap-2'>
          {buttonLabel || config.buttonLabel}
        </Button>
      )}
    </Empty>
  );
}
