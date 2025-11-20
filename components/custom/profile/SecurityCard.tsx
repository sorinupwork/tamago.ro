import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SecurityCardProps = {
  title: string;
  description: string;
  status: 'secure' | 'warning' | 'danger';
  icon: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function SecurityCard({ title, description, status, icon, buttonText, onButtonClick }: SecurityCardProps) {
  const statusColors = {
    secure: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <TooltipProvider>
      <Card className='hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>{description}</p>
          <div className='flex justify-between items-center'>
            <Badge className={statusColors[status]}>
              {status === 'secure' ? 'Securizat' : status === 'warning' ? 'Atenție' : 'Pericol'}
            </Badge>
          </div>
          {buttonText && onButtonClick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full hover:scale-105 transition-transform'
                  onClick={onButtonClick}
                >
                  {buttonText}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Îmbunătățește securitatea contului tău!</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
