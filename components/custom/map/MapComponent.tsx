'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMap, useMapEvents } from 'react-leaflet';
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
  // For user display mode
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
  const mapRef = useRef<L.Map>(null);

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

  // Custom car marker icon
  const carIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Use default for now, replace with car icon URL
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={scrollWheelZoom}
      ref={mapRef}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
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
            <Popup>
              <div className='flex justify-between gap-4 w-80'>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                  <h4 className='text-sm font-semibold'>{user.name}</h4>
                  <p className='text-sm'>{user.status}</p>
                  <div className='text-muted-foreground text-xs'>Categoria: {user.category}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
