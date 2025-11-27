import Link from 'next/link';
import Image from 'next/image';
import { Dot } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Footer() {
  const partners = [
    { src: '/icons/facebook.svg', alt: 'Facebook', colorClass: 'text-blue-500' },
    { src: '/icons/instagram.svg', alt: 'Instagram', colorClass: 'text-purple-500' },
    { src: '/icons/google.svg', alt: 'Google', colorClass: 'text-blue-600' },
    { src: '/icons/mongodb.svg', alt: 'MongoDB', colorClass: 'text-green-500' },
    { src: '/icons/react.svg', alt: 'React', colorClass: 'text-blue-400' },
    { src: '/icons/nextdotjs.svg', alt: 'Next.js', colorClass: 'text-gray-800' },
    { src: '/icons/tailwindcss.svg', alt: 'Tailwind CSS', colorClass: 'text-gray-800' },
    { src: '/icons/resend.svg', alt: 'Resend', colorClass: 'text-indigo-500' },
    { src: '/icons/betterauth.svg', alt: 'BetterAuth', colorClass: 'text-yellow-500' },
  ];

  return (
    <footer className='border-t'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8'>
        <div className='text-center'>
          <h3 className='font-semibold mb-2'>Legal</h3>

          <div className='space-y-2 md:space-y-4 flex flex-col items-center'>
            <Button variant='link' size='sm' className='hover:scale-103 transition-transform text-secondary' asChild>
              <Link href='/termeni-conditii' className='flex items-center'>
                <Dot className='mr-2 ' />
                <span className='underline-offset-4 hover:underline '>Termeni și condiții</span>
              </Link>
            </Button>
            <Button variant='link' size='sm' className='hover:scale-103 transition-transform text-secondary' asChild>
              <Link href='/politica-confidentialitate' className='flex items-center'>
                <Dot className='mr-2' />
                <span className='underline-offset-4 hover:underline'>Confidențialitate</span>
              </Link>
            </Button>
            <Button variant='link' size='sm' className='hover:scale-103 transition-transform text-secondary' asChild>
              <Link href='/politica-cookies' className='flex items-center'>
                <Dot className='mr-2' />
                <span className='underline-offset-4 hover:underline'>Politica cookies</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className='text-center'>
          <h3 className='font-semibold mb-2'>My App</h3>
          <div className='space-y-2 md:space-y-4 flex flex-col items-center'>
            <Button variant='ghost' size='sm' className='hover:scale-103 transition-transform cursor-de' asChild>
              <Link href='https://apps.apple.com' target='_blank'>
                <Image src='/icons/appstore.svg' alt='App Store' width={16} height={16} className='mr-2 dark:invert' />
                Descarcă iOS
              </Link>
            </Button>
            <Button variant='ghost' size='sm' className='hover:scale-103 transition-transform' asChild>
              <Link href='https://play.google.com' target='_blank'>
                <Image src='/icons/googleplay.svg' alt='Google Play' width={16} height={16} className='mr-2 dark:invert' />
                Descarcă Android
              </Link>
            </Button>
            <p className='text-sm text-muted-foreground'>Versiunea curentă: 1.0.0</p>
          </div>
        </div>
        <div className='text-center'>
          <h3 className='font-semibold mb-2'>Social Media</h3>
          <div className='space-y-2 md:space-y-4 flex flex-col items-center'>
            <Button variant='outline' size='sm' className='hover:scale-103 transition-transform' asChild>
              <Link href='https://facebook.com' target='_blank'>
                <Image src='/icons/facebook.svg' alt='Facebook' width={16} height={16} className='mr-2 text-blue-500 dark:invert' />
                Facebook
              </Link>
            </Button>
            <Button variant='outline' size='sm' className='hover:scale-103 transition-transform' asChild>
              <Link href='https://instagram.com' target='_blank'>
                <Image src='/icons/instagram.svg' alt='Instagram' width={16} height={16} className='mr-2 text-purple-500 dark:invert' />
                Instagram
              </Link>
            </Button>
          </div>
        </div>
        <div className='text-center'>
          <h3 className='font-semibold mb-2'>Parteneri</h3>
          <div className='flex flex-wrap justify-center items-center gap-4'>
            {partners.map((p) => (
              <div
                key={p.src}
                className='relative flex-none w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 transform transition-transform duration-300 hover:scale-105 cursor-default lift'
                aria-hidden={false}
                title={p.alt}
              >
                <Image src={p.src} alt={p.alt} fill className={`object-contain dark:invert ${p.colorClass} hover:text-primary`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='text-center text-sm text-muted-foreground mt-4'>© 2025 Tamago. Toate drepturile rezervate.</div>
    </footer>
  );
}
