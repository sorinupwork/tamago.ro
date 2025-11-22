'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMap, useMapEvents } from 'react-leaflet';
import { Car, User } from '@/lib/types';
import { MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then((mod) => mod.Circle), { ssr: false });

type Location = {
  lat: number;
  lng: number;
  address: string;
};

type MapComponentProps = {
  users?: User[];
  center?: [number, number];
  zoom?: number;
  mapPosition?: [number, number];
  selectedLocation?: Location | null;
  onMapClick?: (pos: [number, number]) => void;
  filteredCars?: Car[];
  radius?: number;
  scrollWheelZoom?: boolean;
};

function MapBounds({ users }: { users: User[] }) {
  const map = useMap();

  useEffect(() => {
    if (users.length > 0) {
      const bounds = users.filter((user) => user.location).map((user) => user.location!);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, users]);

  return null;
}

function LocationMarker({ position, setPosition }: { position: [number, number] | null; setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function MapController({ mapPosition }: { mapPosition: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(mapPosition, 13);
  }, [map, mapPosition]);

  return null;
}

export default function MapComponent({
  users = [],
  center = [45.9432, 24.9668],
  zoom = 6,
  mapPosition,
  selectedLocation,
  onMapClick,
  filteredCars = [],
  radius = 50,
  scrollWheelZoom = false,
}: MapComponentProps) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mapRef = useRef<L.Map>(null);

  const lightTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  useEffect(() => {
    import('leaflet').then((mod) => {
      // Fix for default markers
      // @ts-expect-error: Deleting Leaflet icon URL property to fix marker display issues
      delete mod.Icon.Default.prototype._getIconUrl;
      mod.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setL(mod);
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (mapRef.current && !scrollWheelZoom) {
      mapRef.current.scrollWheelZoom.disable();
    }
  }, [scrollWheelZoom]);

  if (!L) return <div className='flex items-center justify-center h-full'>Loading map...</div>;

  const isUserMode = users.length > 0;
  const mapCenter = isUserMode ? center : mapPosition || center;
  const mapZoom = isUserMode ? zoom : 13;

  const carIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <div className='relative w-full h-full'>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={scrollWheelZoom}
        ref={mapRef}
      >
        <TileLayer url={isDarkMode ? darkTiles : lightTiles} />
        {isUserMode ? <MapBounds users={users} /> : mapPosition && <MapController mapPosition={mapPosition} />}
        {onMapClick && (
          <LocationMarker position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null} setPosition={onMapClick} />
        )}
        {selectedLocation && radius && <Circle center={[selectedLocation.lat, selectedLocation.lng]} radius={radius * 1000} />}
        {filteredCars.map((car) =>
          car.lat && car.lng ? (
            <Marker key={car.id} position={[car.lat, car.lng]} icon={carIcon}>
              <Popup>
                <div className='text-center'>
                  <h3 className='font-semibold'>{car.title}</h3>
                  <p>
                    {car.brand} - {car.year}
                  </p>
                  <p>${car.price}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
        {users.map((user) => {
          const customIcon = L.icon({
            iconUrl: user.avatar!,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
            className: 'rounded-full border-2 border-white',
          });
          return (
            <Marker key={user.id} position={user.location!} icon={customIcon}>
              <Popup maxWidth={320}>
                <div className='bg-popover text-popover-foreground w-64 rounded-lg border p-4 shadow-md outline-hidden flex flex-col gap-3'>
                  <div className='flex items-start gap-3'>
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <h4 className='text-sm font-semibold'>{user.name}</h4>
                      <p className='text-sm text-muted-foreground truncate'>{user.status}</p>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full'>{user.category}</span>
                        <span className='text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1'>
                          <Star className='w-3 h-3' /> Top
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between text-xs mb-1'>
                        <span className='text-muted-foreground'>Profile</span>
                        <span className='font-medium'>78%</span>
                      </div>
                      <div className='w-full bg-muted/20 h-2 rounded overflow-hidden'>
                        <div className='h-2 bg-primary' style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div className='flex flex-col items-end text-xs text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <MapPin className='w-3 h-3' /> Nearby
                      </span>
                      <span>5km</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className='absolute top-4 right-4 z-1000 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center'
        size='sm'
      >
        {isDarkMode ? <Sun className='w-5 h-5 sm:w-6 sm:h-6' /> : <Moon className='w-5 h-5 sm:w-6 sm:h-6' />}
      </Button>
    </div>
  );
}
