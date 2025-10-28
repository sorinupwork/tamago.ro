import { KeyRound, Wrench, CreditCard, CheckCircle } from 'lucide-react';

export default function DespreNoi() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='bg-card py-6 sm:py-12 px-2 sm:px-4'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-3xl sm:text-4xl font-bold text-center mb-8 text-secondary'>Support pentru Tamago</h1>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6'>
            <div className='bg-muted p-4 sm:p-6 rounded-lg shadow-md hidden md:block' style={{ gridColumn: '1', gridRow: '1 / 3' }}>
              <h2 className='text-xl font-semibold mb-4 text-foreground'>Dispozitive Tamago</h2>
              <p className='text-muted-foreground'>Ghiduri pentru dispozitivele tale Tamago.</p>
            </div>

            <div className='bg-muted p-4 sm:p-6 rounded-lg shadow-md' style={{ gridColumn: '2', gridRow: '1' }}>
              <h2 className='text-xl font-semibold mb-4 text-foreground'>Subiecte Populare</h2>
              <p className='text-muted-foreground'>Întrebări frecvente și soluții.</p>
            </div>

            <div className='bg-muted p-4 sm:p-6 rounded-lg shadow-md' style={{ gridColumn: '2', gridRow: '2' }}>
              <h2 className='text-xl font-semibold mb-4 text-foreground'>Servicii</h2>
              <p className='text-muted-foreground'>Acces rapid la suport.</p>
            </div>

            <div className='bg-muted p-4 sm:p-6 rounded-lg shadow-md hidden sm:block' style={{ gridColumn: '3', gridRow: '1 / 3' }}>
              <h2 className='text-xl font-semibold mb-4 text-foreground'>Telefon Tamago</h2>
              <p className='text-muted-foreground'>Suport pentru telefoanele Tamago.</p>
            </div>

            <div className='bg-muted p-4 sm:p-6 rounded-lg shadow-md' style={{ gridColumn: '4', gridRow: '1' }}>
              <h2 className='text-xl font-semibold mb-4 text-foreground'>Tablet Tamago</h2>
              <p className='text-muted-foreground'>Ghiduri pentru tabletele Tamago.</p>
            </div>

            <div className='bg-muted p-4 sm:p-6 rounded-lg shadow-md' style={{ gridColumn: '4', gridRow: '2' }}>
              <h2 className='text-xl font-semibold mb-4 text-foreground'>Computer Tamago</h2>
              <p className='text-muted-foreground'>Asistență pentru computerele Tamago.</p>
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
