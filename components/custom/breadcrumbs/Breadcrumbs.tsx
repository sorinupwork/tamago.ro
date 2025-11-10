'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className='flex items-center'>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                item.href.startsWith('/') ? (
                  <Link href={item.href} className='cursor-default text-muted-foreground hover:text-foreground'>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className='cursor-default text-muted-foreground hover:text-foreground'>
                    {item.label}
                  </a>
                )
              ) : (
                <BreadcrumbPage className='cursor-default'>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
