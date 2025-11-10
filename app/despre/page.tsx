import { KeyRound, Wrench, CreditCard, CheckCircle } from 'lucide-react';

import MarketplaceContactSection from '@/components/custom/marketplace/MarketplaceContactSection';
import AppPlatinumSection from '@/components/custom/section/AppPlatinumSection';

export default function DespreNoi() {
  const servicesCards = [
    {
      icon: <KeyRound className='text-blue-500' />,
      title: 'Resetare Parolă',
      description: 'Ajutor pentru resetarea parolei.',
    },
    {
      icon: <Wrench className='text-green-500' />,
      title: 'Reparații Tamago',
      description: 'Servicii de reparații pentru dispozitivele tale.',
    },
    {
      icon: <CreditCard className='text-purple-500' />,
      title: 'Facturare și Abonamente',
      description: 'Gestionarea facturilor și abonamentelor.',
    },
    {
      icon: <CheckCircle className='text-red-500' />,
      title: 'Procese Verificate',
      description: 'Verificarea și procesarea cererilor.',
    },
  ];

  const platinumImages = [
    {
      src: 'https://images.unsplash.com/photo-1761429528505-e153940c62a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
      alt: 'Dispozitive Tamago',
      gridClasses: 'sm:col-start-1 sm:col-end-4 sm:row-span-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80',
      alt: 'Subiecte Populare',
      gridClasses: 'sm:col-start-4 sm:col-end-5',
    },
    {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80',
      alt: 'Servicii',
      gridClasses: 'sm:col-start-4 sm:col-end-5',
    },
    {
      src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80',
      alt: 'Telefon Tamago',
      gridClasses: 'sm:col-start-5 sm:col-end-6 sm:row-start-1 sm:row-end-3',
    },
    {
      src: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80',
      alt: 'Tablet Tamago',
      gridClasses: 'sm:col-start-6 sm:col-end-8 sm:row-start-1 sm:row-end-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.1.0&auto=format&fit=crop&w=687&q=80',
      alt: 'Computer Tamago',
      gridClasses: 'sm:col-start-6 sm:col-end-8',
    },
  ];

  return (
    <>
      <div className='flex flex-col grow gap-4'>
        <AppPlatinumSection images={platinumImages} />

        <MarketplaceContactSection
          title='Serviciile Noastre'
          description='Descoperă serviciile oferite de Tamago pentru a te ajuta cu dispozitivele și conturile tale.'
          cards={servicesCards}
          showMap={false}
          gridCols='grid-cols-1 md:grid-cols-4'
          className='max-w-7xl mx-auto'
        />
      </div>
    </>
  );
}
