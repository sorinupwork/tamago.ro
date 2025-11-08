import { ReactNode } from 'react';
import { MapPin } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapComponent from '@/components/custom/map/MapComponent';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';

type CardData = {
  icon: ReactNode;
  title: string;
  description: string;
};

type MarketplaceContactSectionProps = {
  title: string;
  description: string;
  cards: CardData[];
  users?: User[];
  showMap?: boolean;
  gridCols?: string;
  className?: string;
};

export default function MarketplaceContactSection({
  title,
  description,
  cards,
  users = [],
  showMap = true,
  gridCols = 'grid-cols-1 md:grid-cols-3',
  className = '',
}: MarketplaceContactSectionProps) {
  return (
    <section className={cn(`transition-all duration-300 rounded-lg, ${className}`)}>
      <div className='text-center'>
        {/* Conditionally render map section */}
        {showMap && users.length > 0 && (
          <Card className='transition-all duration-200 hover:shadow-xl'>
            <CardHeader>
              <CardTitle className='flex flex-col items-center justify-center gap-2'>
                <div className='flex items-center justify-center gap-2'>
                  <MapPin className='w-6 h-6 wiggle text-primary' />
                  <p>Locuri de Întâlnire</p>
                </div>
                <p className='text-sm text-muted-foreground'>Vezi locațiile pentru întâlniri sigure</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64 w-full rounded-lg overflow-hidden'>
                <MapComponent users={users} />
              </div>
            </CardContent>
          </Card>
        )}
        <h3 className='text-xl font-semibold mb-4'>{title}</h3>
        <p className='text-muted-foreground mb-4'>{description}</p>
        <div className={`grid ${gridCols} gap-4 mb-8 max-w-7xl w-full mx-auto`}>
          {cards.map((card, index) => (
            <Card key={index} className='transition-all duration-200 pinch group'>
              <CardContent className='p-4 text-center'>
                <div className='w-8 h-8 mx-auto mb-2 animate-pulse wiggle'>{card.icon}</div>
                <h4 className='font-semibold'>{card.title}</h4>
                <p className='text-sm text-muted-foreground'>{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
