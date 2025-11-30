'use client';

import Image from 'next/image';
import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone,
  MessageCircle,
  Clock,
  Car as CarIcon,
  Gauge,
  Fuel,
  Cog,
  Zap,
  MapPin,
  Calendar,
  Palette,
  Wrench,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MessageDrawer from '@/components/custom/drawer/MessageDrawer';
import AppInput from '@/components/custom/input/AppInput';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Breadcrumbs from '@/components/custom/breadcrumbs/Breadcrumbs';
import MediaPreview from '@/components/custom/media/MediaPreview';
import MapComponent from '@/components/custom/map/MapComponent';
import CarCard from '@/components/custom/card/CarCard';
import AuctionBidders from '@/components/custom/section/AuctionBidders';
import AppCounter from '@/components/custom/counter/AppCounter';
import FavoriteButton from '@/components/custom/button/FavoriteButton';
import Timeline from '@/components/custom/timeline/Timeline';
import UserProfileCard from '@/components/custom/card/UserProfileCard';
import { useIsMobile } from '@/hooks/ui/use-mobile';
import { cn } from '@/lib/utils';
import type { Car, User, CarAuction } from '@/lib/types';
import { placeBid } from '@/actions/auto/actions';
import { parseNumberSafely } from '@/lib/auto/helpers';

type CarDetailClientProps = {
  car: Car;
  similarCars: Car[];
  queryString: string;
  sellerUser?: User | null;
  currentUser?: User | null;
};

