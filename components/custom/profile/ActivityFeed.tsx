import { BellRing, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ActivityFeedProps = {
  activities: string[];
  onLoadMore?: () => void;
  onClear?: () => void;
};

export default function ActivityFeed({ activities, onClear }: ActivityFeedProps) {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center text-sm'>
            <BellRing className='h-4 w-4 mr-2 text-red-500' />
            Notificari Live (Market & Social)
          </CardTitle>
          {onClear && (
            <Button size='sm' variant='outline' onClick={onClear} className='h-8 px-2'>
              <Trash2 className='h-3 w-3' />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`text-xs text-muted-foreground animate-fade-in ${index > 0 ? `delay-${index * 100}` : ''} flex flex-col sm:flex-row sm:items-center gap-1`}
            >
              • {activity}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
