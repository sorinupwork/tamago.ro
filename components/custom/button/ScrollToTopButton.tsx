'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

type Props = {
  containerRef?: React.RefObject<HTMLElement | Element | null>;
  className?: string;
  threshold?: number;
  smooth?: boolean;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
};

type ScrollableElement = {
  scrollTo?: (options: ScrollToOptions) => void;
  scrollTop?: number;
};

export default function ScrollToTopButton({
  containerRef,
  className = '',
  threshold = 10,
  smooth = true,
  ariaLabel = 'Scroll to top',
  size = 'lg',
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let el: HTMLElement | Element | null = null;
    if (containerRef?.current) {
      el = (containerRef.current.querySelector?.('[data-slot="scroll-area-viewport"]') as HTMLElement) || containerRef.current;
    } else {
      el = document.querySelector('main') || document.documentElement;
    }

    const onScroll = () => {
      if (!el) return;
      const scrollTop = (el as HTMLElement).scrollTop ?? 0;
      setVisible(scrollTop > threshold);
    };

    if (el) {
      onScroll();
      el.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => el?.removeEventListener('scroll', onScroll);
  }, [containerRef, threshold]);

  const handleClick = () => {
    let el: HTMLElement | Element | null = null;
    if (containerRef?.current) {
      el = (containerRef.current.querySelector?.('[data-slot="scroll-area-viewport"]') as HTMLElement) || containerRef.current;
    } else {
      el = document.documentElement;
    }
    if (!el) return;

    const target = el as ScrollableElement;

    if (typeof target.scrollTo === 'function') {
      target.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      return;
    }

    if (el === document.documentElement || el === document.body) {
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  if (!visible) return null;

  const sizeClasses = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12';
  return (
    <div className={`${className}`}>
      <Button
        onClick={handleClick}
        variant='outline'
        size='lg'
        className={`rounded-full shadow-lg bg-background hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95 ${sizeClasses}`}
        aria-label={ariaLabel}
      >
        <ChevronUp className='w-5 h-5' />
      </Button>
    </div>
  );
}
