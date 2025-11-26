import { Award, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ProgressSummaryProps = {
  posts: number;
  friends: number;
  points: number;
  verification?: number;
  onOpenDialog: () => void;
  defaultValue?: string;
};

export default function ProgressSummary({ posts, friends, points, verification = 0, onOpenDialog, defaultValue }: ProgressSummaryProps) {
  return (
    <Accordion type='single' collapsible defaultValue={defaultValue} className='w-full'>
      <AccordionItem value='progress' className='rounded-xl border-0 bg-white/80 dark:bg-gray-800/80 shadow-md'>
        <AccordionTrigger className='text-sm font-semibold px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl'>
          <Award className='h-4 w-4 mr-2 text-secondary' />
          Progres Summary
        </AccordionTrigger>
        <AccordionContent className='px-4 pb-4 space-y-4'>
          <div>
            <div className='flex justify-between text-xs mb-2'>
              <span className='font-medium'>Postări (Listări Vânzări)</span>
              <span className='text-muted-foreground'>{Math.min(posts, 4)}/4</span>
            </div>
            <Progress value={Math.min((posts / 4), 1) * 100} className='h-3 bg-gray-200 dark:bg-gray-700' />
          </div>
          <div>
            <div className='flex justify-between text-xs mb-2'>
              <span className='font-medium'>Prieteni (Rețea Socială)</span>
              <span className='text-muted-foreground'>{Math.min(friends, 10)}/10</span>
            </div>
            <Progress value={Math.min((friends / 10), 1) * 100} className='h-3 bg-gray-200 dark:bg-gray-700' />
          </div>
          <div>
            <div className='flex justify-between text-xs mb-2'>
              <span className='font-medium'>Puncte (Recompense Vânzări)</span>
              <span className='text-muted-foreground'>{Math.min(points, 100)}/100</span>
            </div>
            <Progress value={Math.min((points / 100), 1) * 100} className='h-3 bg-gray-200 dark:bg-gray-700' />
          </div>
          <div>
            <div className='flex justify-between text-xs mb-2'>
              <span className='font-medium'>Verificare (Email)</span>
              <span className='text-muted-foreground'>{Math.min(verification, 1)}/1</span>
            </div>
            <Progress value={Math.min((verification / 1), 1) * 100} className='h-3 bg-gray-200 dark:bg-gray-700' />
          </div>
          <Button size='sm' variant='outline' className='w-full hover:scale-105 transition-transform' onClick={onOpenDialog}>
            <Zap className='h-3 w-3 mr-1' />
            Deschide Recompense
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
