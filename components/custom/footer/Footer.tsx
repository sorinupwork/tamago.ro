import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className='bg-muted border-t'>
      <div className='px-4 py-2'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='text-center'>
            <h3 className='font-semibold mb-2'>Despre noi</h3>
            <ul className='space-y-1 text-sm'>
              <li>
                <Link href='/despre-noi' className='hover:underline'>
                  Echipa noastră
                </Link>
              </li>
              <li>
                <Link href='/politica-confidentialitate' className='hover:underline'>
                  Politica de confidențialitate
                </Link>
              </li>
              <li>
                <Link href='/termeni-conditii' className='hover:underline'>
                  Termeni și condiții
                </Link>
              </li>
            </ul>
          </div>
          <div className='text-center'>
            <h3 className='font-semibold mb-2'>Contact</h3>
            <ul className='space-y-1 text-sm'>
              <li>Email: contact@tamago.ro</li>
              <li>Telefon: +40 123 456 789</li>
              <li>
                <Link href='/contact' className='hover:underline'>
                  Formular de contact
                </Link>
              </li>
            </ul>
          </div>
          <div className='text-center'>
            <h3 className='font-semibold mb-2'>Aplicație mobilă</h3>
            <ul className='space-y-1 text-sm'>
              <li>Descarcă pentru iOS</li>
              <li>Descarcă pentru Android</li>
              <li>Versiunea curentă: 1.0.0</li>
            </ul>
          </div>
          <div className='text-center'>
            <h3 className='font-semibold mb-2'>Social Media</h3>
            <ul className='space-y-1 text-sm flex flex-col items-center'>
              <li>
                <Link href='https://facebook.com' target='_blank' className='hover:underline flex items-center'>
                  <Image src='/icons/facebook.svg' alt='Facebook' width={16} height={16} className='mr-2' />
                  Facebook
                </Link>
              </li>
              <li>
                <Link href='https://instagram.com' target='_blank' className='hover:underline flex items-center'>
                  <Image src='/icons/instagram.svg' alt='Instagram' width={16} height={16} className='mr-2' />
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='text-center text-sm text-muted-foreground mt-4'>© 2025 Tamago. Toate drepturile rezervate.</div>
      </div>
    </footer>
  );
}
