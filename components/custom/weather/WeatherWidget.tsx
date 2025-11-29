'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, MapPin, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type WeatherData = {
  temperature: number;
  description: string;
  icon: string;
  location: string;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
        );
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        const current = data.current_weather;
        // Map weather codes to descriptions and icons (simplified)
        const weatherCode = current.weathercode;
        let description = 'Clear';
        let icon = '01d'; // Default sunny
        if (weatherCode >= 1 && weatherCode <= 3) {
          description = 'Partly Cloudy';
          icon = '02d';
        } else if (weatherCode >= 45 && weatherCode <= 48) {
          description = 'Foggy';
          icon = '50d';
        } else if (weatherCode >= 51 && weatherCode <= 67) {
          description = 'Rainy';
          icon = '10d';
        } else if (weatherCode >= 71 && weatherCode <= 77) {
          description = 'Snowy';
          icon = '13d';
        } else if (weatherCode >= 80 && weatherCode <= 82) {
          description = 'Rain Showers';
          icon = '09d';
        } else if (weatherCode >= 85 && weatherCode <= 86) {
          description = 'Snow Showers';
          icon = '13d';
        }
        setWeather({
          temperature: Math.round(current.temperature),
          description,
          icon,
          location: 'Your Location', // Open-Meteo doesn't provide location name, so generic
        });
      } catch (err) {
        setError('Unable to load weather');
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Location access denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  }, []);

  const getWeatherIcon = (icon: string) => {
    if (icon.includes('01')) return <Sun className='w-8 h-8 text-yellow-500' />;
    if (icon.includes('02') || icon.includes('03') || icon.includes('04')) return <Cloud className='w-8 h-8 text-gray-500' />;
    if (icon.includes('09') || icon.includes('10')) return <CloudRain className='w-8 h-8 text-blue-500' />;
    if (icon.includes('13')) return <Snowflake className='w-8 h-8 text-blue-300' />;
    if (icon.includes('50')) return <Cloud className='w-8 h-8 text-gray-400' />;
    return <Cloud className='w-8 h-8 text-gray-500' />;
  };

  if (loading)
    return (
      <Card className='p-4 animate-pulse'>
        <div className='h-20 bg-gray-200 rounded'></div>
      </Card>
    );
  if (error) return <Card className='p-4 text-center text-red-500'>{error}</Card>;

  return (
    <Card className='bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg rounded-xl p-4 max-w-sm mx-auto'>
      <CardContent className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          {weather?.icon && getWeatherIcon(weather.icon)}
          <div>
            <p className='text-2xl font-bold text-gray-800 dark:text-gray-200'>{weather?.temperature}°C</p>
            <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>{weather?.description}</p>
          </div>
        </div>
        <div className='text-right'>
          <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
            <MapPin className='w-4 h-4 mr-1' />
            {weather?.location}
          </div>
          <div className='flex items-center text-xs text-gray-500 dark:text-gray-500 mt-1'>
            <Thermometer className='w-3 h-3 mr-1' />
            Real-time (Free)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
