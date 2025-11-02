export default function MoreInfo() {
  return (
    <section className='bg-background py-12 px-4'>
      <h2 className='text-3xl font-bold text-center mb-8 text-secondary'>Mai Multe Resurse</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-muted p-4 rounded-lg'>
          <h3 className='text-xl font-semibold mb-4 text-foreground'>Ghiduri Detaliate</h3>
          <p className='text-muted-foreground'>
            Descoperă tutoriale pas cu pas pentru a maximiza utilizarea dispozitivelor Tamago. De la configurare inițială până la funcții
            avansate, avem totul acoperit.
          </p>
        </div>
        <div className='bg-muted p-4 rounded-lg'>
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
