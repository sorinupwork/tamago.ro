import React from 'react';
import { Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProgressSummaryProps {
  posts: number;
  friends: number;
  onClaimReward?: () => void;
}

export default function ProgressSummary({ posts, friends, onClaimReward }: ProgressSummaryProps) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      <AccordionItem value='progress' className='rounded-xl border-0 bg-white/80 dark:bg-gray-800/80 shadow-md'>
        <AccordionTrigger className='text-sm font-semibold px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl'>
          <Award className='h-4 w-4 mr-2 text-secondary' />
          Progress Summary
        </AccordionTrigger>
        <AccordionContent className='px-4 pb-4 space-y-4'>
          <div>
            <div className='flex justify-between text-xs mb-1'>
              <span>Posts</span>
              <span>{posts}/20</span>
            </div>
            <Progress value={(posts / 20) * 100} className='h-2' />
          </div>
          <div>
            <div className='flex justify-between text-xs mb-1'>
              <span>Friends</span>
              <span>{friends}/10</span>
            </div>
            <Progress value={(friends / 10) * 100} className='h-2' />
          </div>
          {onClaimReward && (
            <Button size='sm' variant='outline' className='w-full' onClick={onClaimReward}>
              <Zap className='h-3 w-3 mr-1' />
              Claim Reward
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
