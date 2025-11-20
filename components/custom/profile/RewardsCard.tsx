import { Award, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type RewardsCardProps = {
  freePosts: number;
  premiumAccess: boolean;
  onSellClick: () => void;
};

export default function RewardsCard({ freePosts, premiumAccess, onSellClick }: RewardsCardProps) {
  return (
    <TooltipProvider>
      <Card className='hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl'>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Award className='h-5 w-5 mr-2 text-secondary' />
            Recompense
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between items-center'>
            <span>Postări Gratuite</span>
            <Badge variant='secondary'>{freePosts}</Badge>
          </div>
          <div className='flex justify-between items-center'>
            <span>Acces Premium (Vânzări Nelimitate)</span>
            <Badge variant={premiumAccess ? 'default' : 'outline'}>
              {premiumAccess ? 'Da' : 'Nu'}
            </Badge>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                className='w-full hover:scale-105 transition-transform'
                onClick={onSellClick}
              >
                <Zap className='h-4 w-4 mr-2 text-primary' />
                Vinde Acum
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sfat: Listează articole pentru vânzare rapidă și câștigă puncte extra!</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
