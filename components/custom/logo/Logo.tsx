import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Logo() {
  return (
    <Link href='/' className='flex items-center gap-2 font-bold text-lg'>
      <Zap className='h-6 w-6' />
      tamago
    </Link>
  );
}
