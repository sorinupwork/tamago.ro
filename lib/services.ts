export type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export type WeatherData = {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    time: string;
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: number;
    weathercode: number;
  };
};

export type CarMake = {
  make_id: string;
  make_display: string;
  make_is_common: string;
  make_country: string;
};

export type CarModel = {
  model_name: string;
  model_make_id: string;
};

type MakesResponse = {
  Makes: CarMake[];
};

type ModelsResponse = {
  Models: CarModel[];
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

// JSONP helper function
function jsonp(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackName = 'jsonp_callback_' + Math.random().toString(36).slice(2, 11);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[callbackName] = (data: unknown) => {
      resolve(data);
      document.head.removeChild(script);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[callbackName];
    };
    script.src = url.replace('callback=?', `callback=${callbackName}`);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Fetch car makes from CarQuery API
export const fetchCarMakes = async (): Promise<{ value: string; label: string }[]> => {
  try {
    const data = (await jsonp('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year=2020')) as MakesResponse;
    if (data.Makes && Array.isArray(data.Makes)) {
      return (data.Makes as CarMake[])
        .map((make) => ({
          value: make.make_id,
          label: make.make_display,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return [];
  } catch (error) {
    console.error('Error fetching car makes:', error);
    return [];
  }
};

// Fetch car models for a specific make from CarQuery API
export const fetchCarModels = async (makeId: string): Promise<{ value: string; label: string }[]> => {
  if (!makeId) return [];
  try {
    const data = (await jsonp(`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=${makeId}`)) as ModelsResponse;
    if (data.Models && Array.isArray(data.Models)) {
      return (data.Models as CarModel[])
        .map((model) => ({
          value: model.model_name,
          label: model.model_name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return [];
  } catch (error) {
    console.error('Error fetching car models:', error);
    return [];
  }
};

// Fetch current weather from Open-Meteo API (free, open source)
// Requires latitude and longitude to be provided
export const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
