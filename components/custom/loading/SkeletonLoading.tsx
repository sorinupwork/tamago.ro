import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SkeletonLoadingProps = {
  variant: 'auth' | 'profile' | 'default' | 'homepage' | 'auto' | 'story' | 'feed' | 'favorite';
  className?: string;
};

export default function SkeletonLoading({ variant, className }: SkeletonLoadingProps) {
  if (variant === 'auth') {
    return (
      <div className={cn('relative grid min-h-screen lg:grid-cols-2', className)}>
        <div className='flex flex-1 flex-col items-center justify-center p-4 lg:p-0 lg:bg-transparent bg-white/80'>
          <div className='w-full h-full overflow-y-auto'>
            <div className='grid w-full grid-cols-3 h-12 p-1 rounded-none mb-6 gap-4'>
              <Skeleton className='h-10' />
              <Skeleton className='h-10' />
              <Skeleton className='h-10' />
            </div>
            <div className='space-y-6 max-w-md mx-auto'>
              <Skeleton className='h-8 w-3/4 mx-auto' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          </div>
        </div>
        <div className='hidden lg:block h-full relative'>
          <Skeleton className='h-full w-full' />
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className={cn('min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800', className)}>
        <div className='container mx-auto p-6 space-y-8'>
          <Skeleton className='h-32 w-full rounded-lg' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Skeleton className='h-40 w-full' />
            <Skeleton className='h-40 w-full' />
          </div>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      </div>
    );
  }

  if (variant === 'homepage') {
    return (
      <div className={cn('min-h-screen bg-background p-6 space-y-8', className)}>
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-64 w-full rounded-lg' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-40 w-full' />
        </div>
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  if (variant === 'auto') {
    return (
      <div className={cn('w-full gap-4 flex flex-col', className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='space-y-4'>
            <Skeleton className='h-48 w-full rounded-lg' />
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-4 w-full' />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'story') {
    return (
      <div className={cn('flex flex-col transition-all duration-300 hover:shadow-lg w-full max-w-full px-2', className)}>
        <div className='flex-1 min-w-0'>
          <div className='w-full min-w-0 whitespace-nowrap overflow-x-auto'>
            <div className='flex space-x-4 p-4 min-h-[120px]'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='flex flex-col items-center gap-2 shrink-0'>
                  <Skeleton className='w-12 h-12 rounded-full' />
                  <Skeleton className='h-3 w-16' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'feed') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-6 w-32' />
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-10 w-40' />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='overflow-hidden rounded-lg border'>
              <Skeleton className='h-48 w-full' />
              <div className='p-4 space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-1/2' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'favorite') {
    return (
      <div className={cn('p-4 space-y-4', className)}>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex gap-2'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='h-8 w-16' />
            ))}
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-20' />
            <Skeleton className='h-8 w-16' />
          </div>
        </div>
        <div className='flex gap-4 overflow-hidden'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='shrink-0 w-64'>
              <Skeleton className='h-32 w-full rounded' />
              <Skeleton className='h-4 w-3/4 mt-2' />
              <Skeleton className='h-3 w-1/2 mt-1' />
              <Skeleton className='h-8 w-full mt-2' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center min-h-screen', className)}>
      <Skeleton className='h-32 w-32 rounded-full' />
    </div>
  );
}
