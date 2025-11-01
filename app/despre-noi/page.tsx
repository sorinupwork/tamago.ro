import { KeyRound, Wrench, CreditCard, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function DespreNoi() {
  return (
    <>
      <div className='flex flex-col grow gap-4'>
        <section className='rounded-lg grow'>
          <div className='grid grid-cols-1 sm:grid-cols-7 sm:grid-rows-2 gap-2 min-h-96'>
            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-1 sm:col-end-4 sm:row-span-2 lift relative overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1761429528505-e153940c62a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
                alt='Dispozitive Tamago'
                fill
                className='object-cover'
              />
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-4 sm:col-end-5 lift relative overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80'
                alt='Subiecte Populare'
                fill
                className='object-cover'
              />
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-4 sm:col-end-5 lift relative overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80'
                alt='Servicii'
                fill
                className='object-cover'
              />
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-5 sm:col-end-6 sm:row-start-1 sm:row-end-3 lift relative overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80'
                alt='Telefon Tamago'
                fill
                className='object-cover'
              />
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-6 sm:col-end-8 sm:row-start-1 sm:row-end-2 lift relative overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80'
                alt='Tablet Tamago'
                fill
                className='object-cover'
              />
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-6 sm:col-end-8 lift relative overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80'
                alt='Computer Tamago'
                fill
                className='object-cover'
              />
            </div>
          </div>
        </section>

        <section className='grow rounded-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift group pinch transition-all duration-300'>
              <KeyRound className='w-8 h-8 mx-auto mb-4 text-blue-500 animate-pulse wiggle' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Resetare Parolă</h3>
              <p className='text-muted-foreground'>Ajutor pentru resetarea parolei.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift group pinch transition-all duration-300'>
              <Wrench className='w-8 h-8 mx-auto mb-4 text-green-500 animate-pulse wiggle' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Reparații Tamago</h3>
              <p className='text-muted-foreground'>Servicii de reparații pentru dispozitivele tale.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift group pinch transition-all duration-300'>
              <CreditCard className='w-8 h-8 mx-auto mb-4 text-purple-500 animate-pulse wiggle' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Facturare și Abonamente</h3>
              <p className='text-muted-foreground'>Gestionarea facturilor și abonamentelor.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift group pinch transition-all duration-300'>
              <CheckCircle className='w-8 h-8 mx-auto mb-4 text-red-500 animate-pulse wiggle' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Procese Verificate</h3>
              <p className='text-muted-foreground'>Verificarea și procesarea cererilor.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
