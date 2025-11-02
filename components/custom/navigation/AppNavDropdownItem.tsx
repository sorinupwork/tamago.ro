import * as React from 'react';
import Link from 'next/link';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

export function AppNavDropdownItem({
  title,
  children,
  href,
  linkClassName,
  titleClass,
  pClass,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  href: string;
  linkClassName?: string;
  titleClass?: string;
  pClass?: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className={linkClassName}>
          <div className={`text-sm leading-none font-medium ${titleClass || ''}`}>{title}</div>
          <p className={`text-muted-foreground line-clamp-2 text-sm leading-snug ${pClass || ''}`}>{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
