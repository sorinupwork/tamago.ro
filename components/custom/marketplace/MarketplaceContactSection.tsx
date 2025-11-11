'use client';

import { ReactNode, useState } from 'react';
import { MapPin, Camera, Filter } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import MapComponent from '@/components/custom/map/MapComponent';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  stories?: User[]; // Add stories prop
  showMap?: boolean;
  gridCols?: string;
  className?: string;
};

export default function MarketplaceContactSection({
  title,
  description,
  cards,
  users = [],
  stories = [],
  showMap = true,
  gridCols = 'grid-cols-1 md:grid-cols-3',
  className = '',
}: MarketplaceContactSectionProps) {
  const [mapFilter, setMapFilter] = useState('Toți');
  const filteredMapUsers = users.filter((user) => mapFilter === 'Toți' || user.category === mapFilter);

  return (
    <section className={cn(`transition-all duration-300 rounded-lg, ${className}`)}>
      <div className='text-center'>
        <h3 className='text-xl font-semibold mb-4'>{title}</h3>
        <p className='text-muted-foreground mb-4'>{description}</p>
        <div className={`grid ${gridCols} gap-4 mb-8 `}>
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
        {showMap && users.length > 0 && (
          <Card className='transition-all duration-200 hover:shadow-xl max-w-7xl w-full mx-auto'>
            <CardHeader>
              <CardTitle className='flex flex-col items-center justify-center gap-2'>
                <div className='flex items-center justify-center gap-2'>
                  <MapPin className='w-6 h-6 wiggle text-primary' />
                  <p>Locuri de Întâlnire</p>
                </div>
                <p className='text-sm text-muted-foreground'>Vezi locațiile pentru întâlniri sigure</p>
                {/* Add Filter */}
                <div className='flex items-center gap-2 mt-2'>
                  <Filter className='w-4 h-4' />
                  <Select value={mapFilter} onValueChange={setMapFilter}>
                    <SelectTrigger className='w-40'>
                      <SelectValue placeholder='Filtrează' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Toți'>Toți</SelectItem>
                      <SelectItem value='Prieteni'>Prieteni</SelectItem>
                      <SelectItem value='Recenți'>Recenți</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64 w-full rounded-lg overflow-hidden'>
                <MapComponent users={filteredMapUsers} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
