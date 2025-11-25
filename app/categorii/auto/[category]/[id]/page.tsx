'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Phone, MessageCircle, Clock, Car as CarIcon, type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import MediaPreview from '@/components/custom/media/MediaPreview';
import MapComponent from '@/components/custom/map/MapComponent';
import CarCard from '@/components/custom/auto/CarCard';
import AuctionBidders from '@/components/custom/section/AuctionBidders';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import AppCounter from '@/components/custom/counter/AppCounter';
import FavoriteButton from '@/components/custom/button/FavoriteButton';
import Timeline from '@/components/custom/timeline/Timeline';
import { useIsMobile } from '@/hooks/use-mobile';
import { getSellAutoCars, getBuyAutoCars, getRentAutoCars, getAuctionAutoCars } from '@/actions/auto/actions';
import { geocodeAddress } from '@/lib/services';
import type { Car, RawCarDoc, User } from '@/lib/types';

export default function CarDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const id = params.id as string;
  const queryString = searchParams.toString();
  const autoHref = `/categorii/auto${queryString ? '?' + queryString : ''}`;

  const [car, setCar] = useState<Car | null>(null);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [imageSrcs, setImageSrcs] = useState<string[]>([]);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const geocodedFor = useRef<string | null>(null);

  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mock bid history for auctions
  const bidHistory = [
    { bidder: 'Ion Popescu', amount: 15000, time: '2 ore în urmă' },
    { bidder: 'Maria Ionescu', amount: 15500, time: '1 oră în urmă' },
    { bidder: 'Vasile Georgescu', amount: 16000, time: '30 min în urmă' },
  ];

  // Mock auction end time (24 hours)
  const [auctionEndTime] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000));

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      let carsData: RawCarDoc[];
      switch (category) {
        case 'vanzare':
          carsData = await getSellAutoCars();
          break;
        case 'cumparare':
          carsData = await getBuyAutoCars();
          break;
        case 'inchiriere':
          carsData = await getRentAutoCars();
          break;
        case 'licitatie':
          carsData = await getAuctionAutoCars();
          break;
        default:
          carsData = [];
          break;
      }

      const mappedCars: Car[] = carsData.map((doc: RawCarDoc) => ({
        id: doc._id.toString(),
        title: doc.title || '',
        price: String(doc.price || '0'),
        currency: doc.currency || 'RON',
        period: doc.period || '',
        startDate: doc.startDate || '',
        endDate: doc.endDate || '',
        year: parseInt(doc.year || '2020') || 2020,
        brand: doc.brand || 'Unknown',
        category: category === 'vanzare' ? 'sell' : category === 'cumparare' ? 'buy' : category === 'inchiriere' ? 'rent' : 'auction',
        mileage: parseInt(doc.mileage || '0') || 0,
        fuel: doc.fuel || 'Petrol',
        transmission: doc.transmission || 'Manual',
        location: typeof doc.location === 'string' ? doc.location : doc.location?.address || '',
        images:
          doc.images && doc.images.length > 0
            ? doc.images
            : doc.uploadedFiles && doc.uploadedFiles.length > 0
              ? doc.uploadedFiles
              : ['/placeholder.svg'],
        dateAdded: doc.dateAdded || new Date().toISOString(),
        sellerType: (doc.sellerType as 'private' | 'firm') || 'private',
        contactPhone: doc.contactPhone || doc.driverTelephone || '123456789',
        contactEmail: doc.contactEmail || 'email@example.com',
        bodyType: doc.carType || 'Sedan',
        color: doc.color || 'Alb',
        engineCapacity: doc.engineCapacity ? parseFloat(String(doc.engineCapacity)) : undefined,
        horsepower: doc.horsepower ? parseInt(String(doc.horsepower)) : doc.horsePower ? parseInt(String(doc.horsePower)) : undefined,
        status: doc.status || 'used',
        description: doc.description,
        features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
        withDriver: doc.withDriver || false,
        driverName: doc.driverName || '',
        driverContact: doc.driverContact || '',
        driverTelephone: doc.driverTelephone || '',
        options: doc.options || [],
        minPrice: doc.minPrice,
        maxPrice: doc.maxPrice,
        userId: doc.userId ? doc.userId.toString() : '',
        lat: typeof doc.location === 'object' && doc.location?.lat ? doc.location.lat : 44.4268, // Default to Bucharest
        lng: typeof doc.location === 'object' && doc.location?.lng ? doc.location.lng : 26.1025, // Default to Bucharest
        traction: doc.traction || undefined,
        history: doc.history || [],
      }));
      setAllCars(mappedCars);
      const foundCar = mappedCars.find((c) => c.id === id);
      setCar(foundCar || null);
      setImageSrcs(foundCar?.images.map((img) => img || '/placeholder.svg') || []);
      setLoading(false);
    };
    fetchCars();
  }, [category, id]);

  useEffect(() => {
    if (!car) return;

    const locString = car.location;
    if (!locString) return;

    if (geocodedFor.current === locString) return;

    const runGeocode = async () => {
      try {
        if (typeof locString === 'string' && /[-+]?\d{1,3}\.\d+\s*,\s*[-+]?\d{1,3}\.\d+/.test(locString)) {
          const parts = locString.split(',').map((s) => s.trim());
          const lat = parseFloat(parts[0]);
          const lon = parseFloat(parts[1]);
          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            geocodedFor.current = locString;
            if (!car.lat || !car.lng || Math.abs((car.lat || 0) - lat) > 1e-6 || Math.abs((car.lng || 0) - lon) > 1e-6) {
              setMapPosition([lat, lon]);
              setCar((prev) => (prev ? { ...prev, lat, lng: lon } : prev));
            }
            return;
          }
        }

        const results = await geocodeAddress(locString);
        if (results && results.length > 0) {
          const r = results[0];
          const lat = parseFloat(r.lat);
          const lon = parseFloat(r.lon);
          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            geocodedFor.current = locString;
            if (!car.lat || !car.lng || Math.abs((car.lat || 0) - lat) > 1e-6 || Math.abs((car.lng || 0) - lon) > 1e-6) {
              setMapPosition([lat, lon]);
              setCar((prev) => (prev ? { ...prev, lat, lng: lon, location: r.display_name || prev.location } : prev));
            }
          }
        }
      } catch (err) {
        console.error('Geocoding error for car location:', err);
      }
    };

    runGeocode();
  }, [car]);

  const handleNext = () => {
    if (api && !api.canScrollNext() && isMobile) {
      if (detailsRef.current) {
        const rect = detailsRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY - 60;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      api?.scrollNext();
    }
  };

  const handlePrev = () => {
    if (api && !api.canScrollPrev() && isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      api?.scrollPrev();
    }
  };

  if (loading) {
    return <SkeletonLoading variant='auto' className='container mx-auto max-w-7xl' />;
  }

  if (!car) return <div>Produsul nu a fost găsit</div>;

  const isAuction = car.category === 'auction';
  const isRent = car.category === 'rent';
  const isSell = car.category === 'sell';
  const isBuy = car.category === 'buy';

  const similarCars = allCars.filter((c) => c.category === car.category && c.id !== car.id);

  const biddersForStories: User[] = bidHistory.map((bid, index) => ({
    id: (index + 1).toString(),
    name: bid.bidder,
    email: `mock${index}@example.com`,
    provider: 'credentials' as const,
    avatar: `/avatars/0${(index % 4) + 1}.png`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: `Bid: $${bid.amount}`,
    category: 'auction',
    location: [45.9432 + index * 0.01, 24.9668 + index * 0.01] as [number, number],
  }));

  const handleBid = () => {
    const bid = parseInt(bidAmount);
    if (isNaN(bid) || bid <= parseFloat(car.price.replace(/\./g, ''))) {
      toast.error('Suma licitației trebuie să fie mai mare decât prețul curent.');
      return;
    }
    toast.success(`Licitație plasată: $${bid}`);
  };

  const handleRent = () => {
    toast.success('Cerere de închiriere trimisă!');
  };

  const handleBuy = () => {
    toast.success('Cerere de cumpărare trimisă!');
  };

  const handleSellInquiry = () => {
    toast.success('Întrebare trimisă vânzătorului!');
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) {
      toast.error('Mesajul nu poate fi gol.');
      return;
    }
    toast.success('Mesaj trimis!');
  };

  const carTimelineItems = [
    { icon: CarIcon, label: 'Listat pentru Vânzare', value: 'Anunț publicat în 2024', year: 2024 },
    { icon: Clock, label: 'Întreținere Recentă', value: 'Ultimul service în 2023', year: 2023 },
    { icon: MessageCircle, label: 'Întrebări Primite', value: 'Multiple întrebări de la cumpărători', year: 2024 },
  ];

  const carTimeline =
    car?.history && car.history.length > 0
      ? car.history.map((h) => {
          const iconName = h.icon || 'Car';
          const IconComp = ((LucideIcons as unknown as Record<string, unknown>)[iconName] || CarIcon) as LucideIcon;
          return {
            icon: IconComp,
            label: h.title,
            value: h.description || '',
            year: h.year,
          };
        })
      : carTimelineItems;

  return (
    <div className='container mx-auto max-w-7xl'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'>
        <div className='flex flex-col flex-1'>
          <div className='flex items-center gap-4 p-4 lg:sticky lg:top-14'>
            <Breadcrumbs
              items={[
                { label: 'Acasă', href: '/' },
                { label: 'Categorii', href: '/categorii' },
                { label: 'Auto', href: autoHref },
                { label: car.title },
              ]}
              className='wrap-break-word'
            />
          </div>

          <Card ref={carouselRef} className='relative p-0 h-fit lg:sticky lg:top-28'>
            <Carousel
              opts={{
                align: 'center',
                loop: false,
              }}
              orientation='vertical'
              className='w-full h-full overflow-visible '
              setApi={setApi}
              onNext={handleNext}
              onPrev={handlePrev}
            >
              <CarouselContent className='-mt-1 py-4 max-h-[650px] gap-2.5 px-6'>
                {car.images.map((image, index) => (
                  <CarouselItem key={index} className='relative basis-1/2 min-h-[325px] shadow-md ring-2 ring-white rounded-xl'>
                    <MediaPreview
                      mediaItems={car.images.map((url, i) => ({
                        type: 'image',
                        url,
                        alt: `${car.title} ${i + 1}`,
                      }))}
                      initialIndex={index}
                      trigger={
                        <Image
                          fill
                          src={imageSrcs[index]}
                          alt={`${car.title} ${index + 1}`}
                          className='object-cover rounded-xl'
                          placeholder='blur'
                          blurDataURL='/placeholder.svg'
                          onError={() => setImageSrcs((prev) => prev.map((s, i) => (i === index ? '/placeholder.svg' : s)))}
                        />
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2' />
              <CarouselNext className='absolute left-full top-1/2 -translate-y-1/2' />
            </Carousel>
          </Card>
        </div>

        <div className='space-y-6 pt-4'>
          <Card ref={detailsRef}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-3xl font-bold'>{car.title}</CardTitle>
                  <p className='text-lg text-muted-foreground'>
                    {car.brand} - {car.year}
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <Badge variant={isAuction ? 'destructive' : 'secondary'}>
                    {isSell ? 'Ofertă' : isBuy ? 'Cerere' : isRent ? 'Închiriere' : 'Licitație'}
                  </Badge>
                  {isAuction && <Badge variant='outline'>Activ</Badge>}
                  <FavoriteButton itemId={car.id} itemTitle={car.title} itemImage={car.images[0] || ''} itemCategory={car.category} />
                </div>
              </div>

              <p className='text-4xl font-bold text-primary'>
                {car.currency}{' '}
                {isBuy
                  ? car.minPrice && car.maxPrice
                    ? `${car.minPrice} - ${car.maxPrice}`
                    : car.price
                  : isRent
                    ? `${car.price}/${car.period || ''}`
                    : car.price}
              </p>
              {isAuction && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-red-700'>
                    <Clock className='h-4 w-4' />
                    <span>
                      Timp rămas: <AppCounter auctionEndTime={auctionEndTime} />
                    </span>
                  </div>
                </div>
              )}
              {isRent && <p className='text-sm text-muted-foreground'>Tarif pe {car.period || 'zi'}</p>}
            </CardHeader>

            <CardContent>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <p>
                  <strong>An:</strong> {car.year}
                </p>
                <p>
                  <strong>Marcă:</strong> {car.brand}
                </p>
                <p>
                  <strong>Kilometraj:</strong> {car.mileage.toLocaleString('en-US')} km
                </p>
                <p>
                  <strong>Combustibil:</strong> {car.fuel}
                </p>
                <p>
                  <strong>Transmisie:</strong> {car.transmission}
                </p>
                <p className='truncate'>
                  <strong>Locație:</strong> {car.location}
                </p>
                <p>
                  <strong>Tip Caroserie:</strong> {car.bodyType}
                </p>
                <p>
                  <strong>Tracțiune:</strong> {car.traction || 'N/A'}
                </p>
                <p>
                  <strong>Culoare:</strong> {car.color}
                </p>
                <p>
                  <strong>Tip Vânzător:</strong> {car.sellerType}
                </p>
                {isRent && car.startDate && (
                  <p>
                    <strong>Data Început:</strong> {car.startDate}
                  </p>
                )}
                {isRent && car.endDate && (
                  <p>
                    <strong>Data Sfârșit:</strong> {car.endDate}
                  </p>
                )}
                {car.options && car.options.length > 0 && (
                  <div className='col-span-2'>
                    <strong>Opțiuni:</strong>
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {car.options.map((option, index) => (
                        <Badge key={index} variant='outline'>
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {isRent && car.withDriver && (
                <div className='mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg'>
                  <h4 className='font-semibold text-blue-800 dark:text-blue-200'>Șofer Inclus</h4>
                  <p>
                    <strong>Nume Șofer:</strong> {car.driverName}
                  </p>
                  <p>
                    <strong>Contact Șofer:</strong> {car.driverContact}
                  </p>
                  <p>
                    <strong>Telefon Șofer:</strong> {car.driverTelephone}
                  </p>
                </div>
              )}
              <p className='text-xs text-muted-foreground mt-4'>Adăugat: {new Date(car.dateAdded).toLocaleDateString('ro-RO')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descriere</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(car?.description || '') }} />
            </CardContent>
          </Card>

          {isAuction && (
            <Card>
              <CardHeader>
                <CardTitle>Licitație</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>
                  Licitație curentă: <strong>${car.price}</strong>
                </p>
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    placeholder='Suma licitației'
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={parseFloat(car.price.replace(/\./g, '')) + 1}
                    step={1}
                  />
                  <Button onClick={handleBid} disabled={!bidAmount || parseInt(bidAmount) <= parseFloat(car.price.replace(/\./g, ''))}>
                    Licitează
                  </Button>
                </div>
                <AuctionBidders users={biddersForStories} title='Participanți Licitație' />
              </CardContent>
            </Card>
          )}

          {isRent && (
            <Card>
              <CardHeader>
                <CardTitle>Închiriere</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>Disponibil pentru închiriere. Contactează pentru detalii.</p>
                <Timeline items={carTimeline} />
                <Button onClick={handleRent}>Cere Închiriere</Button>
              </CardContent>
            </Card>
          )}

          {isBuy && (
            <Card>
              <CardHeader>
                <CardTitle>Cumpărare</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>Interesat de cumpărare? Trimite o ofertă.</p>
                <Timeline items={carTimeline} />
                <Button onClick={handleBuy}>Cere Ofertă</Button>
              </CardContent>
            </Card>
          )}

          {isSell && (
            <Card>
              <CardHeader>
                <CardTitle>Vânzare</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>Întrebări despre vehicul? Contactează vânzătorul.</p>
                <Timeline items={carTimeline} />
                <Button onClick={handleSellInquiry}>Întreabă Vânzătorul</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Caracteristici</CardTitle>
            </CardHeader>
            <CardContent>
              {car?.features && Array.isArray(car.features) && car.features.length > 0 ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(car.features.join('<br/>')) }} />
              ) : (
                <p>Nu sunt disponibile caracteristici.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hartă Locație</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64 w-full'>
                <MapComponent
                  center={mapPosition ?? [car.lat || 44.4268, car.lng || 26.1025]}
                  mapPosition={mapPosition ?? undefined}
                  zoom={13}
                  filteredCars={[car]}
                  scrollWheelZoom={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contactează Vânzătorul</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4' />
                <span>{car.contactPhone}</span>
              </div>

              <div className='flex gap-2'>
                <Button asChild>
                  <a href={`tel:${car.contactPhone}`}>
                    <Phone className='mr-2 h-4 w-4' />
                    Sună
                  </a>
                </Button>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant='secondary'>
                      <MessageCircle className='mr-2 h-4 w-4' />
                      Mesaj
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Trimite mesaj Vânzătorului</DrawerTitle>
                      <DrawerDescription>Trimite un mesaj direct vânzătorului pentru întrebări despre {car.title}.</DrawerDescription>
                    </DrawerHeader>
                    <div className='p-4'>
                      <Textarea
                        placeholder='Scrie mesajul tău aici...'
                        className='min-h-32'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <DrawerFooter>
                      <Button onClick={() => handleSendMessage(message)}>Trimite Mesaj</Button>
                      <DrawerClose asChild>
                        <Button variant='outline'>Închide</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {similarCars.length > 0 && (
        <div className='mt-8 p-4'>
          <Card>
            <CardHeader>
              <CardTitle>Masini Similare</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <Carousel className='p-4'>
                <CarouselContent containerClassName='gap-4 overflow-visible'>
                  {similarCars.map((c) => (
                    <CarouselItem key={c.id} className='basis-1/1 md:basis-1/2 lg:basis-1/3'>
                      <CarCard car={c} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
