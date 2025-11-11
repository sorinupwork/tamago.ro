'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMap } from 'react-leaflet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

type User = {
  id: number;
  name: string;
  avatar: string;
  status: string;
  category: string;
  location: [number, number];
};

type MapComponentProps = {
  users: User[];
  center?: [number, number];
  zoom?: number;
};

// Child component to handle map bounds
function MapBounds({ users }: { users: User[] }) {
  const map = useMap();

  useEffect(() => {
    if (users.length > 0) {
      const bounds = users.map((user) => user.location);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, users]);

  return null;
}

export default function MapComponent({ users, center = [45.9432, 24.9668], zoom = 6 }: MapComponentProps) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    import('leaflet').then((mod) => setL(mod));
  }, []);

  if (!L) return <div className='flex items-center justify-center h-full'>Loading map...</div>;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <MapBounds users={users} />
      {users.map((user) => {
        const customIcon = L.icon({
          iconUrl: user.avatar,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'rounded-full border-2 border-white',
        });
        return (
          <Marker key={user.id} position={user.location} icon={customIcon}>
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
