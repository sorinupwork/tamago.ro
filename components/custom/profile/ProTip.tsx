import React from 'react';
import { Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProTipProps {
  tip: string;
}

export default function ProTip({ tip }: ProTipProps) {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'>
      <CardHeader>
        <CardTitle className='text-sm flex items-center'>
          <Zap className='h-4 w-4 mr-2 text-yellow-500' />
          Pro Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-xs text-muted-foreground'>{tip}</p>
      </CardContent>
    </Card>
  );
}
