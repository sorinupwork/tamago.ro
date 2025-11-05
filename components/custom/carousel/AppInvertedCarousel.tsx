'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

type Subcategory = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

type AppInvertedCarouselProps = {
  category: string;
  rowAItems: Subcategory[];
  rowBItems: Subcategory[];
  navigateTo: (catKey: string, sub?: string) => void;
  categoryColors: Record<string, { text: string; icon: string; arrow: string }>;
};

export function AppInvertedCarousel({ category, rowAItems, rowBItems, navigateTo, categoryColors }: AppInvertedCarouselProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 0);
  }, []);

  const [apiA, setApiA] = useState<CarouselApi | undefined>(undefined);
  const [currentA, setCurrentA] = useState(0);
  const [apiB, setApiB] = useState<CarouselApi | undefined>(undefined);
  const [currentB, setCurrentB] = useState(0);

  const isSyncing = useRef(false);

  const autoplayA = useRef<number | null>(null);
  const autoplayB = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);

  const lastAutoA = useRef<number | null>(null);
  const lastAutoB = useRef<number | null>(null);
  const prevARef = useRef<number | null>(null);
  const prevBRef = useRef<number | null>(null);

  const normalizeDelta = useCallback((delta: number, length: number) => {
    if (!length) return delta;
    if (Math.abs(delta) > length / 2) {
      return delta > 0 ? delta - length : delta + length;
    }
    return delta;
  }, []);

  const onSelectA = useCallback(() => {
    if (!apiA) return;
    const aIndex = apiA.selectedScrollSnap();
    setCurrentA(aIndex);
    const now = Date.now();
    if (!apiB || isSyncing.current) {
      prevARef.current = aIndex;
      return;
    }

    if (lastAutoA.current && now - lastAutoA.current < 600) {
      prevARef.current = aIndex;
      return;
    }

    const prev = prevARef.current ?? aIndex;
    let delta = aIndex - prev;
    delta = normalizeDelta(delta, apiA.scrollSnapList().length || 1);

    const bCount = apiB.scrollSnapList().length || 1;
    const currentBIndex = apiB.selectedScrollSnap();
    const targetB = (((currentBIndex - delta) % bCount) + bCount) % bCount;

    isSyncing.current = true;
    apiB.scrollTo(targetB);
    prevARef.current = aIndex;
    setTimeout(() => (isSyncing.current = false), 150);
  }, [apiA, apiB, normalizeDelta]);

  const onSelectB = useCallback(() => {
    if (!apiB) return;
    const bIndex = apiB.selectedScrollSnap();
    setCurrentB(bIndex);
    const now = Date.now();
    if (!apiA || isSyncing.current) {
      prevBRef.current = bIndex;
      return;
    }
    if (lastAutoB.current && now - lastAutoB.current < 600) {
      prevBRef.current = bIndex;
      return;
    }

    const prev = prevBRef.current ?? bIndex;
    let delta = bIndex - prev;
    delta = normalizeDelta(delta, apiB.scrollSnapList().length || 1);

    const aCount = apiA.scrollSnapList().length || 1;
    const currentAIndex = apiA.selectedScrollSnap();
    const targetA = (((currentAIndex - delta) % aCount) + aCount) % aCount;

    isSyncing.current = true;
    apiA.scrollTo(targetA);
    prevBRef.current = bIndex;
    setTimeout(() => (isSyncing.current = false), 150);
  }, [apiA, apiB, normalizeDelta]);

  useEffect(() => {
    if (!apiA) return;

    const onInitA = () => {
      setCurrentA(apiA.selectedScrollSnap());
      prevARef.current = apiA.selectedScrollSnap();
    };

    apiA.on('init', onInitA);
    apiA.on('select', onSelectA);
    return () => {
      apiA.off('init', onInitA);
      apiA.off('select', onSelectA);
    };
  }, [apiA, onSelectA]);

  useEffect(() => {
    if (!apiB) return;

    const onInitB = () => {
      setCurrentB(apiB.selectedScrollSnap());
      prevBRef.current = apiB.selectedScrollSnap();
    };

    apiB.on('init', onInitB);
    apiB.on('select', onSelectB);
    return () => {
      apiB.off('init', onInitB);
      apiB.off('select', onSelectB);
    };
  }, [apiB, onSelectB]);

  useEffect(() => {
    if (!apiA) return;
    if (autoplayA.current) {
      clearInterval(autoplayA.current);
      autoplayA.current = null;
    }
    if (playing) {
      autoplayA.current = window.setInterval(() => {
        if (!isSyncing.current) {
          lastAutoA.current = Date.now();
          apiA.scrollNext();
        }
      }, 4500);
    }
    return () => {
      if (autoplayA.current) {
        clearInterval(autoplayA.current);
        autoplayA.current = null;
      }
    };
  }, [apiA, playing]);

  useEffect(() => {
    if (!apiB) return;
    if (autoplayB.current) {
      clearInterval(autoplayB.current);
      autoplayB.current = null;
    }
    if (playing) {
      autoplayB.current = window.setInterval(() => {
        if (!isSyncing.current) {
          lastAutoB.current = Date.now();
          apiB.scrollPrev();
        }
      }, 4500);
    }
    return () => {
      if (autoplayB.current) {
        clearInterval(autoplayB.current);
        autoplayB.current = null;
      }
    };
  }, [apiB, playing]);

  return (
    <>
      {/* Top carousel (first half) */}
      <section
        className={`mt-4 sm:mt-6 px-0 relative overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      >
        <div onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(true)} className='flex justify-center'>
          <Carousel
            setApi={setApiA}
            opts={{ align: 'center', loop: true }}
            className='w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'
          >
            <CarouselContent className='gap-6'>
              {rowAItems.map((sub, i) => {
                const origIndex = i;
                const navigate = () => navigateTo(category, sub.title ? sub.title.toLowerCase().replace(' ', '-') : undefined);
                return (
                  <CarouselItem key={`a-${sub.id}`} className='basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 flex justify-center'>
                    <div
                      onClick={navigate}
                      role='button'
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate();
                        }
                      }}
                      className='p-2 relative focus:outline-none'
                    >
                      <span
                        aria-hidden
                        className={`absolute left-4 -top-2 text-[30px] sm:text-[50px] md:text-[70px] lg:text-[90px] xl:text-[110px] font-extrabold pointer-events-none select-none z-20 transition-colors ${
                          currentA === i
                            ? `${categoryColors[category]?.text ?? 'text-primary'}`
                            : 'text-muted-foreground/10 dark:text-muted-foreground/12'
                        }`}
                        style={{ transform: 'translateX(-50%)' }}
                      >
                        {origIndex + 1}
                      </span>
                      <Card className='lift cursor-pointer'>
                        <CardContent className='flex flex-col'>
                          <div className='absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full'>
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
                                categoryColors[category]?.icon ?? 'text-primary'
                              }`}
                            >
                              <sub.icon />
                            </div>
                          </div>
                          <div className='text-center flex-1 px-2'>
                            <h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight'>
                              {sub.title}
                            </h3>
                            <p className='text-xs sm:text-sm text-muted-foreground mt-1 leading-snug line-clamp-2'>{sub.description}</p>
                          </div>
                          <div className='flex justify-end mt-4'>
                            <Button
                              variant='link'
                              size='sm'
                              className={`${categoryColors[category]?.text ?? 'text-primary'} hover:opacity-80 p-0`}
                            >
                              Explorează{' '}
                              <ArrowRight className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 ${categoryColors[category]?.arrow ?? 'text-primary'}`} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Bottom carousel (second half) */}
      <section className='mt-4 sm:mt-6 px-0 relative overflow-hidden'>
        <div onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(true)} className='flex justify-center'>
          <Carousel
            setApi={setApiB}
            opts={{ align: 'center', loop: true }}
            className='w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'
          >
            <CarouselContent className='gap-6'>
              {rowBItems.map((sub, j) => {
                const origIndex = rowAItems.length + j;
                const navigate = () => navigateTo(category, sub.title ? sub.title.toLowerCase().replace(' ', '-') : undefined);
                return (
                  <CarouselItem key={`b-${sub.id}`} className='basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 flex justify-center'>
                    <div
                      onClick={navigate}
                      role='button'
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate();
                        }
                      }}
                      className='p-2 relative focus:outline-none'
                    >
                      <span
                        aria-hidden
                        className={`absolute left-4 -top-2 text-[30px] sm:text-[50px] md:text-[70px] lg:text-[90px] xl:text-[110px] font-extrabold pointer-events-none select-none z-20 transition-colors ${
                          currentB === j
                            ? `${categoryColors[category]?.text ?? 'text-primary'}`
                            : 'text-muted-foreground/10 dark:text-muted-foreground/12'
                        }`}
                        style={{ transform: 'translateX(-50%)' }}
                      >
                        {origIndex + 1}
                      </span>
                      <Card className='lift cursor-pointer'>
                        <CardContent className='flex flex-col'>
                          <div className='absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full'>
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
                                categoryColors[category]?.icon ?? 'text-primary'
                              }`}
                            >
                              <sub.icon />
                            </div>
                          </div>
                          <div className='text-center flex-1 px-2'>
                            <h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight'>
                              {sub.title}
                            </h3>
                            <p className='text-xs sm:text-sm text-muted-foreground mt-1 leading-snug line-clamp-2'>{sub.description}</p>
                          </div>
                          <div className='flex justify-end mt-4'>
                            <Button
                              variant='link'
                              size='sm'
                              className={`${categoryColors[category]?.text ?? 'text-primary'} hover:opacity-80 p-0`}
                            >
                              Explorează{' '}
                              <ArrowRight className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 ${categoryColors[category]?.arrow ?? 'text-primary'}`} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </>
  );
}
