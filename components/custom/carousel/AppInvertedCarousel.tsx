'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { CarouselCard } from './CarouselCard';
import { LuckyNumber } from '../LuckyNumber';

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
    if (!apiB || isSyncing.current) {
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
    if (!apiA || isSyncing.current) {
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

    const onPointerDownA = () => {
      prevARef.current = apiA.selectedScrollSnap();
    };

    apiA.on('init', onInitA);
    apiA.on('select', onSelectA);
    apiA.on('pointerDown', onPointerDownA);

    return () => {
      apiA.off('init', onInitA);
      apiA.off('select', onSelectA);
      apiA.off('pointerDown', onPointerDownA);
    };
  }, [apiA, onSelectA]);

  useEffect(() => {
    if (!apiB) return;

    const onInitB = () => {
      setCurrentB(apiB.selectedScrollSnap());
      prevBRef.current = apiB.selectedScrollSnap();
    };

    const onPointerDownB = () => {
      prevBRef.current = apiB.selectedScrollSnap();
    };

    apiB.on('init', onInitB);
    apiB.on('select', onSelectB);
    apiB.on('pointerDown', onPointerDownB);

    return () => {
      apiB.off('init', onInitB);
      apiB.off('select', onSelectB);
      apiB.off('pointerDown', onPointerDownB);
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

  const RenderRow = ({
    items,
    setApi,
    currentIndex,
    offset,
    apiKeyPrefix,
    opts,
  }: {
    items: Subcategory[];
    setApi: (api?: CarouselApi) => void;
    currentIndex: number;
    offset: number;
    apiKeyPrefix: string;
    opts: { align: 'start' | 'center' | 'end'; loop: boolean; startIndex: number };
  }) => {
    return (
      <section
        className={`mt-4 sm:mt-6 px-0 relative overflow-y-visible ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500`}
      >
        <div onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(true)} className='flex justify-center'>
          <Carousel
            setApi={setApi}
            opts={opts}
            className='w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl overflow-visible'
          >
            <CarouselContent className='gap-6' containerClassName='overflow-visible'>
              {items.map((sub, i) => {
                const origIndex = offset + i;
                const navigate = () => navigateTo(category, sub.title ? sub.title.toLowerCase().replace(' ', '-') : undefined);
                return (
                  <CarouselItem
                    key={`${apiKeyPrefix}-${origIndex}`}
                    className='basis-full sm:basis-1/2 lg:basis-1/3 flex-justify-center relative'
                  >
                    <CarouselCard
                      origIndex={origIndex}
                      isActive={currentIndex === i}
                      categoryColors={categoryColors}
                      category={category}
                      sub={sub}
                      onClick={navigate}
                    />

                    <LuckyNumber number={origIndex + 1} isActive={currentIndex === i} category={category} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* Top carousel */}
      {RenderRow({
        items: rowAItems,
        setApi: setApiA,
        currentIndex: currentA,
        offset: 0,
        apiKeyPrefix: 'a',
        opts: { align: 'center', loop: true, startIndex: 0 },
      })}

      {/* Bottom carousel */}
      {RenderRow({
        items: rowBItems,
        setApi: setApiB,
        currentIndex: currentB,
        offset: 0,
        apiKeyPrefix: 'b',
        opts: { align: 'center', loop: true, startIndex: 16 },
      })}
    </>
  );
}
