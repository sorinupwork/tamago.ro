'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { CarouselCard } from '../card/CarouselCard';
import { LuckyNumber } from '../text/LuckyNumber';

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

export default function AppInvertedCarousel({ category, rowAItems, rowBItems, navigateTo, categoryColors }: AppInvertedCarouselProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 0);
  }, []);

  const [apiA, setApiA] = useState<CarouselApi | undefined>(undefined);
  const [currentA, setCurrentA] = useState(0);
  const [apiB, setApiB] = useState<CarouselApi | undefined>(undefined);
  const [currentB, setCurrentB] = useState(() => Math.max(0, rowBItems.length - 1));

  const isSyncing = useRef(false);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const prevARef = useRef<number | null>(null);
  const prevBRef = useRef<number | null>(Math.max(0, rowBItems.length - 1));

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
      if (prevARef.current == null) {
        setCurrentA(apiA.selectedScrollSnap());
        prevARef.current = apiA.selectedScrollSnap();
      }
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
      if (prevBRef.current == null) {
        setCurrentB(apiB.selectedScrollSnap());
        prevBRef.current = apiB.selectedScrollSnap();
      }
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
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!apiA || !apiB) return;

    const tick = () => {
      if (pausedRef.current || isSyncing.current) return;
      try {
        isSyncing.current = true;
        apiA.scrollNext();
        apiB.scrollPrev();
      } catch {}
      setTimeout(() => (isSyncing.current = false), 150);
    };

    timerRef.current = window.setInterval(tick, 4500);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [apiA, apiB]);

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
        className={`my-4 sm:mt-6 px-0 relative overflow-y-visible ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500`}
      >
        <div className='flex justify-center'>
          <Carousel
            setApi={setApi}
            opts={opts}
            className='w-full max-w-3xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl overflow-visible'
            autoplay={false}
            autoplayInterval={4500}
            pauseOnHover={true}
          >
            <CarouselContent className='gap-6' containerClassName='overflow-visible'>
              {items.map((sub, i) => {
                const origIndex = offset + i;
                const length = items.length || 1;
                const normalized = ((currentIndex % length) + length) % length;
                const navigate = () => navigateTo(category, sub.title ? sub.title.toLowerCase().replace(' ', '-') : undefined);
                return (
                  <CarouselItem
                    key={`${apiKeyPrefix}-${origIndex}`}
                    className='basis-full sm:basis-1/2 lg:basis-1/3 justify-center relative mx-2'
                  >
                    <CarouselCard
                      origIndex={origIndex}
                      isActive={normalized === i}
                      categoryColors={categoryColors}
                      category={category}
                      sub={sub}
                      onClick={navigate}
                    />

                    <LuckyNumber number={origIndex + 1} isActive={normalized === i} category={category} />
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
    <div
      className='flex grow flex-col gap-6'
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {RenderRow({
        items: rowAItems,
        setApi: setApiA,
        currentIndex: currentA,
        offset: 0,
        apiKeyPrefix: 'a',
        opts: { align: 'center', loop: true, startIndex: 0 },
      })}

      {RenderRow({
        items: rowBItems,
        setApi: setApiB,
        currentIndex: currentB,
        offset: 0,
        apiKeyPrefix: 'b',
        opts: { align: 'center', loop: true, startIndex: Math.max(0, rowBItems.length - 1) },
      })}
    </div>
  );
}
