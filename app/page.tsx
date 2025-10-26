import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 text-center flex-1'>
      <h1 className='text-4xl font-bold text-foreground'>În Curând tamago.ro</h1>
      <p className='text-lg text-secondary'>Lucrăm la ceva uimitor. Reveniți în curând!</p>
      <LoadingIndicator />
    </div>
  );
}
