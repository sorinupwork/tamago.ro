'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Compass, Eye, MapPin, RotateCw, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchWeatherData, WeatherData } from '@/lib/services';

const WMO_CODES: Record<number, { label: string; icon: string; description: string }> = {
  0: { label: 'Cer senin', icon: '01d', description: 'Vreme perfectă' },
  1: { label: 'Majoritate senin', icon: '01d', description: 'Soare predominant' },
  2: { label: 'Parțial noros', icon: '02d', description: 'Niori dispersate' },
  3: { label: 'Noros', icon: '04d', description: 'Cer acoperit' },
  45: { label: 'Ceață', icon: '50d', description: 'Vizibilitate redusă' },
  48: { label: 'Ceață cu gheață', icon: '50d', description: 'Ceață cu depuneri' },
  51: { label: 'Ploaie ușoară', icon: '09d', description: 'Ploaie ușoară' },
  53: { label: 'Ploaie moderată', icon: '09d', description: 'Ploaie moderată' },
  55: { label: 'Ploaie densă', icon: '09d', description: 'Ploaie grea' },
  61: { label: 'Ploaie ușoară', icon: '10d', description: 'Ploaie ușoară' },
  63: { label: 'Ploaie moderată', icon: '10d', description: 'Ploaie moderată' },
  65: { label: 'Ploaie grea', icon: '10d', description: 'Ploaie grea' },
  71: { label: 'Ninge ușor', icon: '13d', description: 'Ninge ușor' },
  73: { label: 'Ninge moderat', icon: '13d', description: 'Ninge moderat' },
  75: { label: 'Ninge greu', icon: '13d', description: 'Ninge greu' },
  77: { label: 'Granule de zăpadă', icon: '13d', description: 'Granule de zăpadă' },
  80: { label: 'Averse ușoare', icon: '09d', description: 'Averse ușoare' },
  81: { label: 'Averse moderate', icon: '09d', description: 'Averse moderate' },
  82: { label: 'Averse violente', icon: '09d', description: 'Averse violente' },
  85: { label: 'Averse de zăpadă ușoare', icon: '13d', description: 'Averse de zăpadă ușoare' },
  86: { label: 'Averse de zăpadă grele', icon: '13d', description: 'Averse de zăpadă grele' },
  95: { label: 'Furtună', icon: '11d', description: 'Furtună puternică' },
  96: { label: 'Furtună cu grindină ușoară', icon: '11d', description: 'Furtună cu grindină' },
  99: { label: 'Furtună cu grindină grea', icon: '11d', description: 'Furtună cu grindină grea' },
};