export default function CarDetailClient({ car, similarCars, queryString, sellerUser, currentUser }: CarDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageSrcs, setImageSrcs] = useState<string[]>(car.images.map((img) => img || '/placeholder.svg'));
  const [bidAmount, setBidAmount] = useState('');
  const [api, setApi] = useState<CarouselApi>();
  const detailsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const autoHref = `/categorii/auto${queryString ? '?' + queryString : ''}`;

  // Get real bids from auction car
  const auctionCar = car.category === 'auction' ? (car as CarAuction) : null;
  const bidHistory = auctionCar?.bids || [];
  const sortedBids = [...bidHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const auctionEndTime = auctionCar?.endDate ? new Date(auctionCar.endDate) : null;

  const mapCenter: [number, number] = [car.lat || 44.4268, car.lng || 26.1025];

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

  const handleBid = () => {
    startTransition(async () => {
      if (!currentUser) {
        toast.error('Trebuie să fii autentificat pentru a licita.');
        return;
      }

      if (car.category !== 'auction') {
        toast.error('Doar anunțurile de licitație pot primi oferte.');
        return;
      }

      const bid = parseNumberSafely(bidAmount);

      if (isNaN(bid) || bid <= 0) {
        toast.error('Suma licitației trebuie să fie validă.');
        return;
      }

      const result = await placeBid(car.id, 'licitatie', bid);

      if (result.success) {
        toast.success(result.message);
        setBidAmount('');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleRent = () => {
    startTransition(async () => {
      toast.success('Cerere de închiriere trimisă!');
      // Add server action call here if needed
    });
  };

  const handleBuy = () => {
    startTransition(async () => {
      toast.success('Cerere de cumpărare trimisă!');
      // Add server action call here if needed
    });
  };

  const handleSellInquiry = () => {
    startTransition(async () => {
      toast.success('Întrebare trimisă vânzătorului!');
      // Add server action call here if needed
    });
  };

  const handleSendMessage = (msg: string) => {
    startTransition(async () => {
      if (!msg.trim()) {
        toast.error('Mesajul nu poate fi gol.');
        return;
      }
      toast.success('Mesaj trimis!');
      // Add server action call here if needed
    });
  };

  const isAuction = car.category === 'auction';
  const isRent = car.category === 'rent';
  const isSell = car.category === 'sell';
  const isBuy = car.category === 'buy';

  // Get unique bidders with their latest/highest bid
  const uniqueBidders = new Map<string, User>();
  sortedBids.forEach((bid) => {
    if (!uniqueBidders.has(bid.userId)) {
      uniqueBidders.set(bid.userId, {
        id: bid.userId,
        name: bid.userName,
        email: '',
        provider: 'credentials' as const,
        avatar: bid.userAvatar || undefined,
        createdAt: new Date(bid.createdAt),
        updatedAt: new Date(bid.createdAt),
        status: `${bid.amount} ${auctionCar?.currency || 'EUR'}`,
        category: 'auction',
        location: [0, 0] as [number, number],
      });
    }
  });
  const biddersForStories: User[] = Array.from(uniqueBidders.values());

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

          <Card className='relative p-0 h-fit lg:sticky lg:top-28'>
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
              <CarouselContent className={'mt-0 space-y-4 h-[650px]'} containerClassName='p-1'>
                {car.images.map((image, index) => {
                  const basisClass = car.images.length === 1 ? 'basis-full' : 'basis-1/2';
                  return (
                    <CarouselItem key={index} className={cn('pt-1 relative border-2 rounded-xl', basisClass)}>
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
                            className='object-cover rounded-xl w-full h-full'
                            placeholder='blur'
                            blurDataURL='/placeholder.svg'
                            onError={() => setImageSrcs((prev) => prev.map((s, i) => (i === index ? '/placeholder.svg' : s)))}
                          />
                        }
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2 border-2 shadow-lg' />
              <CarouselNext className='absolute left-full top-1/2 -translate-y-1/2 border-2 shadow-lg' />
            </Carousel>
          </Card>
        </div>

        <div className='space-y-6 pt-4'>
          <Card ref={detailsRef}>
            <CardHeader>
              <div className='flex justify-between items-start gap-4'>
                <div className='flex-1'>
                  <CardTitle className='text-3xl font-bold'>{car.title}</CardTitle>
                  <p className='text-lg text-muted-foreground'>{`${car.brand} ${car.model} - ${car.status === 'used' ? 'Second Hand' : car.status === 'new' ? 'Nou' : car.status === 'damaged' ? 'Deteriorat' : ''}`}</p>
                </div>

                <div className='flex flex-col items-end gap-2'>
                  <div className='flex items-center gap-2'>
                    <Badge variant={isAuction ? 'destructive' : 'secondary'}>
                      {isSell ? 'Ofertă' : isBuy ? 'Cerere' : isRent ? 'Închiriere' : 'Licitație'}
                    </Badge>
                    <FavoriteButton itemId={car.id} itemTitle={car.title} itemImage={car.images[0] || ''} itemCategory={car.category} />
                  </div>
                  {sellerUser && <UserProfileCard user={sellerUser} size='sm' showName={true} />}
                </div>
              </div>

              <p className='text-4xl font-bold text-primary mt-4'>
                {car.currency} {isBuy ? `${car.minPrice} - ${car.maxPrice}` : isRent ? `${car.price}/${car.period || 'zi'}` : car.price}
              </p>
              {isAuction && auctionEndTime && (
                <div className='bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-200'>
                    <Clock className='h-4 w-4' />
                    <span>
                      Timp rămas: <AppCounter auctionEndTime={auctionEndTime} />
                    </span>
                  </div>
                </div>
              )}
              {isRent && <p className='text-sm text-muted-foreground mt-2'>Tarif pe {car.period || 'zi'}</p>}
            </CardHeader>

            <CardContent>
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                  <Calendar className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-muted-foreground'>An Fabricație</p>
                    <p className='text-lg font-bold'>{isBuy ? `${car.minYear} - ${car.maxYear}` : car.year}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                  <Gauge className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-muted-foreground'>Kilometraj</p>
                    <p className='text-lg font-bold'>{isBuy ? `${car.minMileage} - ${car.maxMileage}` : car.mileage} km</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                  <Fuel className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-muted-foreground'>Combustibil</p>
                    <p className='text-lg font-bold'>{car.fuel}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                  <Cog className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-muted-foreground'>Transmisie</p>
                    <p className='text-lg font-bold'>{car.transmission}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                  <Zap className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-muted-foreground'>Capacitate Cilindrica</p>
                    <p className='text-lg font-bold'>
                      {isBuy
                        ? `${car.minEngineCapacity} - ${car.maxEngineCapacity}`
                        : car.engineCapacity
                          ? (typeof car.engineCapacity === 'string' ? parseFloat(car.engineCapacity) : car.engineCapacity).toFixed(1)
                          : 'N/A'}
                      L
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                  <Wrench className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-muted-foreground'>Putere</p>
                    <p className='text-lg font-bold'>{isBuy ? `${car.minHorsePower} - ${car.maxHorsePower}` : car.horsePower} CP</p>
                  </div>
                </div>

                {car.color && (
                  <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                    <Palette className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-xs font-semibold text-muted-foreground'>Culoare</p>
                      <div className='flex items-center gap-2 mt-0.5'>
                        <span
                          className='inline-block w-3 h-3 rounded-full border border-foreground'
                          style={{ backgroundColor: getColorValue(car.color) }}
                        ></span>
                        <p className='text-lg font-bold'>{car.color}</p>
                      </div>
                    </div>
                  </div>
                )}

                {car.bodyType && (
                  <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                    <CarIcon className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-xs font-semibold text-muted-foreground'>Tip Caroserie</p>
                      <p className='text-lg font-bold'>{car.bodyType}</p>
                    </div>
                  </div>
                )}

                {car.traction && (
                  <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                    <Zap className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-xs font-semibold text-muted-foreground'>Tracțiune</p>
                      <p className='text-lg font-bold'>{car.traction}</p>
                    </div>
                  </div>
                )}

                {car.steeringWheelPosition && (
                  <div className='flex items-start gap-3 p-3 bg-muted rounded-lg'>
                    <Wrench className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-xs font-semibold text-muted-foreground'>Volan</p>
                      <p className='text-lg font-bold'>{car.steeringWheelPosition}</p>
                    </div>
                  </div>
                )}

                {car.location && (
                  <div className='flex items-start gap-3 p-3 bg-muted rounded-lg col-span-2'>
                    <MapPin className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-xs font-semibold text-muted-foreground'>Locație</p>
                      <p className='text-lg font-bold truncate'>
                        {typeof car.location === 'string'
                          ? car.location
                          : (car.location as { lat: number; lng: number; address: string })?.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {car.options && car.options.length > 0 && (
                <div className='mb-6'>
                  <h4 className='font-semibold mb-3'>Dotări și Opțiuni:</h4>
                  <div className='flex flex-wrap gap-2'>
                    {car.options.map((option, index) => (
                      <Badge key={index} variant='secondary'>
                        ✓ {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {isRent && car.withDriver && (
                <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg'>
                  <h4 className='font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-1'>
                    <UserIcon size={20} /> Șofer
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <p>
                      <strong>Nume:</strong> {car.driverName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {car.driverContact}
                    </p>
                    {car.driverTelephone && (
                      <p>
                        <strong>Telefon:</strong> {car.driverTelephone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className='text-xs text-muted-foreground mt-6'>Adăugat: {new Date(car.createdAt).toLocaleDateString('ro-RO')}</p>
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

          {isAuction && auctionCar && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>Licitație</span>
                  {auctionEndTime && (
                    <Badge variant={new Date() > auctionEndTime ? 'destructive' : 'default'}>
                      {new Date() > auctionEndTime ? 'Încheiată' : 'Activă'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {sortedBids.length > 0 ? (
                  <div className='p-4 bg-muted rounded-lg'>
                    <p className='text-sm text-muted-foreground'>Oferta curentă</p>
                    <p className='text-3xl font-bold text-primary'>
                      {sortedBids[0].amount} {auctionCar.currency || 'EUR'}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      de {sortedBids[0].userName} • {new Date(sortedBids[0].createdAt).toLocaleString('ro-RO')}
                    </p>
                  </div>
                ) : (
                  <div className='p-4 bg-muted rounded-lg'>
                    <p className='text-sm text-muted-foreground'>Preț de pornire</p>
                    <p className='text-3xl font-bold text-primary'>
                      {car.price} {auctionCar.currency || 'EUR'}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>Nicio ofertă încă</p>
                  </div>
                )}

                {auctionEndTime && new Date() < auctionEndTime && (
                  <>
                    <div className='flex gap-2'>
                      <AppInput
                        type='number'
                        placeholder={
                          sortedBids.length > 0 ? `Minim ${sortedBids[0].amount + 1} ${auctionCar.currency || 'EUR'}` : 'Suma licitației'
                        }
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={sortedBids.length > 0 ? sortedBids[0].amount + 1 : 0}
                        step='1'
                        disabled={isPending || !currentUser}
                        className='flex-1'
                      />
                      <Button onClick={handleBid} disabled={!bidAmount || isPending || !currentUser}>
                        {isPending ? 'Se procesează...' : 'Licitează'}
                      </Button>
                    </div>
                    {!currentUser && (
                      <p className='text-sm text-muted-foreground text-center'>Trebuie să fii autentificat pentru a licita.</p>
                    )}
                  </>
                )}

                {sortedBids.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='font-semibold text-sm'>Istoric Licitații ({sortedBids.length})</h4>
                    <div className='max-h-60 overflow-y-auto space-y-2 pr-1'>
                      {sortedBids.slice(0, 3).map((bid, index) => (
                        <div key={index} className='flex justify-between items-center p-2 bg-muted/50 rounded'>
                          <div>
                            <p className='font-medium text-sm'>{bid.userName}</p>
                            <p className='text-xs text-muted-foreground'>{new Date(bid.createdAt).toLocaleString('ro-RO')}</p>
                          </div>
                          <p className='font-bold'>
                            {bid.amount} {auctionCar.currency || 'EUR'}
                          </p>
                        </div>
                      ))}
                      {sortedBids.length > 3 && (
                        <div className='text-center py-2'>
                          <p className='text-xs text-muted-foreground'>
                            +{sortedBids.length - 3} mai {sortedBids.length - 3 === 1 ? 'mult' : 'multe'} licitații
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {biddersForStories.length > 0 && <AuctionBidders users={biddersForStories} title='Participanți Licitație' />}
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
                <Button onClick={handleRent} disabled={isPending}>
                  Cere Închiriere
                </Button>
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
                <Button onClick={handleBuy} disabled={isPending}>
                  Cere Ofertă
                </Button>
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
                <Button onClick={handleSellInquiry} disabled={isPending}>
                  Întreabă Vânzătorul
                </Button>
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
                <MapComponent center={mapCenter} zoom={13} filteredCars={[car]} scrollWheelZoom={false} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contactează Vânzătorul</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {car.contactPhone && (
                <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <Phone className='h-5 w-5 text-primary' />
                    <div>
                      <p className='text-xs font-semibold text-muted-foreground'>Telefon Contact</p>
                      <p className='text-sm font-medium'>{car.contactPhone}</p>
                    </div>
                  </div>
                  <Button asChild size='sm'>
                    <a href={`tel:${car.contactPhone}`}>
                      <Phone className='h-4 w-4' />
                    </a>
                  </Button>
                </div>
              )}

              {car.contactEmail && (
                <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <MessageCircle className='h-5 w-5 text-primary' />
                    <div>
                      <p className='text-xs font-semibold text-muted-foreground'>Email Contact</p>
                      <p className='text-sm font-medium truncate'>{car.contactEmail}</p>
                    </div>
                  </div>
                  <Button asChild size='sm'>
                    <a href={`mailto:${car.contactEmail}`}>
                      <MessageCircle className='h-4 w-4' />
                    </a>
                  </Button>
                </div>
              )}

              <div className='flex gap-2 flex-col sm:flex-row mt-4 pt-4 border-t'>
                {car.contactPhone && (
                  <Button asChild className='flex-1'>
                    <a href={`tel:${car.contactPhone}`}>
                      <Phone className='mr-2 h-4 w-4' />
                      Sună Acum
                    </a>
                  </Button>
                )}

                <MessageDrawer
                  carTitle={car.title}
                  onSend={handleSendMessage}
                  disabled={isPending}
                  trigger={
                    <Button variant='secondary' className='flex-1'>
                      <MessageCircle className='mr-2 h-4 w-4' />
                      Trimite Mesaj
                    </Button>
                  }
                />
              </div>

              {!car.contactPhone && !car.contactEmail && (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  Nu sunt disponibile date de contact. Utilizează formularul de mesaj pentru a contacta vânzătorul.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {similarCars.length > 0 && (
        <div className='mt-8 p-4'>
          <Card>
            <CardHeader>
              <CardTitle>Mașini Similare</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <Carousel className='p-4'>
                <CarouselContent containerClassName='gap-4 overflow-visible'>
                  {similarCars.map((c) => (
                    <CarouselItem key={c.id} className='basis-1/1 md:basis-1/2 lg:basis-1/3'>
                      <CarCard car={c} watchDrag={false} />
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

function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    Alb: '#ffffff',
    Negru: '#000000',
    Gri: '#808080',
    Albastru: '#0000ff',
    Rosu: '#ff0000',
    Verde: '#008000',
    Galben: '#ffff00',
    Portocaliu: '#ffa500',
    Violet: '#800080',
    Maro: '#a52a2a',
    Argintiu: '#c0c0c0',
    Auriu: '#ffd700',
    Alta: '#d3d3d3',
  };
  return colorMap[colorName] || '#d3d3d3';
}
