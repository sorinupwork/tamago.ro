import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoadingProps {
  variant: 'auth' | 'profile' | 'default';
}

export default function SkeletonLoading({ variant }: SkeletonLoadingProps) {
  if (variant === 'auth') {
    return (
      <div className='relative grid min-h-screen lg:grid-cols-2'>
        <div className='flex flex-1 flex-col items-center justify-center p-4 lg:p-0 lg:bg-transparent bg-white/80'>
          <div className='w-full h-full overflow-y-auto'>
            <div className='grid w-full grid-cols-3 h-12 p-1 rounded-none mb-6'>
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
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
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

  // Default skeleton
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Skeleton className='h-32 w-32 rounded-full' />
    </div>
  );
}
