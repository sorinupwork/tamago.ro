import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ProgressBarsProps = {
  posts: number;
  friends: number;
  points: number;
};

export default function ProgressBars({ posts, friends, points }: ProgressBarsProps) {
  return (
    <TooltipProvider>
      <Card className='rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
        <CardHeader>
          <CardTitle className='flex items-center text-lg font-semibold'>
            <TrendingUp className='h-5 w-5 mr-2 text-primary animate-pulse' />
            Progres Vânzări & Social
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='font-medium'>Postări (Listări Vânzări)</span>
                  <span className='text-muted-foreground'>{posts}/20</span>
                </div>
                <Progress
                  value={(posts / 20) * 100}
                  className='h-3 bg-gray-200 dark:bg-gray-700'
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
                    animation: 'pulse 2s infinite',
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sfat: Postezi mai multe articole sau listări pentru a crește progresul și a câștiga insigne!</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='font-medium'>Prieteni (Rețea Socială)</span>
                  <span className='text-muted-foreground'>{friends}/10</span>
                </div>
                <Progress
                  value={(friends / 10) * 100}
                  className='h-3 bg-gray-200 dark:bg-gray-700'
                  style={{
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    animation: 'pulse 2.5s infinite',
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sfat: Conectează-te cu mai mulți prieteni pentru a debloca recompense sociale!</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='font-medium'>Puncte (Recompense Vânzări)</span>
                  <span className='text-muted-foreground'>{points}/200</span>
                </div>
                <Progress
                  value={(points / 200) * 100}
                  className='h-3 bg-gray-200 dark:bg-gray-700'
                  style={{
                    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                    animation: 'pulse 3s infinite',
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sfat: Cumpără sau vinde articole pentru a acumula puncte și a revendica recompense!</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
