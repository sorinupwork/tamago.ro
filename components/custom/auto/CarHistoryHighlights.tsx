import type { LucideIcon } from 'lucide-react';
import { Calendar, Wrench, FileText, Droplet, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Timeline from '@/components/custom/timeline/Timeline';
import type { Car, CarHistoryItem } from '@/lib/types';

type CarHistoryHighlightsProps = {
  car?: Car;
  features?: string[];
  items?: CarHistoryItem[];
};

const ICON_MAP: { [key: string]: LucideIcon } = {
  Wrench,
  FileText,
  Droplet,
  Calendar,
};

export default function CarHistoryHighlights({ car, features, items }: CarHistoryHighlightsProps) {
  console.log('car', car);

  const historyItems =
    items && items.length > 0
      ? items.map((i) => ({
          icon: ICON_MAP[i.icon || 'FileText'] || FileText,
          label: i.title,
          value: i.description || '',
          year: i.year ?? (car ? car.year : undefined),
        }))
      : car
        ? [
            {
              icon: FileText,
              label: 'RAR',
              value: `Valabil până în ${car.year + 2}`,
              year: car.year,
            },
            {
              icon: Wrench,
              label: 'Revizie',
              value: `Ultima la ${Math.floor(car.mileage / 15000) * 15000} km`,
              year: car.year + Math.floor(car.mileage / 15000),
            },
            {
              icon: Droplet,
              label: 'Schimb Ulei',
              value: `Ultimul la ${Math.floor(car.mileage / 10000) * 10000} km`,
              year: car.year + Math.floor(car.mileage / 10000),
            },
          ].sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
        : [];

  if (historyItems.length === 0) return null;

  const previewItem = historyItems[0];
  const remainingItems = historyItems.slice(1);

  return (
    <Collapsible className='w-full group'>
      <div className='relative mb-4'>
        <CollapsibleTrigger className='text-sm font-semibold text-left justify-start flex-1 mb-2 flex items-center'>
          <Calendar className='h-4 w-4 mr-2 inline-block' />
          Vezi Mai Multe Istoric
          <ChevronDown className='ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180' />
        </CollapsibleTrigger>

        <div className='relative mb-4'>
          <Timeline
            items={[
              {
                ...previewItem,
                extraInfo: undefined,
              },
            ]}
            contentClassName='group-data-[state=closed]:overflow-hidden group-data-[state=closed]:[mask-image:linear-gradient(to_top,transparent_2px,black_80px)] transition-all duration-300'
          />
        </div>

        <CollapsibleContent className='transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-bottom-2'>
          <Timeline items={remainingItems} />
          {features && features.length > 0 && (
            <div className='mt-4'>
              <h5 className='text-sm font-semibold mb-2'>Descriere Istoric:</h5>
              <ul className='text-sm text-muted-foreground list-disc list-inside'>
                {features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
