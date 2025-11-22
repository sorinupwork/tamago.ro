'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type LoadResult<T> = { items?: T[]; hasMore?: boolean } | void;

type Props<T> = {
  onLoad?: () => Promise<void> | void;
  loadFn?: (page: number) => Promise<LoadResult<T>>;
  onLoaded?: (result: LoadResult<T>, page: number) => void;
  initialPage?: number;
  auto?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  loadingLabel?: string;
};

export default function LoadMoreButton<T = unknown>({
  onLoad,
  loadFn,
  onLoaded,
  initialPage = 1,
  auto = false,
  loading: externalLoading = false,
  disabled = false,
  className = '',
  label = 'Load More',
  loadingLabel = 'Loading...',
}: Props<T>) {
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState(false);
  const effectiveLoading = externalLoading || loading;

  const handleClick = async () => {
    if (effectiveLoading || disabled) return;

    if (auto && typeof loadFn === 'function') {
      setLoading(true);
      try {
        const nextPage = page + 1;
        const result = await loadFn(nextPage);
        setPage(nextPage);
        onLoaded?.(result, nextPage);
      } catch (err) {
        console.error('LoadMoreButton loadFn error', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (typeof onLoad === 'function') {
      try {
        const res = onLoad();
        if (res instanceof Promise) await res;
      } catch (err) {
        console.error('LoadMoreButton onLoad error', err);
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant='outline'
      size='lg'
      className={`rounded-full shadow-lg bg-background hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
      disabled={disabled || effectiveLoading}
    >
      {effectiveLoading ? loadingLabel : label}
    </Button>
  );
}
