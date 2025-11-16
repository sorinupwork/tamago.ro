'use client';

import { useMemo, useState, useRef } from 'react';
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
import { mockCars } from '@/lib/mockData';
import { MediaPreview } from '@/components/custom/MediaPreview';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import MapComponent from '@/components/custom/map/MapComponent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CarCard } from '@/components/custom/auto/CarCard';
import { StoriesSection } from '@/components/custom/contact/StoriesSection';

export default function CarDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const id = parseInt(params.id as string);
  const queryString = searchParams.toString();
  const autoHref = `/categorii/auto${queryString ? '?' + queryString : ''}`;

  const car = useMemo(() => mockCars.find((c) => c.id === id && c.category === category) || null, [id, category]);

  const [imageSrcs, setImageSrcs] = useState(car?.images.map((img) => img || '/placeholder.svg') || []);

  const [isFavorite, setIsFavorite] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mock auction bidders
  const mockAuctionBidders = [
    { id: 1, name: 'Ion Popescu', avatar: '/avatars/01.png', status: 'Bidder', category: 'auction' },
    { id: 2, name: 'Maria Ionescu', avatar: '/avatars/02.png', status: 'High Bidder', category: 'auction' },
    { id: 3, name: 'Vasile Georgescu', avatar: '/avatars/03.png', status: 'Watcher', category: 'auction' },
    { id: 4, name: 'Elena Dumitrescu', avatar: '/avatars/04.png', status: 'Bidder', category: 'auction' },
  ];

  // Mock bid history for auctions
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

  if (!car) return <div>Produsul nu a fost găsit</div>;

  const isAuction = car.category === 'auction';
  const isRent = car.category === 'rent';
  const isSell = car.category === 'sell';
  const isBuy = car.category === 'buy';

  // Get similar cars (same category, different id)
  const similarCars = mockCars.filter((c) => c.category === car.category && c.id !== car.id).slice(0, 3);

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
    if (isNaN(bid) || bid <= car.price) {
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
      <div className='flex items-center gap-4 p-4 overflow-x-hidden'>
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

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'>
        <Card ref={carouselRef} className='relative p-0 h-fit lg:sticky lg:top-0'>
          <Carousel
            opts={{
              align: 'center',
              loop: false,
            }}
            orientation='vertical'
            className='w-full h-full overflow-visible'
            setApi={setApi}
            onNext={handleNext}
            onPrev={handlePrev}
          >
            <CarouselContent className='-mt-1 h-[777px] gap-2 p-2'>
              {car.images.map((image, index) => (
                <CarouselItem key={index} className='relative basis-1/2'>
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
              <p className='text-4xl font-bold text-green-600'>${car.price.toLocaleString('en-US')}</p>
              {isAuction && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-red-700'>
                    <Clock className='h-4 w-4' />
                    <span>Timp rămas: {timeLeft}</span>
                  </div>
                </div>
              )}
              {isRent && <p className='text-sm text-muted-foreground'>Tarif pe zi</p>}
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
              </div>
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
                  Licitație curentă: <strong>${car.price.toLocaleString('en-US')}</strong>
                </p>
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    placeholder='Suma licitației'
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={car.price + 1}
                    step={1}
                  />
                  <Button onClick={handleBid} disabled={!bidAmount || parseInt(bidAmount) <= car.price}>
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
                  mapPosition={car.lat && car.lng ? [car.lat, car.lng] : undefined}
                  filteredCars={car.lat && car.lng ? [car] : []}
                  scrollWheelZoom={true}
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
