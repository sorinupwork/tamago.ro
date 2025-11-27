'use client';

import { useState, useEffect, useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type LoadResult<T> = { items?: T[]; hasMore?: boolean } | void;

type ActionState = { success?: boolean; error?: string } | null;

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
  type?: 'button' | 'submit';
  action?: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
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
  type = 'button',
  action,
}: Props<T>) {
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState(false);

  const noopAction = async () => null;
  const [actionState, formAction, pendingAction] = useActionState(
    (action ?? noopAction) as (prevState: ActionState, formData: FormData) => Promise<ActionState>,
    null
  );

  useEffect(() => {
    if (actionState?.error) {
      toast.error(actionState.error);
    }
  }, [actionState]);

  const effectiveLoading = externalLoading || loading || Boolean(pendingAction);

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

  const btn = (
    <Button
      onClick={action ? undefined : handleClick}
      variant='outline'
      size='lg'
      className={`rounded-full shadow-lg bg-background hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
      disabled={disabled || effectiveLoading}
      type={type}
    >
      {effectiveLoading ? loadingLabel : label}
    </Button>
  );

  if (action && formAction) {
    return <form action={formAction}>{btn}</form>;
  }

  return btn;
}
