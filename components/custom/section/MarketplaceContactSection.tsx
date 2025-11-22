'use client';

import { ReactNode, useState } from 'react';
import { MapPin, Filter } from 'lucide-react';

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppSelectInput } from '@/components/custom/input/AppSelectInput';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import MapComponent from '../map/MapComponent';
import WeatherWidget from '../weather/WeatherWidget';

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
  stories?: User[];
  showMap?: boolean;
  gridCols?: string;
  className?: string;
  horizontalLayout?: boolean;
  showWeather?: boolean;
};

export default function MarketplaceContactSection({
  title,
  description,
  cards,
  users = [],
  showMap = true,
  gridCols = 'grid-cols-1 md:grid-cols-3',
  className = '',
  horizontalLayout = false,
  showWeather = true,
}: MarketplaceContactSectionProps) {
  const [mapFilter, setMapFilter] = useState<string[]>(['Toți']);
  const [mapSort, setMapSort] = useState<string>('name');
  const filteredMapUsers = users
    .filter((user) => mapFilter.includes('Toți') || mapFilter.includes(user.category || ''))
    .sort((a, b) => {
      if (mapSort === 'name') return a.name.localeCompare(b.name);
      if (mapSort === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });

  // Helper to get weather tips based on temperature (mock logic, can be enhanced)
  const getWeatherTips = (temp: number) => {
    if (temp < 10) return 'Dress warmly and stay hydrated!';
    if (temp > 25) return 'Stay cool, wear sunscreen!';
    return 'Enjoy the pleasant weather!';
  };

  return (
    <section className={cn(`transition-all duration-300 rounded-lg text-center ${className}`)}>
      {horizontalLayout ? (
        <div className='flex flex-col lg:flex-row gap-4 h-full'>
          <div className='flex flex-col flex-1 gap-4 sm:flex-row'>
            <div className='flex flex-col flex-1'>
              <h3 className='text-xl font-semibold mb-4'>{title}</h3>
              <p className='text-muted-foreground mb-4'>{description}</p>
              <div className='flex flex-col gap-2'>
                {cards.map((card, index) => (
                  <Card key={index} className='transition-all duration-200 pinch group'>
                    <CardContent>
                      <div className='w-8 h-8 mx-auto mb-2 animate-pulse wiggle'>{card.icon}</div>
                      <h4 className='font-semibold'>{card.title}</h4>
                      <p className='text-sm text-muted-foreground'>{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className='flex flex-col flex-1'>
              <Card className='transition-all duration-200 hover:shadow-lg flex-1 flex flex-col'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-center gap-2'>
                    <p>Weather Widget</p>
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-1'>
                  <WeatherWidget />
                </CardContent>
              </Card>
              <Card className='transition-all duration-200 hover:shadow-lg mt-4'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-center gap-2'>
                    <p>Weather Tips</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    {/* Mock tip; in real app, fetch from weather state */}
                    {getWeatherTips(20)} {/* Default temp; integrate with WeatherWidget state if needed */}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {showMap && (
            <div className='flex flex-col flex-1'>
              <Card className='transition-all duration-200 hover:shadow-lg flex-1 flex flex-col'>
                <CardHeader>
                  <CardTitle className='flex flex-col items-start justify-center gap-2'>
                    <div className='flex items-center justify-center gap-2'>
                      <MapPin className='w-6 h-6 wiggle text-primary' />
                      <p>Locuri de Întâlnire</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <p className='text-sm text-muted-foreground text-start'>Vezi locațiile pentru întâlniri sigure</p>
                  </CardDescription>
                </CardHeader>
                <CardAction>
                  <div className='flex flex-col md:flex-row gap-4 px-4'>
                    <div className='flex items-center gap-2'>
                      <Filter className='w-4 h-4' />
                      <AppSelectInput
                        options={[
                          { value: 'name', label: 'Nume' },
                          { value: 'status', label: 'Status' },
                        ]}
                        value={mapSort}
                        onValueChange={(value) => setMapSort(value as string)}
                        placeholder='Sortează'
                        className='w-40'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <Filter className='w-4 h-4' />
                      <AppSelectInput
                        options={[
                          { value: 'Toți', label: 'Toți' },
                          { value: 'Prieteni', label: 'Prieteni' },
                          { value: 'Recenți', label: 'Recenți' },
                        ]}
                        value={mapFilter}
                        onValueChange={(value) => setMapFilter(value as string[])}
                        multiple={true}
                        placeholder='Filtrează categorii'
                        className='w-40'
                      />
                    </div>
                  </div>
                </CardAction>
                <CardContent className='flex-1'>
                  <div className='w-full h-96 lg:h-full rounded-lg overflow-hidden'>
                    <MapComponent users={filteredMapUsers} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <>
          <h3 className='text-xl font-semibold mb-4'>{title}</h3>
          <p className='text-muted-foreground mb-4'>{description}</p>
          <div className={`grid ${gridCols} gap-2`}>
            {cards.map((card, index) => (
              <Card key={index} className='transition-all duration-200 pinch group'>
                <CardContent>
                  <div className='w-8 h-8 mx-auto mb-2 animate-pulse wiggle'>{card.icon}</div>
                  <h4 className='font-semibold'>{card.title}</h4>
                  <p className='text-sm text-muted-foreground'>{card.description}</p>
                </CardContent>
              </Card>
            ))}

            {showWeather && (
              <div>
                <Card className='transition-all duration-200 hover:shadow-lg'>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-center gap-2'>
                      <p>Weather Widget</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeatherWidget />
                  </CardContent>
                </Card>

                <Card className='transition-all duration-200 hover:shadow-lg'>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-center gap-2'>
                      <p>Weather Tips</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>{getWeatherTips(20)}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          {showMap && users.length > 0 && (
            <Card className='transition-all duration-200 hover:shadow-xl flex-1 grow mt-4'>
              <CardHeader>
                <CardTitle className='flex flex-col items-start justify-center gap-2'>
                  <div className='flex items-center justify-center gap-2'>
                    <MapPin className='w-6 h-6 wiggle text-primary' />
                    <p>Locuri de Întâlnire</p>
                  </div>
                </CardTitle>
                <CardDescription>
                  <p className='text-sm text-muted-foreground text-start'>Vezi locațiile pentru întâlniri sigure</p>
                </CardDescription>
              </CardHeader>
              <CardAction>
                <div className='flex flex-col md:flex-row gap-4 px-4'>
                  <div className='flex items-center gap-2'>
                    <Filter className='w-4 h-4' />
                    <AppSelectInput
                      options={[
                        { value: 'name', label: 'Nume' },
                        { value: 'status', label: 'Status' },
                      ]}
                      value={mapSort}
                      onValueChange={(value) => setMapSort(value as string)}
                      placeholder='Sortează'
                      className='w-40'
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <Filter className='w-4 h-4' />
                    <AppSelectInput
                      options={[
                        { value: 'Toți', label: 'Toți' },
                        { value: 'Prieteni', label: 'Prieteni' },
                        { value: 'Recenți', label: 'Recenți' },
                      ]}
                      value={mapFilter}
                      onValueChange={(value) => setMapFilter(value as string[])}
                      multiple={true}
                      placeholder='Filtrează categorii'
                      className='w-40'
                    />
                  </div>
                </div>
              </CardAction>
              <CardContent className='flex-1'>
                <div className='w-full h-full min-h-64 flex-1 rounded-lg overflow-hidden'>
                  <MapComponent users={filteredMapUsers} />
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </section>
  );
}