export default function WeatherWidget({
  latitude,
  longitude,
  showTips = true,
  compact = false,
}: {
  latitude?: number;
  longitude?: number;
  showTips?: boolean;
  compact?: boolean;
} = {}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresGeolocation, setRequiresGeolocation] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        setRequiresGeolocation(false);

        // If specific coordinates provided, use them
        if (latitude !== undefined && longitude !== undefined) {
          const data = await fetchWeatherData(latitude, longitude);
          if (data) {
            setWeather(data);
          } else {
            setError('Nu am putut încărca datele meteo');
          }
          setLoading(false);
        } else {
          // No coordinates provided, request geolocation
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude)
                  .then((data) => {
                    if (data) {
                      setWeather(data);
                    } else {
                      setError('Nu am putut încărca datele meteo');
                    }
                    setLoading(false);
                  })
                  .catch(() => {
                    setError('Nu am putut încărca datele meteo');
                    setLoading(false);
                  });
              },
              () => {
                setError('Locația nu este disponibilă. Te rugăm acceptă accesul la locație.');
                setRequiresGeolocation(true);
                setLoading(false);
              }
            );
          } else {
            setError('Geolocation nu este suportat de browserul tău');
            setLoading(false);
          }
        }
      } catch {
        setError('Eroare la încărcarea datelor meteo');
        setLoading(false);
      }
    };

    loadWeather();
  }, [latitude, longitude]);

  const handleRetryGeolocation = () => {
    setLoading(true);
    setError(null);
    setRequiresGeolocation(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
            .then((data) => {
              if (data) {
                setWeather(data);
              } else {
                setError('Nu am putut încărca datele meteo');
              }
              setLoading(false);
            })
            .catch(() => {
              setError('Nu am putut încărca datele meteo');
              setLoading(false);
            });
        },
        () => {
          setError('Locația nu este disponibilă. Te rugăm acceptă accesul la locație.');
          setRequiresGeolocation(true);
          setLoading(false);
        }
      );
    }
  };

  const getWeatherIcon = (code: number) => {
    const iconStr = WMO_CODES[code]?.icon || '04d';
    const size = 'w-10 h-10';

    if (iconStr.includes('01')) return <Sun className={`${size} text-yellow-500`} />;
    if (iconStr.includes('02') || iconStr.includes('03') || iconStr.includes('04')) return <Cloud className={`${size} text-gray-400`} />;
    if (iconStr.includes('09') || iconStr.includes('10')) return <CloudRain className={`${size} text-blue-500`} />;
    if (iconStr.includes('11')) return <CloudRain className={`${size} text-purple-600`} />;
    if (iconStr.includes('13')) return <Snowflake className={`${size} text-blue-300`} />;
    if (iconStr.includes('50')) return <Cloud className={`${size} text-gray-400`} />;
    return <Cloud className={`${size} text-gray-400`} />;
  };

  if (loading) {
    return (
      <Card className='overflow-hidden'>
        <CardContent className='p-6'>
          <div className='space-y-4 animate-pulse'>
            <div className='h-12 bg-gray-200 rounded-lg w-2/3'></div>
            <div className='h-8 bg-gray-100 rounded-lg w-1/2'></div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='h-16 bg-gray-100 rounded-lg'></div>
              <div className='h-16 bg-gray-100 rounded-lg'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className='bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className='text-center'>
              <p className='text-red-600 dark:text-red-400 font-medium'>{error || 'Nu am putut încărca datele meteo'}</p>
              {requiresGeolocation && (
                <p className='text-xs text-red-500 dark:text-red-500 mt-2'>
                  Te rugăm să acceptezi accesul la locație pentru a vedea datele meteo
                </p>
              )}
            </div>
            {requiresGeolocation && (
              <Button
                onClick={handleRetryGeolocation}
                variant='outline'
                size='sm'
                className='gap-2 border-red-300 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30'
              >
                <RotateCw className='w-4 h-4' />
                Încearcă din nou
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current_weather, timezone, elevation } = weather;
  const weatherInfo = WMO_CODES[current_weather.weathercode] || {
    label: 'Condiții necunoscute',
    icon: '04d',
    description: 'Condiții necunoscute',
  };

  // Calculate wind direction label
  const getWindDirection = (direction: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'V', 'VNV', 'NV', 'NNV'];
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  };

  // Get weather tips based on temperature and conditions
  const getWeatherTips = (temp: number, code: number) => {
    if (temp < 0) return 'Foarte frig! Rămâi în interior sau îmbrăcă-te greu!';
    if (temp < 10) return 'Vreme rece! Poartă straturi calde și stai hidratat!';
    if (temp > 30) return 'Foarte cald! Rămâi în umbră și bea apă!';
    if (temp > 25) return 'Vreme caldă! Nu uita protecția solară!';
    if (code >= 51 && code <= 82) return 'Ploaie! Ia un umbrelă cu tine!';
    if (code >= 71 && code <= 86) return 'Zăpadă! Conduce cu grijă!';
    if (code >= 95 && code <= 99) return 'Furtună! Rămâi în interior!';
    return 'Vreme plăcută! Ieși afară și bucură-te!';
  };

  return (
    <Card className='overflow-hidden bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-900/50'>
      <CardContent className={`space-y-6 ${compact ? 'p-4' : 'p-6'}`}>
        {/* Main weather display */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='shrink-0'>{getWeatherIcon(current_weather.weathercode)}</div>
            <div>
              <div className={`${compact ? 'text-2xl' : 'text-4xl'} font-bold text-gray-900 dark:text-gray-100`}>
                {Math.round(current_weather.temperature)}°C
              </div>
              <p className='text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize'>{weatherInfo.description}</p>
              <p className='text-xs text-gray-500 dark:text-gray-500'>{weatherInfo.label}</p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>{current_weather.is_day ? '🌤️ Daytime' : '🌙 Nighttime'}</div>
          </div>
        </div>

        {/* Weather metrics grid - hidden in compact mode */}
        {!compact && (
          <div className='grid grid-cols-2 gap-3'>
            {/* Wind Speed */}
            <div className='bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50'>
              <div className='flex items-center gap-2 mb-1'>
                <Wind className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Vânt</p>
              </div>
              <p className='text-lg font-bold text-gray-900 dark:text-gray-100'>{current_weather.windspeed.toFixed(1)} km/h</p>
            </div>

            {/* Wind Direction */}
            <div className='bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50'>
              <div className='flex items-center gap-2 mb-1'>
                <Compass className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Direcție</p>
              </div>
              <p className='text-lg font-bold text-gray-900 dark:text-gray-100'>{getWindDirection(current_weather.winddirection)}</p>
              <p className='text-xs text-gray-500 dark:text-gray-500'>{current_weather.winddirection}°</p>
            </div>

            {/* Elevation */}
            <div className='bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50'>
              <div className='flex items-center gap-2 mb-1'>
                <Eye className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Altitudine</p>
              </div>
              <p className='text-lg font-bold text-gray-900 dark:text-gray-100'>{elevation} m</p>
            </div>

            {/* Location/Timezone */}
            <div className='bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50'>
              <div className='flex items-center gap-2 mb-1'>
                <MapPin className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Timezone</p>
              </div>
              <p className='text-lg font-bold text-gray-900 dark:text-gray-100 truncate'>{timezone.split('/').pop()}</p>
              <p className='text-xs text-gray-500 dark:text-gray-500 truncate'>{timezone}</p>
            </div>
          </div>
        )}

        {/* Weather Tips - Conditional Rendering */}
        {showTips && (
          <div className='bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-900/50'>
            <div className='flex items-start gap-3'>
              <Lightbulb className='w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
              <p className='text-sm font-semibold text-amber-900 dark:text-amber-100'>
                {getWeatherTips(current_weather.temperature, current_weather.weathercode)}
              </p>
            </div>
          </div>
        )}

        {/* Last Update Info */}
        <div className='bg-white/40 dark:bg-gray-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50 text-center'>
          <p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>Actualizat la</p>
          <p suppressHydrationWarning className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
            {new Date(current_weather.time).toLocaleString('ro-RO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
