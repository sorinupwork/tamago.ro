import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityFeedProps {
  activities: string[];
  onLoadMore?: () => void;
}

export default function ActivityFeed({ activities, onLoadMore }: ActivityFeedProps) {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
      <CardHeader>
        <CardTitle className='flex items-center text-sm'>
          <Heart className='h-4 w-4 mr-2 text-red-500' />
          Activitate Live (Vânzări & Social)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {activities.map((activity, index) => (
            <div key={index} className={`text-xs text-muted-foreground animate-fade-in ${index > 0 ? `delay-${index * 100}` : ''} flex flex-col sm:flex-row sm:items-center gap-1`}>
              • {activity}
            </div>
          ))}
        </div>
        {onLoadMore && (
          <Button
            size='sm'
            variant='outline'
            className='w-full mt-3 hover:bg-primary hover:text-white transition-colors'
            onClick={onLoadMore}
          >
            Încarcă Mai Multe
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
