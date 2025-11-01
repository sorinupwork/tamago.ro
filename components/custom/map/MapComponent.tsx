"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

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

export default function MapComponent({
  users,
  center = [45.9432, 24.9668],
  zoom = 6,
}: MapComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((mod) => setL(mod));
  }, []);

  if (!L) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {users.map((user) => {
        const customIcon = L.icon({
          iconUrl: user.avatar,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: "rounded-full",
        });
        return (
          <Marker key={user.id} position={user.location} icon={customIcon}>
            <Popup>
              {user.name} - {user.status}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
