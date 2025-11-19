import { LucideIcon, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ProTipVariant = 'default' | 'success' | 'warning';

type ProTipProps = {
  tip: string;
  icon?: LucideIcon;
  variant?: ProTipVariant;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

const variantStyles: Record<ProTipVariant, string> = {
  default: 'bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
  success: 'bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
  warning: 'bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
};

const iconColors: Record<ProTipVariant, string> = {
  default: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
};

const defaultIcons: Record<ProTipVariant, LucideIcon> = {
  default: Zap,
  success: CheckCircle,
  warning: AlertTriangle,
};

export default function ProTip({
  tip,
  icon,
  variant = 'default',
  title = 'Sfat Pro',
  action,
  className,
}: ProTipProps) {
  const IconComponent = icon || defaultIcons[variant];
  const iconColor = iconColors[variant];

  return (
    <Card className={cn('hover:shadow-lg transition-all duration-300 rounded-xl', variantStyles[variant], className)}>
      <CardHeader>
        <CardTitle className='text-sm flex items-center justify-between'>
          <div className='flex items-center'>
            <IconComponent className={cn('h-4 w-4 mr-2', iconColor)} />
            {title}
          </div>
          {action && (
            <Button size='sm' variant='outline' onClick={action.onClick} className='ml-2'>
              {action.label}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-xs text-muted-foreground'>{tip}</p>
      </CardContent>
    </Card>
  );
}
