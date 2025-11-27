'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { Moon, Sun } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import { Button } from '@/components/ui/button';
import UserProfileCard from '@/components/custom/card/UserProfileCard';
import { Car, User } from '@/lib/types';

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
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
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
    map.flyTo(mapPosition, 7);
  }, [map, mapPosition]);

  return null;
}

export default function MapComponent({
  users = [],
  center = [45.9432, 24.9668],
  mapPosition,
  zoom = 7,
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
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    import('leaflet').then((mod) => {
      mod.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setL(mod);
    });
  }, []);

  useEffect(() => {
    if (mapRef.current && !scrollWheelZoom) {
      mapRef.current.scrollWheelZoom.disable();
    }
  }, [scrollWheelZoom]);

  const isUserMode = users.length > 0;
  const mapCenter = isUserMode ? center : mapPosition || center;

  const carIcon = useMemo(() => {
    if (!L) return undefined;
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
    });
  }, [L]);

  const userIcon = useMemo(() => {
    if (!L) return undefined;
    return (avatar: string) => L.icon({
      iconUrl: avatar,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: 'rounded-full border-2 border-white',
    });
  }, [L]);

  return (
    <div className='relative w-full h-full'>
      {L ? (
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={scrollWheelZoom} ref={mapRef}>
          <TileLayer url={isDarkMode ? darkTiles : lightTiles} />
          {isUserMode ? <MapBounds users={users} /> : mapPosition && <MapController mapPosition={mapPosition} />}
          {onMapClick && (
            <LocationMarker position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null} setPosition={onMapClick} />
          )}
          {selectedLocation && radius && <Circle center={[selectedLocation.lat, selectedLocation.lng]} radius={radius * 1000} />}
          {filteredCars.map((car) =>
            car.lat && car.lng && carIcon ? (
              <Marker key={car.id} position={[car.lat, car.lng]} icon={carIcon}>
                <Popup maxWidth={320}>
                  <div className='bg-popover text-popover-foreground w-64 rounded-lg border p-4 shadow-md outline-hidden flex flex-col gap-3'>
                    <div className='flex items-start gap-3'>
                      {car.images && car.images[0] && (
                        <Image
                          src={car.images[0]}
                          alt={car.title}
                          width={48}
                          height={48}
                          className='w-12 h-12 rounded-md object-cover shrink-0'
                        />
                      )}
                      <div className='flex-1'>
                        <h4 className='text-sm font-semibold line-clamp-2'>{car.title}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {car.brand} - {car.year}
                        </p>
                        <p className='text-sm font-medium text-green-600'>
                          {car.currency} {car.category === 'buy' ? `${car.minPrice} - ${car.maxPrice}` : car.category === 'rent' ? `${car.price}/${car.period || 'zi'}` : car.price}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>{car.location}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{car.mileage} km</span>
                      <span>{car.fuel}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
          {users
            .filter((user) => user.location)
            .map((user) => {
              const customIcon = userIcon ? userIcon(user.avatar!) : undefined;
              return customIcon ? (
                <Marker key={user.id} position={user.location!} icon={customIcon}>
                  <Popup maxWidth={320}>
                    <div className='bg-popover text-popover-foreground w-64 rounded-lg border p-4 shadow-md outline-hidden'>
                      <UserProfileCard user={user} contentOnly />
                    </div>
                  </Popup>
                </Marker>
              ) : null;
            })}
        </MapContainer>
      ) : (
        <div className='flex items-center justify-center h-full'>Se încarcă harta...</div>
      )}
      <div className='absolute top-4 right-4 z-1000 flex flex-col gap-2'>
        <Button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className='bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center'
          size='sm'
        >
          {isDarkMode ? <Sun className='w-5 h-5 sm:w-6 sm:h-6' /> : <Moon className='w-5 h-5 sm:w-6 sm:h-6' />}
        </Button>
      </div>
    </div>
  );
}
