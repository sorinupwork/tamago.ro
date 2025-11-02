'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className='flex items-center'>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
