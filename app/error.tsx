'use client';

import ErrorAlert from '../components/custom/error/ErrorAlert';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className='flex grow items-center justify-center bg-background p-4'>
      <div className='text-center'>
        <ErrorAlert message='Ceva nu a mers bine.' onClose={reset} buttonText='Încearcă din nou' />
      </div>
    </div>
  );
}
