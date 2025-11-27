import Link from 'next/link';

import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function AppLogo() {
  return (
    <Link href='/' className='cursor-default shine'>
      <Avatar className="aspect-square rounded">
        <AvatarImage src='/logo.png' alt='Tamago Logo' />
      </Avatar>
    </Link>
  );
}
