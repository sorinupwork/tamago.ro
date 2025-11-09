'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { LucideIcon, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AppCombobox } from '@/components/custom/combobox/AppCombobox';
import { AppSlider } from '@/components/custom/slider/AppSlider';
import { geocodeAddress, reverseGeocode, snapToRoad, NominatimResult } from '@/lib/services';
import { Car } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MapComponent = dynamic(() => import('./MapComponent').then((mod) => ({ default: mod.MapComponent })), { ssr: false });

type Location = {
  lat: number;
  lng: number;
  address: string;
  fullAddress: string;
};

type Suggestion = {
  value: string;
  label: string;
  data: NominatimResult;
};

type AppLocationInputProps = {
  location: Location | null;
  onChange: (location: Location | null, radius: number) => void;
  placeholder?: string;
  className?: string;
  filteredCars?: Car[];
  leftIcon?: LucideIcon;
  showMap?: boolean;
  value?: string;
  onClear?: () => void;
};

export const AppLocationInput: React.FC<AppLocationInputProps> = ({
  location,
  onChange,
  placeholder = 'Enter location',
  className,
  filteredCars = [],
  leftIcon,
  showMap = true,
  value,
  onClear,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number]>([44.4268, 26.1025]); // Default to Bucharest
  const [radius, setRadius] = useState(50); // Default 50km
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedOnInputChange = useMemo(
    () =>
      debounce(async (query: string) => {
        const raw = await geocodeAddress(query);
        const formatted = raw.map((item: NominatimResult) => ({
          value: item.place_id.toString(),
          label: item.display_name,
          data: item,
        }));
        setSuggestions(formatted);
      }, 300),
    []
  );

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const fullAddress = await reverseGeocode(latitude, longitude);
          const address = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
          const loc = { lat: latitude, lng: longitude, address, fullAddress };
          setMapPosition([latitude, longitude]);
          onChange(loc, radius);
        },
        (error) => {
          toast.error(`Unable to retrieve your location: ${error.message}`);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSelect = async (selected: string) => {
    const item = suggestions.find((s) => s.value === selected);
    if (item) {
      const fullAddress = item.data.display_name;
      const address = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
      let loc = { lat: parseFloat(item.data.lat), lng: parseFloat(item.data.lon), address, fullAddress };
      const snapped = await snapToRoad(loc.lat, loc.lng);
      loc = { ...loc, ...snapped };
      setSelectedValue(selected);
      setMapPosition([loc.lat, loc.lng]);
      onChange(loc, radius);
    }
  };

  const handleMapClick = async (pos: [number, number]) => {
    const fullAddress = await reverseGeocode(pos[0], pos[1]);
    const address = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
    const snapped = await snapToRoad(pos[0], pos[1]);
    const loc = { lat: snapped.lat, lng: snapped.lng, address, fullAddress };
    setMapPosition([snapped.lat, snapped.lng]);
    onChange(loc, radius);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex gap-2'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex-1'>
                <AppCombobox
                  options={suggestions}
                  value={selectedValue || ''}
                  displayValue={value || location?.address || ''}
                  fullDisplayValue={location?.fullAddress || ''}
                  onValueChange={handleSelect}
                  onInputChange={debouncedOnInputChange}
                  placeholder={placeholder}
                  className='w-full'
                  leftIcon={leftIcon}
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  onClear={() => {
                    setSelectedValue(null);
                    setSuggestions([]);
                    setIsOpen(false);
                    onClear?.();
                  }}
                  additionalContent={
                    showMap ? (
                      <div className='space-y-4 p-4'>
                        <div className='flex items-center gap-2'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button onClick={getCurrentLocation} variant='outline' size='sm' type='button'>
                                  <MapPin className='w-4 h-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Folosește locația mea</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <AppSlider
                            label={`Search Radius: ${radius} km`}
                            value={[radius]}
                            onValueChange={(value) => {
                              setRadius(value[0]);
                              if (location) onChange(location, value[0]);
                            }}
                            min={10}
                            max={100}
                            step={5}
                            className='w-full'
                          />
                        </div>
                        <MapComponent
                          mapPosition={mapPosition}
                          selectedLocation={location}
                          onMapClick={handleMapClick}
                          filteredCars={filteredCars}
                          radius={radius}
                        />
                      </div>
                    ) : (
                      <div className='p-4'>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={getCurrentLocation} variant='outline' size='sm' type='button'>
                                <MapPin className='w-4 h-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Folosește locația mea</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )
                  }
                />
              </div>
            </TooltipTrigger>
            {location?.fullAddress && <TooltipContent>{location.fullAddress}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
