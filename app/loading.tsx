import LoadingIndicator from '../components/custom/loading/LoadingIndicator';

export default function Loading() {
  return (
    <div className='flex-1 flex items-center justify-center bg-background p-4'>
      <LoadingIndicator />
    </div>
  );
}
