'use client';

import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car } from '@/lib/types';

// Fix for default markers in Leaflet
// @ts-expect-error: Deleting Leaflet icon URL property to fix marker display issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const LocationMarker: React.FC<{ position: [number, number] | null; setPosition: (pos: [number, number]) => void }> = ({
  position,
  setPosition,
}) => {
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
};

const MapController: React.FC<{ mapPosition: [number, number] }> = ({ mapPosition }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(mapPosition, 13);
  }, [map, mapPosition]);

  return null;
};

interface MapComponentProps {
  mapPosition: [number, number];
  selectedLocation: Location | null;
  onMapClick: (pos: [number, number]) => void;
  filteredCars?: Car[];
  radius?: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({ mapPosition, selectedLocation, onMapClick, filteredCars = [], radius = 50 }) => {
  const mapRef = useRef<L.Map>(null);

  return (
    <MapContainer center={mapPosition} zoom={13} style={{ height: '300px', width: '100%' }} ref={mapRef}>
      <MapController mapPosition={mapPosition} />
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null} setPosition={onMapClick} />
      {selectedLocation && (
        <Circle center={[selectedLocation.lat, selectedLocation.lng]} radius={radius * 1000} />
      )}
      {filteredCars.map((car) =>
        car.lat && car.lng ? (
          <Marker key={car.id} position={[car.lat, car.lng]}>
            <Popup>{car.title}</Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};
