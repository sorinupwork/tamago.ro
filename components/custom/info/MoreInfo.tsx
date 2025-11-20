export default function MoreInfo() {
  return (
    <section className='bg-background w-full max-w-7xl mx-auto p-4'>
      <h2 className='text-2xl font-bold text-center sm:text-end mb-8 text-secondary hover:shine'>Mai Multe Resurse</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-muted p-4 rounded-lg shine'>
          <h3 className='text-xl font-semibold mb-4 text-foreground'>Ghiduri Detaliate</h3>
          <p className='text-muted-foreground'>
            Descoperă tutoriale pas cu pas pentru a maximiza utilizarea dispozitivelor Tamago. De la configurare inițială până la funcții
            avansate, avem totul acoperit.
          </p>
        </div>

        <div className='bg-muted p-4 rounded-lg shine'>
          <h3 className='text-xl font-semibold mb-4 text-foreground'>Comunitate și Suport</h3>
          <p className='text-muted-foreground'>
            Alătură-te comunității Tamago pentru sfaturi, discuții și ajutor de la alți utilizatori. Suportul nostru este întotdeauna la un
            click distanță.
          </p>
        </div>
      </div>
    </section>
  );
}
