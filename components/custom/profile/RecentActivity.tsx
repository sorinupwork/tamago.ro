import { Heart, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type RecentActivityProps = {
  activities?: string[];
  onClear?: () => void;
};

export default function RecentActivity({ activities = [], onClear }: RecentActivityProps) {
  return (
    <TooltipProvider>
      <Card className='hover:shadow-lg transition-all duration-300 rounded-xl'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className='flex items-center'>
                  <Heart className='h-5 w-5 mr-2 text-destructive' />
                  Activitate Recentă
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sfat: Postezi, comentezi sau interacționezi pentru a vedea activitate aici!</p>
              </TooltipContent>
            </Tooltip>
            {onClear && (
              <Button
                size='sm'
                variant='outline'
                onClick={onClear}
                className='h-8 px-2'
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className='space-y-2 max-h-40 overflow-y-auto'>
              {activities.slice(0, 5).map((activity, index) => (
                <p key={index} className='text-sm text-muted-foreground'>
                  • {activity}
                </p>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>Nicio activitate recentă. Începe să postezi pentru a vedea actualizări aici!</p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
