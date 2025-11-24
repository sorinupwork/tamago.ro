import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Fuel, Settings, MapPin, Car as CarIcon, Palette, UserCog, Calendar, Gauge, Zap, CarFront } from 'lucide-react';
import type { Car } from '@/lib/types';

type CarDetailsAccordionProps = {
  car: Car;
};

export function CarDetailsAccordion({ car }: CarDetailsAccordionProps) {
  const details = [
    { icon: CarIcon, label: 'Caroserie', value: car.bodyType },
    { icon: Palette, label: 'Culoare', value: car.color },
    { icon: UserCog, label: 'Vânzător', value: car.sellerType },
    ...(car.brand ? [{ icon: CarIcon, label: 'Brand', value: car.brand }] : []),
    ...(car.year ? [{ icon: Calendar, label: 'An', value: car.year }] : []),
    ...(car.mileage ? [{ icon: Gauge, label: 'Km', value: car.mileage }] : []),
    ...(car.engineCapacity ? [{ icon: Settings, label: 'Capacitate Motor', value: `${car.engineCapacity} cc` }] : []),
    ...(car.horsepower ? [{ icon: Zap, label: 'Putere', value: `${car.horsepower} CP` }] : []),
    ...(car.is4x4 ? [{ icon: CarIcon, label: '4x4', value: 'Da' }] : []),
    { icon: Settings, label: 'Transmisie', value: car.transmission },
  ];

  const previewDetails = [
    { icon: MapPin, label: 'Locație', value: car.location },
    { icon: CarFront, label: 'Status', value: car.status },
    { icon: Fuel, label: 'Combustibil', value: car.fuel },
  ];

  const leftDetails = details.slice(0, Math.ceil(details.length / 2));
  const rightDetails = details.slice(Math.ceil(details.length / 2));

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {previewDetails.map((detail, i) => (
          <div key={i} className='bg-muted/50 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center'>
            <detail.icon className='h-6 w-6 mx-auto mb-1 text-primary' />
            <p className='text-sm font-semibold'>{detail.label}</p>
            <p className='text-xs text-muted-foreground truncate'>{detail.value}</p>
          </div>
        ))}
      </div>
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
