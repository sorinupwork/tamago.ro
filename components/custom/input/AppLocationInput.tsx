'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AppCombobox } from '@/components/custom/combobox/AppCombobox';
import { Button } from '@/components/ui/button';
import { AppSlider } from '@/components/custom/slider/AppSlider';
import { LucideIcon, MapPin } from 'lucide-react';
import { geocodeAddress, reverseGeocode, snapToRoad, NominatimResult } from '@/lib/services';
import { Car } from '@/lib/types';
import { debounce } from 'lodash';
import { toast } from 'sonner';

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
  value: string;
  onChange: (location: Location | null, radius: number) => void;
  placeholder?: string;
  className?: string;
  filteredCars?: Car[];
  leftIcon?: LucideIcon;
  showMap?: boolean;
};

export const AppLocationInput: React.FC<AppLocationInputProps> = ({
  onChange,
  placeholder = 'Enter location',
  className,
  filteredCars = [],
  leftIcon,
  showMap = true,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number]>([44.4268, 26.1025]); // Default to Bucharest
  const [radius, setRadius] = useState(50); // Default 50km
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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

  // Get current location
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const fullAddress = await reverseGeocode(latitude, longitude);
          const address = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
          const loc = { lat: latitude, lng: longitude, address, fullAddress };
          setSelectedLocation(loc);
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

  // Handle combobox selection
  const handleSelect = async (selected: string) => {
    const item = suggestions.find((s) => s.value === selected);
    if (item) {
      const fullAddress = item.data.display_name;
      const address = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
      let loc = { lat: parseFloat(item.data.lat), lng: parseFloat(item.data.lon), address, fullAddress };
      // Snap to nearest road using OSRM
      const snapped = await snapToRoad(loc.lat, loc.lng);
      loc = { ...loc, ...snapped };
      setSelectedLocation(loc);
      setSelectedValue(selected);
      setMapPosition([loc.lat, loc.lng]);
      onChange(loc, radius);
    }
  };

  // Handle map click
  const handleMapClick = async (pos: [number, number]) => {
    const fullAddress = await reverseGeocode(pos[0], pos[1]);
    const address = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
    // Snap to nearest road
    const snapped = await snapToRoad(pos[0], pos[1]);
    const loc = { lat: snapped.lat, lng: snapped.lng, address, fullAddress };
    setSelectedLocation(loc);
    setMapPosition([snapped.lat, snapped.lng]);
    onChange(loc, radius);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex gap-2'>
        <AppCombobox
          options={suggestions}
          value={selectedValue || ''}
          displayValue={selectedLocation?.address || ''}
          fullDisplayValue={selectedLocation?.fullAddress || ''}
          onValueChange={handleSelect}
          onInputChange={debouncedOnInputChange}
          placeholder={placeholder}
          className='flex-1'
          leftIcon={leftIcon}
          onClear={() => {
            setSelectedLocation(null);
            setSelectedValue(null);
            setSuggestions([]);
            onChange(null, radius);
          }}
          additionalContent={
            showMap ? (
              <div className='space-y-4 p-4'>
                <div className='flex items-center gap-2'>
                  <Button onClick={getCurrentLocation} variant='outline' size='sm' title='Folosește locația mea' type="button">
                    <MapPin className='w-4 h-4' />
                  </Button>

                  <AppSlider
                    label={`Search Radius: ${radius} km`}
                    value={[radius]}
                    onValueChange={(value) => {
                      setRadius(value[0]);
                      if (selectedLocation) onChange(selectedLocation, value[0]);
                    }}
                    min={10}
                    max={100}
                    step={5}
                    className='w-full'
                  />
                </div>
                <MapComponent
                  mapPosition={mapPosition}
                  selectedLocation={selectedLocation}
                  onMapClick={handleMapClick}
                  filteredCars={filteredCars}
                  radius={radius}
                />
              </div>
            ) : (
              <div className='p-4'>
                <Button onClick={getCurrentLocation} variant='outline' size='sm' title='Folosește locația mea' type="button">
                  <MapPin className='w-4 h-4' />
                </Button>
              </div>
            )
          }
        />
      </div>
    </div>
  );
};
