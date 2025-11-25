import { ReactNode } from 'react';
import { Eye, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export type TimelineItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  year?: number;
  extraInfo?: ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
  contentClassName?: string;
};

export default function Timeline({ items, className = '', contentClassName = '' }: TimelineProps) {
  return (
    <div className={`relative pl-6 ${className}`}>
      <div className='absolute left-9 top-0 bottom-0 w-0.5 bg-primary' />

      {items.map((item, i) => (
        <div key={i} className='relative mb-4 last:mb-0'>
          <div className='absolute left-3 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md z-10 hover:scale-110 transition-transform duration-200'>
            <item.icon className='h-6 w-6 text-white' />
          </div>

          <div className='absolute left-10 top-6 w-8 h-0.5 bg-primary' />

          <div className={`mt-4 ml-20 bg-background p-4 rounded-lg shadow-md border flex justify-between items-start ${contentClassName}`}>
            <div>
              <p className='font-bold text-sm'>
                {item.label} {item.year ? `(${item.year})` : ''}
              </p>
              <p className='text-xs text-muted-foreground'>{item.value}</p>
              {item.extraInfo && <div className='mt-3'>{item.extraInfo}</div>}
            </div>

            <Button className='px-4 py-2' variant={'ghost'} onClick={() => toast('Coming soon: documents to upload etc.')}>
              <Eye className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
