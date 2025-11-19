import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type RecentActivityProps = {
  activities?: string[];
};

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <TooltipProvider>
      <Card className='hover:shadow-lg transition-all duration-300 rounded-xl'>
        <CardHeader>
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
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className='space-y-2'>
              {activities.map((activity, index) => (
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
