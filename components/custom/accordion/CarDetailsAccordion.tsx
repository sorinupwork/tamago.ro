import { Fuel, Settings, MapPin, Car as CarIcon, Palette, Calendar, Gauge, Zap, CarFront, ShipWheel } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Car } from '@/lib/types';
import CarHistoryHighlights from './CarHistoryHighlights';

type CarDetailsAccordionProps = {
  car: Car;
};

export default function CarDetailsAccordion({ car }: CarDetailsAccordionProps) {
  const statusMap = { new: 'Nou', used: 'Second hand', damaged: 'Deteriorat' };
  const statusLabel = statusMap[car.status as keyof typeof statusMap] || car.status;
  const details = [
    ...(car.brand ? [{ icon: CarIcon, label: 'Brand', value: car.brand }] : []),
    ...(car.engineCapacity ? [{ icon: Settings, label: 'Capacitate Motor', value: `${car.engineCapacity} cc` }] : []),
    { icon: Settings, label: 'Transmisie', value: car.transmission },
    { icon: CarIcon, label: 'Caroserie', value: car.bodyType },
    ...(car.steeringWheelPosition ? [{ icon: ShipWheel, label: 'Volan', value: car.steeringWheelPosition }] : []),

    ...(car.model ? [{ icon: CarIcon, label: 'Model', value: car.model }] : []),
    ...(car.horsePower ? [{ icon: Zap, label: 'Putere', value: `${car.horsePower} CP` }] : []),
    { icon: CarIcon, label: 'Tracțiune', value: car.traction },
    { icon: Palette, label: 'Culoare', value: car.color },
    { icon: CarFront, label: 'Status', value: statusLabel },
  ];

  const previewDetails = [
    { icon: MapPin, label: 'Locație', value: typeof car.location === 'string' ? car.location : (car.location as { lat: number; lng: number; address: string })?.address },
    ...(car.year ? [{ icon: Calendar, label: 'An', value: car.year }] : []),
    { icon: Fuel, label: 'Combustibil', value: car.fuel },
    ...(car.mileage ? [{ icon: Gauge, label: 'Km', value: car.mileage }] : []),
  ];

  const leftDetails = details.slice(0, Math.ceil(details.length / 2));
  const rightDetails = details.slice(Math.ceil(details.length / 2));

  return (
    <div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {previewDetails.map((detail, i) => (
          <div key={i} className='bg-muted/50 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center'>
            <detail.icon className='h-6 w-6 mx-auto mb-1 text-primary' />
            <p className='text-sm font-semibold truncate'>{detail.label}</p>
            <p className='text-xs text-muted-foreground truncate'>{detail.value}</p>
          </div>
        ))}
      </div>

      <CarHistoryHighlights features={car.features} items={car.history} car={car} />

      <Accordion type='single' collapsible className='w-full' defaultValue='details'>
        <AccordionItem value='details'>
          <AccordionTrigger className='text-sm font-semibold'>Vezi Mai Multe Detalii</AccordionTrigger>
          <AccordionContent className='transition-all duration-300'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
              <div className='space-y-2'>
                {leftDetails.map((detail, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <detail.icon className='h-4 w-4 shrink-0' />
                    <span>
                      {detail.label}: {detail.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className='space-y-2'>
                {rightDetails.map((detail, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <detail.icon className='h-4 w-4 shrink-0' />
                    <span>
                      {detail.label}: {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
