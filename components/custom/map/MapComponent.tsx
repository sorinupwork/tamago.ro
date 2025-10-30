'use client';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  category: string;
  location: [number, number];
}

interface MapComponentProps {
  users: User[];
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ users, center = [45.9432, 24.9668], zoom = 6 }: MapComponentProps) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {users.map((user) => (
        <Marker key={user.id} position={user.location}>
          <Popup>
            {user.name} - {user.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
