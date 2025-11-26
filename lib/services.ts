export type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// Geocode address using Nominatim (restricted to Romania)
export const geocodeAddress = async (query: string): Promise<NominatimResult[]> => {
  if (!query) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=RO&limit=1`,
      {
        headers: {
          'User-Agent': 'tamago.ro/1.0',
        },
      }
    );
    const data: NominatimResult[] = await response.json();
    return data;
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};

// Reverse geocode to get address from lat/lng
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: {
        'User-Agent': 'tamago.ro/1.0',
      },
    });
    const data: NominatimResult = await response.json();
    return data.display_name || `${lat}, ${lng}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat}, ${lng}`;
  }
};

// Function to calculate distance (Haversine formula) - can be replaced with OSRM routing if needed
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Snap location to nearest road using OSRM
export const snapToRoad = async (lat: number, lng: number): Promise<{ lat: number; lng: number }> => {
  try {
    const response = await fetch(`https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}.json`);
    const data = await response.json();
    if (data.waypoints && data.waypoints.length > 0) {
      const waypoint = data.waypoints[0];
      return { lat: waypoint.location[1], lng: waypoint.location[0] };
    }
    return { lat, lng };
  } catch (error) {
    console.error('OSRM snap error:', error);
    return { lat, lng };
  }
};
