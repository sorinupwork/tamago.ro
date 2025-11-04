import Link from 'next/link';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export function AppLogo() {
  return (
    <Link href='/'>
      <Avatar className="aspect-square rounded">
        <AvatarImage src='/tamago.png' alt='Tamago Logo' />
      </Avatar>
    </Link>
  );
}
