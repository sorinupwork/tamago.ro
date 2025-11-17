'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'; // Added CarouselApi
import { Heart, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { MediaPreview } from '@/components/custom/MediaPreview';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import MapComponent from '@/components/custom/map/MapComponent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CarCard } from '@/components/custom/auto/CarCard';
import { StoriesSection } from '@/components/custom/contact/StoriesSection';
import { getSellAutoCars, getBuyAutoCars, getRentAutoCars, getAuctionAutoCars } from '@/actions/auto/actions';
import type { Car } from '@/lib/types';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

type RawCarDoc = {
  _id: string;
  title?: string;
  price?: string | number;
  currency?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  year?: string; // Updated to string to match DB
  brand?: string;
  mileage?: string; // Updated to string to match DB
  fuel?: string;
  transmission?: string;
  location?: string | { lat: number; lng: number; address: string; fullAddress: string };
  uploadedFiles?: string[];
  carType?: string;
  color?: string;
  engineCapacity?: string; // Updated to string to match DB
  horsePower?: string; // Updated to string to match DB
  status?: string;
  description?: string;
  features?: string | string[];
  is4x4?: boolean;
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  options?: string[];
  minPrice?: string;
  maxPrice?: string;
};

export default function CarDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const id = params.id as string; // Use as string
  const queryString = searchParams.toString();
  const autoHref = `/categorii/auto${queryString ? '?' + queryString : ''}`;

  const [car, setCar] = useState<Car | null>(null);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mock auction bidders (keeping as is, since not in DB)
  const mockAuctionBidders = [
    { id: 1, name: 'Ion Popescu', avatar: '/avatars/01.png', status: 'Bidder', category: 'auction' },
    { id: 2, name: 'Maria Ionescu', avatar: '/avatars/02.png', status: 'High Bidder', category: 'auction' },
    { id: 3, name: 'Vasile Georgescu', avatar: '/avatars/03.png', status: 'Watcher', category: 'auction' },
    { id: 4, name: 'Elena Dumitrescu', avatar: '/avatars/04.png', status: 'Bidder', category: 'auction' },
  ];

  // Mock bid history for auctions (keeping as is)
  const bidHistory = [
    { bidder: 'Ion Popescu', amount: 15000, time: '2 ore în urmă' },
    { bidder: 'Maria Ionescu', amount: 15500, time: '1 oră în urmă' },
    { bidder: 'Vasile Georgescu', amount: 16000, time: '30 min în urmă' },
  ];

  // Mock auction end time (24 hours from now)
  const [auctionEndTime] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [timeLeft, setTimeLeft] = useState('');

  // Update countdown every second
  useState(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = auctionEndTime.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Licitația s-a încheiat');
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  // Fetch real cars based on category
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      let carsData: RawCarDoc[];
      switch (category) { // Use category directly
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

      const mappedCars: Car[] = carsData.map((doc: RawCarDoc, index: number) => ({
        id: doc._id.toString(), // Use _id as string
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
        images: doc.uploadedFiles && doc.uploadedFiles.length > 0 ? doc.uploadedFiles : ['/placeholder.svg'],
        dateAdded: new Date().toISOString(),
        sellerType: 'private',
        contactPhone: '123456789',
        contactEmail: 'email@example.com',
        bodyType: doc.carType || 'Sedan',
        color: doc.color || 'Alb',
        engineCapacity: doc.engineCapacity ? parseFloat(doc.engineCapacity) : undefined,
        horsepower: doc.horsePower ? parseInt(doc.horsePower) : undefined,
        status: doc.status || 'used',
        description: doc.description,
        features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
        is4x4: doc.is4x4 || false,
        withDriver: doc.withDriver || false,
        driverName: doc.driverName || '',
        driverContact: doc.driverContact || '',
        driverTelephone: doc.driverTelephone || '',
        options: doc.options || [],
        lat: typeof doc.location === 'object' ? doc.location?.lat : 45.9432,
        lng: typeof doc.location === 'object' ? doc.location?.lng : 24.9668,
        minPrice: doc.minPrice,
        maxPrice: doc.maxPrice,
      }));
      setAllCars(mappedCars);
      const foundCar = mappedCars.find((c) => c.id === id); // Find by string ID
      setCar(foundCar || null);
      setImageSrcs(foundCar?.images.map((img) => img || '/placeholder.svg') || []);
      setLoading(false);
    };
    fetchCars();
  }, [category, id]);

  const handleNext = () => {
    if (api && !api.canScrollNext() && isMobile) {
      if (detailsRef.current) {
        const rect = detailsRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY - 60; // offset for nav height
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
    return <LoadingIndicator />;
  }

  if (!car) return <div>Produsul nu a fost găsit</div>;

  const isAuction = car.category === 'auction';
  const isRent = car.category === 'rent';
  const isSell = car.category === 'sell';
  const isBuy = car.category === 'buy';

  // Get similar cars (same category, different id)
  const similarCars = allCars.filter((c) => c.category === car.category && c.id !== car.id).slice(0, 3);

  // Prepare bidders for StoriesSection with bid info
  const biddersForStories = bidHistory.map((bid, index) => ({
    id: index + 1,
    name: bid.bidder,
    avatar: `/avatars/0${(index % 4) + 1}.png`, // Cycle through avatars
    status: `Bid: $${bid.amount}`,
    category: 'auction',
    location: [45.9432 + index * 0.01, 24.9668 + index * 0.01] as [number, number], // Mock location
  }));

  const handleBid = () => {
    const bid = parseInt(bidAmount);
    if (isNaN(bid) || bid <= parseFloat(car.price.replace(/\./g, ''))) {
      // Parse string for comparison
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
              className='w-full h-full overflow-visible pb-4'
              setApi={setApi}
              onNext={handleNext}
              onPrev={handlePrev}
            >
              <CarouselContent className='-mt-1 max-h-[650px] gap-2.5 p-5'>
                {car.images.map((image, index) => (
                  <CarouselItem key={index} className='relative basis-1/2 min-h-[325px]'>
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

        <div className='space-y-6'>
          <Card ref={detailsRef}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-3xl font-bold'>{car.title}</CardTitle>
                  <p className='text-lg text-muted-foreground'>
                    {car.brand} - {car.year}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    toast.success(isFavorite ? 'Eliminat din favorite!' : 'Adăugat la favorite!');
                  }}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant={isAuction ? 'destructive' : 'secondary'}>
                  {isSell ? 'Ofertă' : isBuy ? 'Cerere' : isRent ? 'Închiriere' : 'Licitație'}
                </Badge>
                {isAuction && <Badge variant='outline'>Licitație Activ</Badge>}
              </div>
              <p className='text-4xl font-bold text-green-600'>
                {car.currency}{' '}
                {isBuy
                  ? car.minPrice && car.maxPrice
                    ? `${car.minPrice} - ${car.maxPrice}`
                    : car.price
                  : isRent
                  ? `${car.price}/${car.period || 'zi'}`
                  : car.price}
              </p>
              {isAuction && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-red-700'>
                    <Clock className='h-4 w-4' />
                    <span>Timp rămas: {timeLeft}</span>
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
                <p>
                  <strong>Locație:</strong> {car.location}
                </p>
                <p>
                  <strong>Tip Caroserie:</strong> {car.bodyType}
                </p>
                <p>
                  <strong>Culoare:</strong> {car.color}
                </p>
                <p>
                  <strong>Tip Vânzător:</strong> {car.sellerType}
                </p>
                {car.is4x4 !== undefined && (
                  <p>
                    <strong>4x4:</strong> {car.is4x4 ? 'Da' : 'Nu'}
                  </p>
                )}
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
                    min={parseFloat(car.price.replace(/\./g, '')) + 1} // Parse string for min
                    step={1}
                  />
                  <Button onClick={handleBid} disabled={!bidAmount || parseInt(bidAmount) <= parseFloat(car.price.replace(/\./g, ''))}>
                    Licitează
                  </Button>
                </div>
                <StoriesSection mockStories={biddersForStories} title='Participanți Licitație' />
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
                <Button onClick={handleSellInquiry}>Întreabă Vânzătorul</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Descriere</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{car.description || 'Descriere detaliată a produsului. Acest vehicul este în stare excelentă și gata pentru drum.'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caracteristici</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc list-inside space-y-1'>
                {car.features?.map((feature, index) => <li key={index}>{feature}</li>) || (
                  <>
                    <li>Stare excelentă</li>
                    <li>Service complet</li>
                    <li>Garanție inclusă</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hartă Locație</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64 w-full'>
                <MapComponent
                  center={car.lat && car.lng ? [car.lat, car.lng] : [45.9432, 24.9668]}
                  zoom={13}
                  filteredCars={car.lat && car.lng ? [car] : []}
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
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <span>{car.contactEmail}</span>
              </div>
              <div className='flex gap-2'>
                <Button asChild>
                  <a href={`tel:${car.contactPhone}`}>
                    <Phone className='mr-2 h-4 w-4' />
                    Sună
                  </a>
                </Button>
                <Button asChild variant='outline'>
                  <a href={`mailto:${car.contactEmail}`}>
                    <Mail className='mr-2 h-4 w-4' />
                    Email
                  </a>
                </Button>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant='secondary'>
                      <MessageCircle className='mr-2 h-4 w-4' />
                      Chat
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Chat cu Vânzătorul</DrawerTitle>
                      <DrawerDescription>Trimite un mesaj direct vânzătorului pentru întrebări despre {car.title}.</DrawerDescription>
                    </DrawerHeader>
                    <div className='p-4'>
                      <Textarea placeholder='Scrie mesajul tău aici...' className='min-h-32' />
                    </div>
                    <DrawerFooter>
                      <Button onClick={() => handleSendMessage('')}>Trimite Mesaj</Button>
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
