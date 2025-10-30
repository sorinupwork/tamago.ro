import { KeyRound, Wrench, CreditCard, CheckCircle } from 'lucide-react';

export default function DespreNoi() {
  return (
    <div>
      <section className='bg-muted py-4 px-2 rounded-xs'>
        <div className='w-full max-w-7xl mx-auto'>
          <h1 className='text-3xl sm:text-4xl font-bold text-center mb-8 text-secondary'>Support pentru Tamago</h1>
          <div className='grid grid-cols-1 sm:grid-cols-6 sm:grid-rows-2 gap-2'>
            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-1 sm:col-end-3 sm:row-span-2'>
              <h2 className='text-xl font-semibold mb-4 text-foreground text-pretty'>Dispozitive Tamago</h2>
              <p className='text-muted-foreground text-pretty'>Ghiduri pentru dispozitivele tale Tamago.</p>
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-3 sm:col-end-4'>
              <h2 className='text-xl font-semibold mb-4 text-foreground text-pretty'>Subiecte Populare</h2>
              <p className='text-muted-foreground text-pretty'>Întrebări frecvente și soluții.</p>
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-3 sm:col-end-4'>
              <h2 className='text-xl font-semibold mb-4 text-foreground text-pretty'>Servicii</h2>
              <p className='text-muted-foreground text-pretty'>Acces rapid la suport.</p>
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-4 sm:col-end-5 sm:row-start-1 sm:row-end-3'>
              <h2 className='text-xl font-semibold mb-4 text-foreground text-pretty'>Telefon Tamago</h2>
              <p className='text-muted-foreground text-pretty'>Suport pentru telefoanele Tamago.</p>
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-5 sm:col-end-7 sm:row-start-1 sm:row-end-2'>
              <h2 className='text-xl font-semibold mb-4 text-foreground text-pretty'>Tablet Tamago</h2>
              <p className='text-muted-foreground text-pretty'>Ghiduri pentru tabletele Tamago.</p>
            </div>

            <div className='bg-card p-2 rounded-lg shadow-md sm:col-start-5 sm:col-end-7'>
              <h2 className='text-xl font-semibold mb-4 text-foreground text-pretty'>Computer Tamago</h2>
              <p className='text-muted-foreground text-pretty'>Asistență pentru computerele Tamago.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-muted py-12 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-8 text-secondary'>Opțiuni de Suport</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift'>
              <KeyRound className='w-8 h-8 mx-auto mb-4 text-foreground' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Resetare Parolă</h3>
              <p className='text-muted-foreground'>Ajutor pentru resetarea parolei.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift'>
              <Wrench className='w-8 h-8 mx-auto mb-4 text-foreground' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Reparații Tamago</h3>
              <p className='text-muted-foreground'>Servicii de reparații pentru dispozitivele tale.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift'>
              <CreditCard className='w-8 h-8 mx-auto mb-4 text-foreground' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Facturare și Abonamente</h3>
              <p className='text-muted-foreground'>Gestionarea facturilor și abonamentelor.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-md text-center lift'>
              <CheckCircle className='w-8 h-8 mx-auto mb-4 text-foreground' />
              <h3 className='text-lg font-semibold mb-2 text-foreground'>Procese Verificate</h3>
              <p className='text-muted-foreground'>Verificarea și procesarea cererilor.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
